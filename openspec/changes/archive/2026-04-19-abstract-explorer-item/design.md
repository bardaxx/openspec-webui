## Context

ExplorerPane（282行）は3つのセクション（ACTIVE CHANGES / ARCHIVE / SPECS）を持ち、各セクションで以下のパターンが重複している：

1. **EmptyState 条件分岐**: `{#if items.length === 0} <EmptyState>` → `{:else} {#each}`
2. **ItemContextMenu + button ラッパー**: 各アイテムを ContextMenu → button 構造でラップ
3. **アイテム描画ロジック**: クリックハンドラ、選択状態クラス、セカンドライン情報

現在のコンポーネント階層：
```
ExplorerPane
  └── ExplorerSection × 3
        └── <div class="divide-y">
              ├── {#if empty} EmptyState
              └── {#each items}
                    └── ItemContextMenu
                          └── <button> (item content)
```

配置規約（リファクタリング後）：
- `ui/` = 汎用プリミティブ（badge, button, collapsible...）
- `shared/` = アプリ固有共有（explorer-section, item-context-menu, empty-state...）
- `layout/` = レイアウト（ExplorerPane, ActivityBar...）

## Goals / Non-Goals

**Goals:**
- ExplorerItem コンポーネントで ItemContextMenu + button パターンをカプセル化
- ExplorerSection に `emptyMessage` / `emptyIcon` props を追加し、空状態表示を内部化
- ExplorerPane を宣言的なセクション定義に簡素化（重複パターンの除去）
- ヘルパー関数（handleItemClick, itemClass 等）を ExplorerItem 内に集約

**Non-Goals:**
- ItemContextMenu コンポーネント自体の変更はしない
- ExplorerSection のヘッダー描画ロジックの変更はしない
- ExplorerPane のプロジェクトヘッダー部分の変更はしない
- タブ・レイアウトストアの状態管理の変更はしない

## Decisions

### D1: ExplorerItem の配置先 → `shared/explorer-item/`

**選択**: `$lib/components/shared/explorer-item/`
**理由**: ExplorerItem は tabStore, layoutStore, uiPreferencesStore に依存し、アプリ固有のロジックを持つ。ui/（汎用プリミティブ）ではなく shared/（アプリ固有共有）が適切。
**代替案**: `$lib/components/ui/explorer-item/` — 汎用プリミティブではないため不適切。`layout/` 直下 — ExplorerPane 以外では使用しないが、他のレイアウトコンポーネントからも利用される可能性があるため shared/ が適当。

### D2: ExplorerItem の props 設計

**選択**: ExplorerItem は汎用的なアイテムラッパーとして設計し、context menu items・クリックハンドラ・選択状態を props で受け取る。アイテムの内容（テキスト・バッジ等）は children snippet で渡す。

```typescript
interface ExplorerItemProps {
  path: string;           // タブパス識別子
  section: ExplorerSection; // レイアウトストアのセクション
  menuItems: MenuItem[];  // コンテキストメニュー項目
  onclick?: (event: MouseEvent) => void; // カスタムクリック（通常は内部生成）
  class?: string;         // 追加クラス
  children: Snippet;      // アイテム内容
}
```

**理由**: children snippet により、各アイテムタイプの異なるセカンドライン情報（progress bar / Design badge 等）を柔軟に扱える。汎用コンポーネントとして再利用可能な粒度。

### D3: ExplorerSection の emptyMessage 設計

**選択**: `emptyMessage` (string) と `emptyIcon` (Component) props を追加。items 配列は受け取らず、children snippet と emptyMessage の共存で判定する。

```typescript
// ExplorerSection に追加
emptyMessage?: string;   // 空状態メッセージ
emptyIcon?: IconComponent; // 空状態アイコン
```

**動作**: `emptyMessage` が指定されており、かつ children が未提供（または `{#each}` が空）の場合、ExplorerSection 内部で EmptyState をレンダリング。children が提供されていれば children を優先。

**理由**: ExplorerPane 側の `{#if empty} ... {:else} {#each}` パターンを ExplorerSection 内部に隠蔽できる。items 配列を渡す設計は ExplorerSection を stateful にしすぎるため避ける。

### D4: ExplorerPane の簡素化後の構造

**選択**: ExplorerPane は各セクションのデータ取得と ExplorerSection + ExplorerItem の組み立てのみを行う。`handleItemClick`, `itemClass` 等のヘルパーは ExplorerItem に移動。

```
ExplorerPane (簡素化後)
  ├── プロジェクトヘッダー
  └── ScrollArea
        └── ExplorerSection × 3
              └── {#each items}
                    └── ExplorerItem
                          └── children (item content snippet)
```

## Risks / Trade-offs

- **[ExplorerItem の過度な抽象化]** → children snippet でコンテンツを渡す設計により、各アイテムの差異を吸収。ただし3箇所の重複を削除する目的に留め、それ以上の汎用化は避ける。
- **[ExplorerSection の責務増加]** → emptyMessage はオプショナル prop であり、既存の children-only 使用パターンには影響しない。
- **[divide-y の DOM 構造問題]** → 現在 `<div class="divide-y">` が ItemContextMenu（ContextMenu.Root）の DOM ラッパーに吸われる。ExplorerItem がこの div 直下に並ぶ構造になるため、ExplorerItem のルート要素が直接 divide-y の子になるよう設計する必要がある。
