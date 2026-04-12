## Context

Suggestion機能はchange文書のテキストブロックを選択→suggestion入力→蓄積→AIプロンプト生成→クリップボードコピー、というワークフローを提供していた。現在のアーキテクチャ:

```
ChangeViewer (Suggest button)
  └→ suggestionStore (suggestions.svelte.ts)
       ├→ MarkdownRenderer (block選択UI)
       ├→ SuggestionPopover (block上の浮動エディタ)
       ├→ SuggestionPanel (サイドバー/sheet)
       │    └→ promptGenerator.ts
       └→ MainViewer (wide: sidebar / narrow: Sheet)
```

- storeはlocalStorageにper-changeで永続化
- MarkdownRendererは `renderMarkdownWithBlocks()` でブロックID付きHTMLを生成
- narrow modeではSheet (shadcn) でフローティング表示 → メインと同時使用不可
- `app.css` に `.suggestion-mode` スタイルとCSS変数 `--suggestion-panel-width`
- 変更履歴の都合で HTML artifact preview (`HtmlRenderer.svelte`, `.html` file discovery, raw file route) も残っているが、現行 OpenSpec 前提では不要

## Goals / Non-Goals

**Goals:**
- Suggestion機能の完全な削除とコードベースの簡素化
- 削除後の残存コンポーネント（MarkdownRenderer, ChangeViewer, MainViewer）のクリーンアップ
- suggestion-handoff specの廃止
- suggestion削除で古くなる `command-shortcuts` / `project.md` の記述を同期する
- 不要な HTML artifact preview support を削除して markdown-only 前提に揃える
- Markdown styling を `@tailwindcss/typography` ベースへ移行して、過剰な hand-written typography CSS を減らす

**Non-Goals:**
- 代替機能の設計・実装（将来のchangeで対応）
- Sheet コンポーネント自体の削除（他の用途で使われる可能性がある）
- parser / watcher の general file grouping モデル自体の廃止

## Decisions

### D1: 削除は一括で行う（段階的ではない）

**決定**: 関連ファイル・コードを1つのchangeで全削除する

**理由**: suggestion機能は独立した機能領域であり、部分的に残すメリットがない。段階的削除は中間状態の複雑さを増すだけ。

### D2: `renderMarkdownWithBlocks` は削除、`renderMarkdown` は残す

**決定**: `markdown.ts` から `renderMarkdownWithBlocks`、`SELECTABLE_BLOCK_TAGS`、関連importを削除。`renderMarkdown` と `highlightDeltas` は残す。

**理由**: `highlightDeltas` はspec delta表示で使用中。`renderMarkdown` はMarkdownRendererの基本レンダリング。

### D3: `SquarePen` アイコンは suggestion 以外の change 表示で維持する

**決定**: Suggestボタン用途の `SquarePen` は削除するが、ChangeViewer header の active change icon と TabBar の active change icon 用途は残す。

**理由**: suggestion feature を消しても active change の既存アイコン体系までは変えない。header icon を変えるのは無関係な見た目変更になる。

**注意**: tabbed-viewer spec ではchange tabのアイコンとして `SquarePen` が指定されている。TabBar での `SquarePen` 利用は残る（TabBar自体はsuggestionに依存しない）。

### D4: suggestion-handoff spec は REMOVED としてマーク

**決定**: delta spec で capability ごと REMOVED にする。archive時点で `openspec/specs/suggestion-handoff/` ごと削除される。

### D5: suggestion 用CSS変数と `.suggestion-mode` スタイルの削除

**決定**: `app.css` から `.suggestion-mode` セクションと suggestion panel 用CSS変数（`--suggestion-panel-width`, `--suggestion-panel-gap`）を削除する。他のスタイルへの影響なし。

### D6: stale spec / project context copy も同じ change で片付ける

**決定**: suggestion削除によって古くなる `command-shortcuts` spec の Suggest / Exit 記述と、`openspec/project.md` の review handoff workflow 文言もこの change で更新する。

**理由**: 実装だけ削除して artifact を残すと、archive / sync 後に main spec と project context が feature 不在の現実に追随しない。

### D7: HTML artifact support はこの change でまとめて削除する

**決定**: `HtmlRenderer.svelte` のみを消すのではなく、`.html` file discovery / API route / frontend branching / watcher / spec text まで同じ change で削除する。

**理由**: 現行 OpenSpec 前提では markdown-only で十分であり、UI だけ消すと parser/server/spec が不整合になる。related dead code は同じ cleanup window でまとめて落とす。

### D8: Markdown typography は plugin ベースへ寄せる

**決定**: `@tailwindcss/typography` を導入し、`MarkdownRenderer.svelte` の wrapper に `prose max-w-none` を付与する。`app.css` では `--tw-prose-*` 変数と task list / diff など必要最小限の override のみ残す。

**理由**: Markdown 専用 renderer component は shadcn-svelte に存在しないため、parser/render は維持しつつ styling layer だけを plugin ベースに寄せるのが最小で保守しやすい。

## Risks / Trade-offs

- **[後で必要になった場合]** → 新規changeで再設計。旧コードはgit履歴に残るので参照可能。
- **[localStorageの残留データ]** → `openspec-suggestions-*` キーがブラウザに残るが、コードからの参照がなくなるので実害なし。クリーンアップスクリプトは不要。
- **[HTML mockup を使いたい需要]** → OpenSpec mainline では markdown-only を前提にし、将来本当に必要なら別 change で dedicated preview を再設計する。
- **[`typography` plugin 導入で prose default が強すぎる]** → `app.css` の `--tw-prose-*` と limited override で既存 theme token に寄せる。`task list` と `diff` は custom style を維持する。
