## 1. Paraglide 基盤の追加

- [x] 1.1 `@inlang/paraglide-js` を追加し、`frontend/vite.config.ts` に plugin 設定、`frontend/project.inlang`、`frontend/messages/en.json`、`frontend/messages/ja.json`、生成先 `frontend/src/lib/paraglide/` を追加する（固定英語ラベルは後で code constants に寄せられる構成にする）
- [x] 1.2 `openspec-locale` を扱う custom locale strategy と locale helper/store を実装し、supported locales / fallback / current locale 取得 API を定義する
- [x] 1.3 `frontend/index.html` の bootstrap で保存済み locale または browser language から `<html lang>` / `dir` を初期化する

## 2. Settings と locale 切替フロー

- [x] 2.1 `frontend/src/lib/components/layout/SettingsModal.svelte` の General セクションに Language 設定を追加し、Theme の次に `English` / `日本語` を選べる listbox-style control を配置する
- [x] 2.2 `frontend/src/App.svelte` で locale store を初期化し、言語変更時に reload なしで UI が更新されるようにする
- [x] 2.3 locale の永続化と復元を theme / command preferences と同じ運用感で扱い、Settings 再表示時に現在値が反映されることを確認する

## 3. UI 文言の message 化

- [x] 3.1 Activity Bar、AppLayout、Search、Project Selector、Empty Project State、Settings など layout/chrome 文言を locale 対応する（title / command 用語は英語固定、補足説明を locale 化する）
- [x] 3.2 Dashboard、Explorer sections、shared loading/error/empty feedback、command shortcut 周辺、toast helper を locale 対応する（OpenSpec 用語との対応が必要な短い label は code constants で英語固定に保つが、error / toast は翻訳対象にする）
- [x] 3.3 SpecViewer、ChangeViewer、TabBar、context menu、copy action、dialog header など viewer/navigation 文言を locale 対応する（Specification / Design / Spec Deltas などは code constants で英語固定にしつつ、context menu と copy feedback は翻訳対象にする）
- [x] 3.4 OpenSpec markdown 本文や change/spec 名は翻訳対象に含めず、周辺 UI のみ locale 切替されることを確認する

## 4. locale-aware formatter と検証

- [x] 4.1 `frontend/src/lib/utils.ts` などの共有 formatter を active locale 対応に更新し、日付表示が locale に応じて変わるようにする
- [x] 4.2 locale store、fallback、永続化、shared copy feedback、date formatting のユニットテストを追加または更新する
- [x] 4.3 `npm test`、`npm run typecheck`、`npm run build` を実行し、Settings からの en↔ja 切替、`<html lang>` 更新、主要画面の表示崩れがないことを手動確認する
