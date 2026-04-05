## 1. 依存関係の更新

- [x] 1.1 `tailwindcss` を ^4 にアップグレード（`npm install -D tailwindcss@^4`）
- [x] 1.2 `@tailwindcss/vite` を追加（`npm install -D @tailwindcss/vite`）
- [x] 1.3 `postcss` と `autoprefixer` を devDependencies から削除（`npm uninstall postcss autoprefixer`）

## 2. 設定ファイルの移行

- [x] 2.1 `postcss.config.js` を削除
- [x] 2.2 `tailwind.config.js` を削除
- [x] 2.3 `vite.config.ts` に `@tailwindcss/vite` プラグインを追加

## 3. CSS の移行

- [x] 3.1 `app.css` の `@tailwind base; @tailwind components; @tailwind utilities;` を `@import "tailwindcss";` に置換
- [x] 3.2 `app.css` に空の `@theme {}` ブロックを追加（将来のテーマシステム用プレースホルダー）

## 4. 検証

- [x] 4.1 フロントエンドビルドが成功することを確認（`npm run build:frontend`）
- [x] 4.2 `app.css` 内の `@apply` ディレクティブが全て正常に解決されることを確認
- [x] 4.3 開発サーバーを起動し、全ページの見た目が移行前と同じであることを目視確認
- [x] 4.4 型チェックが通ることを確認（`npm run typecheck:frontend`）
