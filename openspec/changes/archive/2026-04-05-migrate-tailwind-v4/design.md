## Context

フロントエンドは Svelte 5 + Vite 6 + Tailwind CSS v3 構成。現在のビルドパイプライン:

```
Vite → PostCSS (postcss.config.js) → Tailwind v3 → 出力
```

設定ファイル:
- `tailwind.config.js`: content パスのみ定義（最小構成）
- `postcss.config.js`: tailwindcss + autoprefixer
- `app.css`: `@tailwind base/components/utilities` + `@apply` を多用したスタイル（178行）
- `vite.config.ts`: `frontend/` 配下、Svelte プラグインのみ

全18コンポーネントが Tailwind クラスを使用。`@apply` は `app.css` 内の `.markdown-body` や `.diff-*`、`.suggestion-mode` 等のスタイル定義に使用。

## Goals / Non-Goals

**Goals:**
- Tailwind CSS v4 への完全移行
- PostCSS / autoprefixer 依存の削除
- CSS-first 構成（`@theme` + `@import "tailwindcss"`）
- 既存の見た目を一切変えない
- 後続のテーマシステム（Change 2）で `@theme` を使える基盤を整える

**Non-Goals:**
- テーマのライト/ダーク切替機能は導入しない（Change 2）
- セマンティックカラー（CSS変数）の導入はしない（Change 2）
- コンポーネントのリファクタリングはしない（Change 3）
- `@apply` の廃止・置き換えはしない

## Decisions

### D1: Vite プラグイン方式を採用
PostCSS 経由ではなく `@tailwindcss/vite` を使用する。v4 の推奨方式で、PostCSS 設定ファイルが不要になる。

**代替案**: PostCSS 経由で v4 を使い続ける → 可能だが、v4 の推奨は Vite プラグインであり、設定ファイルを削除できるメリットが大きい。

### D2: 設定を `app.css` 内の `@theme` に集約
`tailwind.config.js` の内容（content パスのみ）を CSS 内に移行。v4 では content 検出が自動化されるため、明示的な設定は不要。

### D3: 既存 `@apply` の互換性は原則維持
v4 でも `@apply` はサポートされる。ただし、一部のユーティリティクラス名が v4 で変更されている可能性があるため、ビルドで検証する。

## Risks / Trade-offs

- [`@apply` 内のクラスが v4 で解決できない場合がある] → ビルドエラーとして検出可能。修正量は少ないと予想（Tailwind v4 は高い後方互換性を維持）。
- [v4 の content 自動検出が `.svelte` ファイルを正しくスキャンするか] → デフォルトで対応しているはずだが、ビルド後のCSS出力で検証が必要。
- [Svelte 5 + Vite 6 + Tailwind v4 の組み合わせの安定性] → 全てメジャーバージョンであり、活発にメンテされている。問題があればIssue参照。
