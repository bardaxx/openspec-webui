## 1. スクリプトファイルの削除・移動

- [x] 1.1 `scripts/debug.mjs` を削除
- [x] 1.2 `scripts/run-dev-server.mjs` を削除
- [x] 1.3 `scripts/run-dev-frontend.mjs` を削除
- [x] 1.4 `scripts/start.mjs` を削除
- [x] 1.5 `scripts/release.mjs` を削除
- [x] 1.6 `scripts/doctor-dev.mjs` を削除
- [x] 1.7 `scripts/browser-verify/` ディレクトリを削除
- [x] 1.8 `scripts/e2e/` ディレクトリを作成
- [x] 1.9 `scripts/verify-ui.mjs` を `scripts/e2e/verify-ui.mjs` に移動
- [x] 1.10 `scripts/test-tabbar-ui.mjs` を `scripts/e2e/test-tabbar-ui.mjs` に移動

## 2. package.json scripts の更新

- [x] 2.1 以下の npm scripts を削除: `debug`, `dev:server`, `dev:frontend`, `doctor`, `doctor:dev`, `setup`, `setup:dev`, `release`, `start`, `test:ui:tabbar`
- [x] 2.2 補助 alias の npm scripts を削除し、`build`, `test`, `typecheck` に直接コマンドを集約
- [x] 2.3 user-facing command surface を `dev`, `build`, `test`, `typecheck` に限定し、`prepublishOnly` だけを lifecycle hook として残す

## 3. 起動ルールの単純化

- [x] 3.1 `OPENSPEC_INITIAL_PROJECT` に依存した CLI / server / wrapper の起動処理を削除
- [x] 3.2 起動時は CWD が valid な OpenSpec project のときだけ自動 bootstrap する
- [x] 3.3 non-project directory から起動したときは project を自動追加せず、server を通常起動する
- [x] 3.4 `npm run dev` のログ / 振る舞いを新ルールに合わせて整理する

## 4. README / 説明の整理

- [x] 4.1 ユーザー向けセクション（インストール、利用方法、CLI オプション）を上部に作成
- [x] 4.2 開発者向けセクション（npm run dev / build / test / typecheck）を下部に作成
- [x] 4.3 不要になったスクリプトの説明と古い起動ルールの痕跡を削除

## 5. 動作確認

- [x] 5.1 CWD bootstrap / non-project startup / occupied port の自動テストを追加・更新
- [x] 5.2 `npm run dev` が正常に起動することを確認
- [x] 5.3 `npm run build` が正常に完了することを確認
- [x] 5.4 `npm run test` が正常に完了することを確認
- [x] 5.5 `npm run typecheck` が正常に完了することを確認
