## 1. CSS 変数と @theme の定義

- [ ] 1.1 `app.css` の `@theme` ブロックにセマンティックカラートークンを定義（`--color-bg`, `--color-surface`, `--color-on-bg`, `--color-on-surface`, `--color-border`, `--color-brand` 等）
- [ ] 1.2 `:root` にライトテーマの色値を定義
- [ ] 1.3 `[data-theme="dark"]` にダークテーマの色値を定義
- [ ] 1.4 `@media (prefers-color-scheme: dark)` フォールバックを定義（System モード用）

## 2. themeStore の実装

- [ ] 2.1 `stores/theme.ts` を作成（Svelte writable store、theme: 'light' | 'dark' | 'system'）
- [ ] 2.2 localStorage の `openspec-theme` キーへの読み書きロジックを実装
- [ ] 2.3 `<html>` 要素の `data-theme` 属性を更新するロジックを実装
- [ ] 2.4 `prefers-color-scheme` の change イベントリスナーを実装（System モード時）
- [ ] 2.5 `App.svelte` の `onMount` で themeStore を初期化

## 3. app.css の色置換

- [ ] 3.1 `.markdown-body` 内の全ハードコード色をセマンティック色に置換（h1, h2, h3, h4, p, ul, ol, code, pre, blockquote, table, hr, strong, em 等）
- [ ] 3.2 `.diff-added`, `.diff-modified`, `.diff-removed` の色をセマンティック色に置換
- [ ] 3.3 `.suggestion-mode` の色をセマンティック色に置換

## 4. コンポーネントの色置換

- [ ] 4.1 `App.svelte` のハードコード色をセマンティック色に置換
- [ ] 4.2 `Navigation.svelte` のハードコード色をセマンティック色に置換
- [ ] 4.3 `Modal.svelte` のハードコード色をセマンティック色に置換
- [ ] 4.4 `Dashboard.svelte` のハードコード色をセマンティック色に置換
- [ ] 4.5 `CommandSettingsModal.svelte` のハードコード色をセマンティック色に置換
- [ ] 4.6 `SpecsList.svelte`, `SpecViewer.svelte` のハードコード色を置換
- [ ] 4.7 `ChangesList.svelte`, `ChangeViewer.svelte` のハードコード色を置換
- [ ] 4.8 `ActiveChangesList.svelte` のハードコード色を置換
- [ ] 4.9 `SuggestionPanel.svelte`, `SuggestionPopover.svelte` のハードコード色を置換
- [ ] 4.10 `TaskList.svelte`, `TaskProgress.svelte` のハードコード色を置換
- [ ] 4.11 `CommandShortcutBar.svelte` のハードコード色を置換
- [ ] 4.12 `Toast.svelte`, `MarkdownRenderer.svelte`, `HtmlRenderer.svelte` のハードコード色を置換

## 5. 設定画面へのテーマ選択追加

- [ ] 5.1 `CommandSettingsModal.svelte` に Appearance セクションを追加（Light / Dark / System の3択ラジオボタン）
- [ ] 5.2 themeStore とラジオボタンの双方向バインディングを実装

## 6. 検証

- [ ] 6.1 フロントエンドビルドが成功することを確認
- [ ] 6.2 ライトテーマで全ページが正しく表示されることを目視確認
- [ ] 6.3 ダークテーマで全ページが移行前と同じ見た目であることを確認
- [ ] 6.4 System モードで OS 設定変更に追従することを確認
- [ ] 6.5 localStorage にテーマ設定が永続化されることを確認
- [ ] 6.6 型チェックが通ることを確認
