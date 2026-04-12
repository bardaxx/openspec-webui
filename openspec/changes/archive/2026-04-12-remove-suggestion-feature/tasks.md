## 1. artifact / project context 修正

- [x] 1.1 `openspec/changes/remove-suggestion-feature/specs/command-shortcuts/spec.md` を追加し、ChangeViewer command shortcut requirement から Suggest / Exit 前提を除去
- [x] 1.2 `proposal.md` / `design.md` を更新し、`SquarePen` の残存用途と stale artifact cleanup 方針を反映
- [x] 1.3 `openspec/project.md` から review handoff workflow への言及を削除
- [x] 1.4 `proposal.md` / `design.md` / `tasks.md` を更新し、HTML artifact support 削除と `@tailwindcss/typography` 導入を change scope に反映
- [x] 1.5 `README.md` と `openspec/project.md` を markdown-only / typography 反映後の現状に合わせて更新

## 2. ファイル削除

- [x] 2.1 `frontend/src/components/SuggestionPanel.svelte` を削除
- [x] 2.2 `frontend/src/components/SuggestionPopover.svelte` を削除
- [x] 2.3 `frontend/src/stores/suggestions.svelte.ts` を削除
- [x] 2.4 `frontend/src/lib/promptGenerator.ts` を削除
- [x] 2.5 `frontend/src/components/HtmlRenderer.svelte` を削除

## 3. MarkdownRenderer クリーンアップ

- [x] 3.1 `MarkdownRenderer.svelte` から `suggestionStore`, `blockSuggestionMap`, `tick` import を削除
- [x] 3.2 `suggestionModeEnabled` prop とそれに依存する state / derived / 関数（`containerElement`, `suggestionMap`, `selectedBlockId`, `handleBlockClick`, `updateBlockClasses`, `$effect`）を削除
- [x] 3.3 `renderMarkdownWithBlocks` の呼び出しを `renderMarkdown` に統一（条件分岐を削除）
- [x] 3.4 `suggestion-mode` class のバインドと `role`/`aria-label` 属性を削除
- [x] 3.5 `@tailwindcss/typography` を導入し、`MarkdownRenderer.svelte` の wrapper を `prose` ベースに更新
- [x] 3.6 `app.css` の markdown typography を plugin ベース + 最小 override に整理

## 4. markdown.ts クリーンアップ

- [x] 4.1 `renderMarkdownWithBlocks` 関数と `SELECTABLE_BLOCK_TAGS` 定数を削除

## 5. ChangeViewer クリーンアップ

- [x] 5.1 `SuggestionPopover` / `suggestionStore` / `toast` import を削除
- [x] 5.2 `suggestionModeActive`, `toggleSuggestionMode`, `reconcileSuggestionsWithContent` と `loadChange` 内の suggestion 関連呼び出しを削除
- [x] 5.3 `onChangeLoaded` prop / callback wiring を削除
- [x] 5.4 Suggest ボタンと `<SuggestionPopover />` のマークアップを削除
- [x] 5.5 MarkdownRenderer の `suggestionModeEnabled` prop を削除し、active change header icon 用の `SquarePen` は維持
- [x] 5.6 HTML preview 分岐、`HtmlRenderer` import、HTML badge を削除して markdown-only 表示にする

## 6. MainViewer クリーンアップ

- [x] 6.1 `SuggestionPanel`, `suggestionStore`, `Sheet`, `layoutStore`, `Change` import を削除
- [x] 6.2 `showSuggestions`, `loadedChange` state, change reset `$effect` を削除
- [x] 6.3 wide / narrow の suggestion panel markup を削除し、MainViewer が content area のみを描画する形に戻す
- [x] 6.4 `ChangeViewer` の `onChangeLoaded` callback usage を削除

## 7. スタイル削除

- [x] 7.1 `app.css` の `.suggestion-mode` セクション（suggestion-block styles）を削除
- [x] 7.2 `app.css` の suggestion panel 用CSS変数（`--suggestion-panel-width`, `--suggestion-panel-gap`）を削除

## 8. HTML artifact support 削除

- [x] 8.1 `src/parser/changes.ts` から `.html` discovery / type 分岐を削除し、change files を markdown-only にする
- [x] 8.2 `src/shared/types.ts` / `frontend/src/lib/api.ts` から `html` / `hasHtmlFiles` / raw HTML route 前提を削除する
- [x] 8.3 `src/server/routes/api.ts` から raw change file route と `hasHtmlFiles` summary を削除する
- [x] 8.4 `src/watcher/file-watcher.ts` の watch 対象を `.md` のみにする
- [x] 8.5 HTML fixture / mockup を削除または markdown-only 前提に更新する

## 9. spec delta / verification 更新

- [x] 9.1 `scripts/verify-ui.mjs` から suggestion 用 state 取得・sidebar scenario・関連 assertion を削除
- [x] 9.2 `specs/live-refresh/spec.md` に markdown-only watcher への変更を追加
- [x] 9.3 `specs/spec-browsing/spec.md` に html file 非対応の `lastModified` 前提を追加
- [x] 9.4 `specs/cli-runtime/spec.md` に `@tailwindcss/typography` 利用を追加

## 10. ビルド検証

- [x] 10.1 `npm run build` でエラーがないことを確認
- [x] 10.2 `npm run typecheck:frontend` でエラーがないことを確認
- [x] 10.3 runtime code / specs / README に suggestion・HTML preview 関連参照が残っていないことを確認
