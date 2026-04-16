## 1. 共通ユーティリティの抽出

- [x] 1.1 ExplorerPane.svelte の `copyToClipboard` 関数を `$lib/utils.ts`（または新規 `$lib/actions.ts`）に移動し、既存の utils パターンに合わせてエクスポートする
- [x] 1.2 ExplorerPane.svelte の `copyToClipboard` インポートを新しい共通位置に切り替える

## 2. ItemContextMenu と共通メニュー生成の作成

- [x] 2.1 `$lib/components/ui/item-context-menu/` ディレクトリを作成する
- [x] 2.2 `MenuItem` 型（`{ label: string; icon?: Component; onSelect: () => void }`）を定義する
- [x] 2.3 `ItemContextMenu.svelte` を実装する — `items` prop と children snippet を受け取り、`ContextMenu.Root` + `ContextMenu.Content` で薄い UI ラッパーとしてメニューアイテムを描画する
- [x] 2.4 `$lib/itemContextMenu.ts` に `createItemContextMenuItems` を追加し、`active-change | archived-change | spec` の kind と必要な callback から共通メニューを組み立てる
- [x] 2.5 `index.ts` でコンポーネントと型をエクスポートする

## 3. ExplorerPane のリファクタリング

- [x] 3.1 ExplorerPane.svelte で `ItemContextMenu` と共通メニュー生成ヘルパーをインポートする
- [x] 3.2 Active Changes セクションのインライン `ContextMenu.Root` を `ItemContextMenu` に置き換える
- [x] 3.3 Archive セクションのインライン `ContextMenu.Root` を `ItemContextMenu` に置き換える
- [x] 3.4 Specs セクションのインライン `ContextMenu.Root` を `ItemContextMenu` に置き換え、`Search Related Changes` を共通メニュー生成ヘルパー経由で含める

## 4. Dashboard へのコンテキストメニュー追加

- [x] 4.1 Dashboard.svelte で `ItemContextMenu` と共通メニュー生成ヘルパーをインポートする
- [x] 4.2 Active Changes カードにコンテキストメニューを追加する（Open in New Tab、Copy Name）
- [x] 4.3 Recent Activity カードにコンテキストメニューを追加し、Spec では `Search Related Changes` も同じ共通ヘルパー経由で提供する

## 5. 検証

- [x] 5.1 ExplorerPane の各セクションで右クリックメニューが正常に動作することを確認する
- [x] 5.2 Dashboard の Active Changes カードで右クリックメニューが正常に動作することを確認する
- [x] 5.3 Dashboard の Recent Activity カードで右クリックメニューが正常に動作することを確認する
- [x] 5.4 `copyToClipboard` の移動後もコピー機能が正常に動作することを確認する
