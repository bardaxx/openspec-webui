## Why

Tailwind CSS v3 を v4 に移行し、CSS-first の構成にする。v4 の `@theme` ディレクティブと CSS 変数自動生成により、テーマシステム（ライト/ダーク切替）の基盤を整える。同時に PostCSS 依存をなくし、Vite プラグインでビルドパイプラインをシンプルにする。この変更は後続のテーマシステム導入（Change 2）の前提となる。

## What Changes

- **BREAKING**: `tailwindcss` を ^3 から ^4 にアップグレード
- **BREAKING**: `postcss` と `autoprefixer` を devDependencies から削除
- `postcss.config.js` を削除
- `tailwind.config.js` を削除（設定を `app.css` 内の `@theme` に移行）
- `app.css` の `@tailwind` ディレクティブを `@import "tailwindcss"` に変更
- `vite.config.ts` に `@tailwindcss/vite` プラグインを追加
- 既存の `@apply` 使用箇所が v4 でも動作することを確認・修正
- 見た目は変わらない（ダークテーマのまま）

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `cli-runtime`: ビルドパイプラインの変更（PostCSS → Vite plugin）、`postcss.config.js` / `tailwind.config.js` の削除、`vite.config.ts` への `@tailwindcss/vite` 追加

## Impact

- 依存関係: `tailwindcss` ^4 アップグレード、`@tailwindcss/vite` 追加、`postcss` / `autoprefixer` 削除
- 設定ファイル: `postcss.config.js` 削除、`tailwind.config.js` 削除、`app.css` 書き換え、`vite.config.ts` 更新
- `app.css` 内の178行の `@apply` スタイル定義の互換性確認
- 全 Svelte コンポーネントのクラス使用箇所の動作確認（変更なし前提）
