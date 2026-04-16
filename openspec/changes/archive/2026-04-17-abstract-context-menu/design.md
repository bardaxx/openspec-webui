## Context

ExplorerPane.svelte に3箇所（Active Changes / Archive / Specs）のインラインコンテキストメニュー実装が存在する。各メニューは `ContextMenu.Root` → `button` → `ContextMenu.Content` の同じ構造で、メニューアイテムも "Open in New Tab" と "Copy Name" が共通している。Specs だけは "Search Related Changes" が追加で必要になる。Dashboard.svelte に同じメニューを追加すると、UI コンポーネントだけでなくメニュー項目の組み立てロジックも ExplorerPane / Dashboard の両方で重複しやすい。

現在の context-menu UI プリミティブ（`$lib/components/ui/context-menu/`）は shadcn の標準ラッパーで、Root / Content / Item / Separator を提供している。今回の抽象化はこのプリミティブの上に乗る。

## Goals / Non-Goals

**Goals:**
- `ItemContextMenu` をトリガー描画だけに責務を絞った薄い UI コンポーネントにする
- Active Changes / Archive / Specs のメニュー組み立てロジックを 1 箇所に集約する
- ExplorerPane の3箇所のインラインコンテキストメニューを `ItemContextMenu` + 共通ヘルパーに置き換える
- Dashboard の Active Changes カードと Recent Activity カードに同じ共通ヘルパー経由でコンテキストメニューを追加する
- `copyToClipboard` を共有ユーティリティとして抽出する

**Non-Goals:**
- context-menu プリミティブ自体の変更
- 新しいメニューアクションの追加（既存アクションの再利用のみ）
- `ItemContextMenu` 自体に active / archive / spec の domain 知識を持ち込むこと
- キーボードショートカットの変更

## Decisions

### 1. 薄い UI コンポーネント + 共通メニュー生成ヘルパー

**決定**: `ItemContextMenu` は Svelte 5 の children snippet でトリガー要素を受け取り、`items` prop を描画する薄い UI コンポーネントに留める。メニュー項目の組み立ては `$lib/itemContextMenu.ts` の `createItemContextMenuItems` に集約し、`active-change` / `archived-change` / `spec` の kind と必要な callback から `MenuItem[]` を返す。

```svelte
<ItemContextMenu
  items={createItemContextMenuItems({
    kind: 'spec',
    name: spec.name,
    onOpenInNewTab: () => openSpec(spec.name),
    onSearchRelatedChanges: () => searchForSpec(spec.name),
  })}
>
  <button>...</button>
</ItemContextMenu>
```

```ts
type ItemContextMenuConfig =
  | {
      kind: 'active-change' | 'archived-change';
      name: string;
      onOpenInNewTab: () => void;
    }
  | {
      kind: 'spec';
      name: string;
      onOpenInNewTab: () => void;
      onSearchRelatedChanges: () => void;
    };
```

**理由**: トリガー要素は ExplorerPane（小型リストアイテム）と Dashboard（カード）で全く異なる UI なので、children snippet で柔軟性を保つ。一方で menu 定義を呼び出し側で毎回組み立てると重複が残るため、kind ベースの shared helper に集約する。

**代替案:**
- `extraItems` snippet で specs だけを都度拡張する → call site ごとの ad-hoc 分岐が残るため不採用
- `kind` や store 依存を `ItemContextMenu` コンポーネントへ直接持たせる → UI レイヤーに domain ロジックが漏れるため不採用

### 2. copyToClipboard の共通ユーティリティ化

**決定**: ExplorerPane に定義されている `copyToClipboard` を `$lib/utils.ts` に移動する。

**理由**: Dashboard と共通メニュー生成ヘルパーでも同じ機能が必要で、今後のコンポーネントでも再利用される可能性が高い。

### 3. 配置方針

**決定**: UI コンポーネントは `$lib/components/ui/item-context-menu/` に配置し、メニュー組み立ての shared helper は `$lib/itemContextMenu.ts` に配置する。

**理由**: UI の責務と domain-aware な共有ロジックの責務を分離しつつ、既存の shared-ui-parts / lib helper の構成に沿える。

## Risks / Trade-offs

- **helper ファイルが 1 つ増える** → ただし ExplorerPane / Dashboard の重複した menu builder と spec 専用分岐を解消できるためコストに見合う
- **kind が増えすぎると helper が肥大化する** → 現状は `active-change` / `archived-change` / `spec` の 3 種のみで、過度な抽象化にはならない
- **children snippet の学習コスト** → Svelte 5 の標準パターンなので問題ない
