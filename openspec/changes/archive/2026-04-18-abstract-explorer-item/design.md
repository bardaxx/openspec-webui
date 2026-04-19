## Context

ExplorerPane の3セクション（Active Changes, Archive, Specs）では、item の共通構造だけでなく、`title` / `icon` / `section` / `kind` / 日付整形 / `headerExtra` のような「セクション固有だが固定の配線」も繰り返されていた。`divide-y divide-border/70` が `ContextMenu.Root` の DOM ラッパーに吸われ、ボーダーがリストアイテムに届かない問題もあり、item 単位の DOM を局所化する必要があった。

最終的に採用した構造：
```
ExplorerPane
  ├─ ActiveChangesExplorerSection
  │   └─ ExplorerSection
  │      └─ ExplorerSectionItem * N
  ├─ ArchiveExplorerSection
  │   └─ ExplorerSection
  │      └─ ExplorerSectionItem * N
  └─ SpecsExplorerSection
      └─ ExplorerSection
         └─ ExplorerSectionItem * N
```

`ExplorerSection` は折りたたみ UI と EmptyState を担当し、`ExplorerSectionItem` は `ItemContextMenu + button`、アクティブ状態、タブオープン、メタデータ行、末尾スニペットを担当する。各 wrapper は固定されたセクション配線のみを持ち、`ExplorerPane` は composition に専念する。

## Goals / Non-Goals

**Goals:**
- `ExplorerSection` に EmptyState 処理を内包させ、`{#if empty}` 分岐を排除する
- `ExplorerSectionItem` に item 共通挙動をカプセル化する
- `ActiveChangesExplorerSection` / `ArchiveExplorerSection` / `SpecsExplorerSection` の固定 wrapper で section 配線を `ExplorerPane` から外す
- border-b を button に直接適用し、divide-y の DOM 構造依存問題を解決する
- `ExplorerPane` を wrapper を並べる薄い composition 層にする

**Non-Goals:**
- リスト全体の抽象化（ExplorerList 等）は行わない
- `ExplorerSectionItem` の public API 化や、ExplorerPane 以外での利用は前提にしない
- メタデータ表示（Progress、Badge 等）の完全共通化は行わない

## Decisions

### 1. section 固定 wrapper を導入する

**選択:** `ActiveChangesExplorerSection` / `ArchiveExplorerSection` / `SpecsExplorerSection` を `shared/explorer-section/` 配下に追加し、`ExplorerPane` はそれらを組み合わせるだけにする。

**理由:** 組み合わせが固定なので、汎用 item だけでは `title` / `icon` / `section` / `kind` / 日付整形 / `headerExtra` が親に残る。wrapper 化した方が `ExplorerPane` から重複した prop 配線を除去できる。

**代替案:** `ExplorerPane` が `ExplorerSection` + 汎用 item を直接組み立て続ける → item マークアップは減っても section 配線の重複が残る。

### 2. `ExplorerSectionItem` を shared module の内部 helper にする

**選択:** `explorer-section-item.svelte` は `shared/explorer-section/` 内に置き、wrapper から内部利用する。`index.ts` では export しない。

**理由:** `kind` と `name` から context menu 項目を内部導出し、`tabStore` / `layoutStore` / `uiPreferencesStore` 依存も内部に閉じ込められる。呼び出し側は `path`・`section`・表示用メタデータだけを渡せばよい。

**代替案:** `contextMenuItems` や click handler を props 注入する public component にする → 利用側の重複が残る。

### 3. border-b を各 `ExplorerSectionItem` の button に直接適用

**選択:** button に `border-b border-border/50` を付与。最後のアイテムに余分な border が残るが、ExplorerSection の `overflow-hidden` で見た目上は問題ない。

**理由:** `divide-y` は直接の子要素に依存するため、ContextMenu.Root の DOM ラッパーがあると正しく動作しない。ボタンへの直接適用が最も確実。

**代替案:** CSS セレクタ `> * > button` で border-top を適用 → Tailwind 的にイケてない。ContextMenu の DOM 構造に依存するため脆い。

### 4. EmptyState を `ExplorerSection` に内包する

**選択:** `ExplorerSection` に `emptyMessage?: string` と `emptyIcon?: IconComponent` を持たせ、`count === 0` の場合に EmptyState を自動レンダリングする。`section` prop が与えられた場合は layoutStore から open / focused を導出し、children は `count > 0` の場合のみレンダリングする。

**理由:** `ExplorerSection` は見出し・件数・折りたたみの責務をすでに持っているため、空状態も一箇所に寄せた方が自然。wrapper 側も item リストだけに集中できる。

### 5. ファイル配置と公開面を `shared/explorer-section` に集約する

**選択:** `ExplorerSection` / `ExplorerSectionItem` / section wrapper 群をすべて `$lib/components/shared/explorer-section/` に置き、`index.ts` からは `ExplorerSection` と wrapper 群だけを export する。

**理由:** 今回の抽象化は ExplorerPane 専用のまとまりとして成立しており、shared module に閉じた方が責務が明確。public surface も最小限に保てる。

## Risks / Trade-offs

- **wrapper 追加によるファイル数増加** → ファイルは増えるが、`ExplorerPane` の責務と prop 配線は大きく減る。
- **最後のアイテムの border** → `ExplorerSection` の `overflow-hidden` が前提。将来 overflow が変わる場合は見直しが必要。
- **`ExplorerSectionItem` の store 依存** → ExplorerPane 専用の内部 helper という前提。別コンテキストへ広げる場合は props ベースへの再設計が必要。
- **`ExplorerSection` の children レンダリング条件変更** → `emptyMessage` は optional なので、未指定時は従来通り children をそのままレンダリングできる。
