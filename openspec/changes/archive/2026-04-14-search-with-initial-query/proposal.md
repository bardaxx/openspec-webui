## Why

SearchDialog は常に空欄から開始するため、Spec がどの Change に由来するかを調べるには手動でキーワードを入力する必要があった。Explorer Pane や SpecViewer から直接、Spec 名をキーワードとして検索済み状態で SearchDialog を起動できれば、Spec と Change の関係性を素早く追跡できる。また Explorer Pane のリストアイテムにコンテキストメニューがなく、名前のコピーなどの基本操作もできなかった。

## What Changes

- `layoutStore` に `searchInitialQuery` 状態を追加し、`openOverlay()` を初期キーワード付きで呼び出せるように拡張する
- `SearchDialog` を初期キーワード対応にし、ダイアログ表示時に自動で検索を実行する
- `ExplorerPane` の Active Changes / Archive / Specs 各アイテムにコンテキストメニューを追加する
  - Changes: 「Copy Name」
  - Specs: 「Copy Name」「Search Related Changes」
- `SpecViewer` の Header タイトル横に Search アイコンボタンを追加し、クリックで Spec 名をキーワードに SearchDialog を起動する

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `search-dialog`: 初期キーワード付き起動と自動検索に対応する
- `explorer-pane`: リストアイテムにコンテキストメニュー（Copy Name / Search Related Changes）を追加する
- `spec-viewer`: Header タイトル横に Search アイコンボタンを追加する

## Impact

- **Layout Store**: `frontend/src/stores/layout.svelte.ts` に `searchInitialQuery` 状態と `openOverlay` 拡張
- **Search Dialog**: `frontend/src/components/layout/SearchDialog.svelte` の初期クエリ対応
- **Explorer Pane**: `frontend/src/components/layout/ExplorerPane.svelte` のコンテキストメニュー追加
- **Spec Viewer**: `frontend/src/components/SpecViewer.svelte` の Header ボタン追加
