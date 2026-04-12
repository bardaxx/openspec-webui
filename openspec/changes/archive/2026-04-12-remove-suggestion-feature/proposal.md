## Why

Suggestion機能（SuggestionPanel + SuggestionPopover + suggestionStore）は、change文書のテキストブロックを選択してsuggestionを蓄積し、AI向けプロンプトを生成する機能だが、以下の理由から廃止する：

1. **小幅で実用性がない**: window幅が狭いとフローティングSheetで開くが、メインビューと同時に使えず機能が成立しない
2. **冗長**: suggestionを手動で蓄積→プロンプト生成→コピー、というワークフロー自体が現在のユースケースに合わなくなっている
3. **メンテナンスコスト**: 4つのコンポーネント + store + lib + CSS が絡み、他の改善の障壁になっている

一旦削除してコードベースを簡素化し、将来シンプルな代替が必要になった際に再設計する。あわせて、この change の仕上げとして、OpenSpec の現行前提に不要な HTML artifact preview support を削除し、Markdown 表示は `@tailwindcss/typography` ベースへ寄せる。

## What Changes

- **BREAKING**: Suggestion機能を完全に削除する
  - `SuggestionPanel.svelte` を削除
  - `SuggestionPopover.svelte` を削除
  - `stores/suggestions.svelte.ts` を削除
  - `lib/promptGenerator.ts` を削除
  - `lib/markdown.ts` の `renderMarkdownWithBlocks()` と `SELECTABLE_BLOCK_TAGS` を削除
  - `app.css` の `.suggestion-mode` スタイルと suggestion panel 用CSS変数を削除
- `ChangeViewer.svelte` からSuggestボタンとsuggestion関連ロジックを削除し、active change header の `SquarePen` アイコンは維持する
- `MainViewer.svelte` からSuggestionPanel配置（wide/narrow分岐）を削除
- `MarkdownRenderer.svelte` からsuggestionModeEnabled propとblock選択ロジックを削除し、Markdown styling は `@tailwindcss/typography` ベースへ移行する
- **BREAKING**: HTML artifact support を削除する
  - `frontend/src/components/HtmlRenderer.svelte` を削除
  - change file discovery / API / watcher から `.html` support を削除
  - ChangeViewer の HTML preview 分岐と HTML badge を削除
  - README / project context / relevant specs を markdown-only 前提に更新する
- `openspec/specs/suggestion-handoff/` specを廃止
- `command-shortcuts` capability から ChangeViewer の Suggest / Exit 前提の記述を削除
- `openspec/project.md` から review handoff workflow への言及を削除
- `scripts/verify-ui.mjs` のsuggestionMode検証を削除

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `suggestion-handoff`: 全要件を削除。capabilityごと廃止
- `tabbed-viewer`: MainViewerからSuggestionPanel配置ロジックを削除
- `command-shortcuts`: ChangeViewer header が Suggest / Exit action を前提にしない形へ更新
- `shared-ui-parts`: suggestion文脈に寄った `IconBox` の例を feature非依存な例に置き換える
- `live-refresh`: watcher 対象を markdown-only に更新
- `spec-browsing`: change `lastModified` 算出対象から html files を外す
- `cli-runtime`: frontend build pipeline に `@tailwindcss/typography` 利用を追記

## Impact

- **削除ファイル**: 5ファイル（SuggestionPanel, SuggestionPopover, suggestions.svelte.ts, promptGenerator.ts, HtmlRenderer）
- **修正ファイル**: MainViewer, ChangeViewer, MarkdownRenderer, markdown.ts, app.css, verify-ui.mjs, openspec/project.md, parser/server/shared/frontend API files, README
- **Spec**: suggestion-handoff の廃止、tabbed-viewer / command-shortcuts / shared-ui-parts / live-refresh / spec-browsing / cli-runtime の追随修正
- **Verification**: verify-ui.mjs の suggestion 用 state / scenario を削除し、runtime から html preview / suggestion 参照が消えていることを確認
- **依存関係**: `@lucide/svelte` の `SquarePen` は TabBar と ChangeViewer header icon で継続利用し、Suggestボタン用途のみ消える
- **依存関係**: `@tailwindcss/typography` を frontend build に追加し、Markdown styling の保守を簡素化する
