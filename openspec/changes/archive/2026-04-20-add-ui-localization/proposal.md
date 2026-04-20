## Why

現在の WebUI は Settings、Activity Bar、Dashboard、Explorer、各種 Viewer、toast などの UI 文言が英語でハードコードされており、利用言語を切り替えられない。Paraglide JS を使って型安全な多言語基盤を導入し、Settings から言語を切り替えられるようにして、英語 UI を前提にした運用を解消する。

## What Changes

- Vite フロントエンドに Paraglide JS を導入し、`en` を base locale、`ja` を追加 locale とする UI 多言語基盤を追加
- Settings の General セクションに Language 設定を追加し、`English` / `日本語` を切り替えられるようにする
- Activity Bar、Explorer、Dashboard、Project Selector、Search、Viewer、context menu、toast、empty state などのアプリケーション chrome を翻訳メッセージへ移行する
- 現在の locale に合わせて `<html lang>` / `dir` と日付表示を同期し、選択した言語をブラウザ設定として永続化する
- OpenSpec の `spec.md` / `proposal.md` / `design.md` などユーザー管理コンテンツ本体は翻訳せず、その周辺 UI だけを多言語化する

## Capabilities

### New Capabilities

- `ui-localization`: アプリケーション UI の locale 選択、永続化、fallback、document 言語属性、共有 UI 文言の多言語化を扱う

### Modified Capabilities

- `command-preferences`: Settings の General セクションに言語選択を追加する
- `shared-ui-parts`: loading / retry / copy feedback などの共有 UI 文言を locale 対応にする

## Impact

- `frontend/vite.config.ts` とフロントエンド build に Paraglide JS の生成ステップを追加
- `frontend/` 配下に locale 設定、メッセージカタログ、生成済み runtime/messages、locale store/helper を追加
- `frontend/index.html`、`frontend/src/App.svelte`、`frontend/src/lib/utils.ts`、`frontend/src/lib/components/**` の文言管理を横断的に更新
- ブラウザ永続化キーと Settings UI に locale 設定が追加される
