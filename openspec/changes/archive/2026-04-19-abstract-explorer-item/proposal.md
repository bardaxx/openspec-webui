## Why

ExplorerPane の3セクション（ACTIVE CHANGES / ARCHIVE / SPECS）で、リストアイテムの描画パターン（EmptyState + ItemContextMenu + button）が重複している。この重複により、UI変更時に3箇所の同期が必要となり、メンテナンス性が低下している。ExplorerItem コンポーネントでこのパターンをカプセル化し、ExplorerSection に空状態の表示を内包させることで、ExplorerPane を宣言的なセクション定義のみに簡素化する。

## What Changes

- **ExplorerItem コンポーネント新規追加**: ItemContextMenu + button ラッパーをカプセル化し、クリック・右クリック・選択状態の表示を一元化。配置先は `$lib/components/shared/explorer-item/`
- **ExplorerSection に `emptyMessage` prop 追加**: 空セクション時の EmptyState 表示を ExplorerSection 内部に移動し、呼び出し側の `{#if}` 分岐を削除
- **ExplorerPane の重複コード削除**: 3セクションのリストアイテム描画を ExplorerItem に委譲し、ヘルパー関数のインライン化を整理

## Capabilities

### New Capabilities
- `explorer-item`: ExplorerItem コンポーネント。ItemContextMenu + button ラッパーのカプセル化、クリック/プレビュー/確認ハンドリング、選択状態スタイリングを提供

### Modified Capabilities
- `explorer-pane`: ExplorerSection への `emptyMessage` prop 移行、ExplorerItem へのリストアイテム描画委譲による重複解消
- `shared-ui-parts`: ExplorerSection の `emptyMessage` prop 追加による要件変更

## Impact

- **追加ファイル**: `frontend/src/lib/components/shared/explorer-item/ExplorerItem.svelte`
- **変更ファイル**: `ExplorerSection.svelte`（`emptyMessage` prop 追加）、`ExplorerPane.svelte`（大幅簡素化）
- **API**: ExplorerSection に新規 prop、ExplorerItem は新規公開コンポーネント
- **依存**: ItemContextMenu、EmptyState（既存コンポーネントを内部利用）
