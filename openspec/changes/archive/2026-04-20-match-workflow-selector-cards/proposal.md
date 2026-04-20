## Why

Settings dialog では Theme の選択肢がカード型で視認しやすい一方、Workflow の選択肢は単純なラジオリストのままで、同じレベルの設定として見た目が揃っていない。Workflow 選択も同じ視覚パターンに揃えることで、設定画面全体の一貫性と選択の分かりやすさを高める。

## What Changes

- Settings dialog の Workflow 選択を Theme と同じカード型セレクタに変更する
- `standard`、`claude-code`、`skill` の各フォーマットに専用アイコンと選択状態のハイライトを追加する
- コマンド文字列のプレビュー、保存挙動、下部の callout はそのまま維持する

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `command-preferences`: Settings dialog の workflow format 選択が、theme 選択と整合するカード型 UI で表示される要件を追加する

## Impact

- `frontend/src/lib/components/shared/option-card/` — 新規共有コンポーネント
- `frontend/src/lib/components/layout/SettingsModal.svelte` — OptionCard を使うようにリファクタ
- `openspec/specs/command-preferences/spec.md`
