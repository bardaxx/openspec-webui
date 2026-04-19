## 1. ExplorerItem コンポーネント作成

- [x] 1.1 `frontend/src/lib/components/shared/explorer-item/` ディレクトリと `index.ts` エクスポートファイルを作成
- [x] 1.2 ExplorerItem.svelte の props 型定義を実装（path, menuItems, class, children snippet）
- [x] 1.3 ExplorerItem 内部で ItemContextMenu + button 構造を実装し、選択状態スタイリング（tabStore.activeTab.path との比較）を追加
- [x] 1.4 クリックハンドラ（preview vs confirmed 判定、uiPreferencesStore.previewTabsEnabled 参照）を実装
- [x] 1.5 layoutStore.focusSection 連携と onItemSelected コールバックを追加

## 2. ExplorerSection の emptyMessage 対応

- [x] 2.1 ExplorerSection の Props に `emptyMessage?: string` と `emptyIcon?: Component` を追加
- [x] 2.2 Collapsible.Content 内で emptyMessage が設定されている場合の EmptyState レンダリング分岐を実装
- [x] 2.3 EmptyState コンポーネントを import し、emptyMessage/emptyIcon を渡す

## 3. ExplorerPane のリファクタリング

- [x] 3.1 ExplorerPane から handleItemClick, itemClass, openItemPreview, openItemConfirmed 関数を削除
- [x] 3.2 各セクションの `{#if empty} EmptyState {:else} {#each}` パターンを ExplorerSection の emptyMessage/emptyIcon props に置換
- [x] 3.3 各セクションの ItemContextMenu + button 構造を ExplorerItem コンポーネントに置換
- [x] 3.4 各 ExplorerItem に適切な menuItems（createItemContextMenuItems 経由）と children snippet（セカンドライン情報含む）を渡す
- [x] 3.5 `<div class="divide-y divide-border/70">` ラッパーが ExplorerItem ルート要素を直接子として持つよう確認

## 4. 検証

- [x] 4.1 `npm run build` でビルドエラーがないことを確認
- [x] 4.2 各セクションの空状態・アイテム一覧・コンテキストメニュー・タブ遷移が従来通り動作することを確認
- [x] 4.3 アクティブアイテムのハイライト・プレビュータブ動作が維持されていることを確認
