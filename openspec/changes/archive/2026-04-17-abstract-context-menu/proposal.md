## Why

ExplorerPane.svelte に3箇所（Active Changes / Archive / Specs）存在するコンテキストメニュー実装がコピペされており、Dashboard.svelte にも同じコンテキストメニューを追加すると、UI コンポーネントだけでなくメニュー項目の組み立てロジックも ExplorerPane / Dashboard の両方で重複しやすい。薄い `ItemContextMenu` コンポーネントと、種別（active-change / archived-change / spec）ごとにメニューを組み立てる共通ヘルパーに分離し、両画面で一貫したコンテキストメニューを再利用可能にする。

## What Changes

- 新しい `ItemContextMenu` Svelte コンポーネントを `$lib/components/ui/` に追加する
- 種別と必要な callback からメニューを組み立てる `createItemContextMenuItems` ヘルパーを `$lib/itemContextMenu.ts` に追加する
- ExplorerPane.svelte の3箇所のインラインコンテキストメニューを `ItemContextMenu` + 共通ヘルパーに置き換える
- Dashboard.svelte の Active Changes カードと Recent Activity カードに同じ共通ヘルパー経由でコンテキストメニューを追加する
- `copyToClipboard` などの共通アクションユーティリティを共有モジュールに抽出する

## Capabilities

### New Capabilities
- `item-context-menu`: リストアイテム用の再利用可能なコンテキストメニュー UI コンポーネント。トリガー要素を children snippet で受け取る薄いラッパー

### Modified Capabilities
- `explorer-pane`: コンテキストメニュー実装をインラインから `ItemContextMenu` + 共通メニュー生成ヘルパーへ移行
- `shared-ui-parts`: 新しいコンテキストメニューコンポーネント、共通メニュー生成ヘルパー、共通アクションユーティリティを追加

## Impact

- `frontend/src/lib/components/ui/item-context-menu/` — 新コンポーネント
- `frontend/src/lib/itemContextMenu.ts` — 種別ベースの共通メニュー生成ヘルパー
- `frontend/src/components/layout/ExplorerPane.svelte` — リファクタリング
- `frontend/src/components/Dashboard.svelte` — コンテキストメニュー追加
- `frontend/src/lib/utils.ts` — `copyToClipboard` の移動または新モジュール作成
