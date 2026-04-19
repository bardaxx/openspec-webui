## 1. shared explorer-section モジュール整理

- [x] 1.1 `frontend/src/lib/components/shared/explorer-section/explorer-section.svelte` に `emptyMessage` / `emptyIcon` を追加し、EmptyState を内包する
- [x] 1.2 `ExplorerSection` が `section` prop を受けたときに layoutStore ベースの open / focused / toggle を扱える構成を shared module に残す
- [x] 1.3 `frontend/src/lib/components/shared/explorer-section/explorer-section-item.svelte` を作成する
- [x] 1.4 `explorer-section-item.svelte` に `ItemContextMenu + button` 構造、`border-b border-border/50`、active 状態スタイル、preview/confirmed のクリックハンドリングを実装する
- [x] 1.5 `explorer-section-item.svelte` に日付・spec delta・task progress 表示、末尾 snippet、`kind` / `name` からの context menu 項目導出を実装する

## 2. section 固定 wrapper の追加

- [x] 2.1 `active-changes-explorer-section.svelte` を追加し、Active Changes 用の `title` / `icon` / `section` / `kind` / `headerExtra` / progress 表示を閉じ込める
- [x] 2.2 `archive-explorer-section.svelte` を追加し、Archive 用の `displayName` 整形と item 配線を閉じ込める
- [x] 2.3 `specs-explorer-section.svelte` を追加し、Specs 用の date 表示と Design badge 表示を閉じ込める
- [x] 2.4 `frontend/src/lib/components/shared/explorer-section/index.ts` から `ExplorerSection` と wrapper 群を export し、`ExplorerSectionItem` は内部 helper のままにする

## 3. ExplorerPane のリファクタリング

- [x] 3.1 3セクションから `{#if ...length === 0} <EmptyState>` 分岐を削除し、`ExplorerSection` の `emptyMessage` に移行する
- [x] 3.2 `ExplorerPane.svelte` の 3セクションを `ActiveChangesExplorerSection` / `ArchiveExplorerSection` / `SpecsExplorerSection` の利用へ置き換える
- [x] 3.3 `ExplorerPane.svelte` から直接の `ItemContextMenu` / `<button>` / `{#each}` item レンダリングを削除する
- [x] 3.4 `ExplorerPane.svelte` から不要になった import と表示整形ロジックを削除し、wrapper を組み合わせる薄い composition 層にする

## 4. 検証

- [x] 4.1 3セクションともリストアイテム間に border が表示されることを確認する
- [x] 4.2 空セクションで EmptyState が表示されることを確認する
- [x] 4.3 アクティブアイテムのハイライトが動作することを確認する
- [x] 4.4 クリックでタブが開くこと（preview/confirmed 振り分け含む）を確認する
- [x] 4.5 コンテキストメニューが各アイテムで動作することを確認する
- [x] 4.6 `ExplorerPane.svelte` が wrapper を組み合わせるだけの構成になっていることを確認する
- [x] 4.7 `npm run typecheck` と `npm test` が通ることを確認する
