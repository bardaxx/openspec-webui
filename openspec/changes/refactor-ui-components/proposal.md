## Why

SVGアイコンが19箇所でベタ書きされており、HTMLが冗長でメンテナンスしにくい。設定画面も `CommandSettingsModal` 単一構成で、将来的な設定項目追加にスケールしない。テーマシステム（Change 2）完了後のクリーンな状態で、UIコンポーネントをリファクタリングしてコード品質とメンテナビリティを向上させる。

## What Changes

- SVGアイコンを `Icon.svelte` コンポーネントに抽出（約8種類、19箇所を置換）
- 設定画面を左ペイン（大分類）+ 右詳細の2カラムレイアウトに再設計
- `CommandSettingsModal` を新しい `SettingsModal` に統合（General / Commands の2セクション構成）
- 設定アイコンのSVGを `Icon` コンポーネントに置換

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `command-preferences`: 設定画面のレイアウトを左ペイン+右詳細の2カラム構成に変更、General（テーマ含む）と Commands のタブ切り替えを追加
- `project-context`: ナビゲーションやモーダルのアイコン表示を Icon コンポーネント経由に変更

## Impact

- 新規コンポーネント: `Icon.svelte`, `SettingsModal.svelte`
- 修正コンポーネント: SVGベタ書きがある全コンポーネント（約10ファイル）
- 削除コンポーネント: `CommandSettingsModal.svelte`（`SettingsModal` に統合）
- `Navigation.svelte` の設定アイコン参照先変更
