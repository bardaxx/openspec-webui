## Context

`SettingsModal.svelte` では Theme 選択がアイコン付きのカード型セレクタで実装されている一方、Workflow 選択は横並びのラジオ行のままで、同じ設定ダイアログ内でも視覚パターンが揃っていない。今回の変更は Workflow 設定の見た目だけを Theme 側へ合わせる小さな UI 調整であり、workflow 値、コマンド生成、localStorage 永続化、下部の callout 文言は変更しない。

## Goals / Non-Goals

**Goals:**
- Workflow 選択を Theme 選択と同じカード型 UI に揃える
- 既存の `standard` / `claude-code` / `skill` 選択値と保存挙動をそのまま維持する
- アイコン、選択ハイライト、コマンドプレビューを使って各選択肢を見分けやすくする

**Non-Goals:**
- workflow フォーマット値やコマンド文字列規則の変更
- Settings dialog のカテゴリ構成や callout 内容の変更
- 新しい共有 UI コンポーネントの導入

## Decisions

### D1. Theme セレクタのカードパターンを Workflow にそのまま適用する

Workflow の 3 選択肢を、Theme セクションと同じ縦積みカードレイアウト・選択時ハイライト・hover state へ揃える。別デザインを新規に作るより、既存パターンを踏襲した方がダイアログ全体の一貫性が高く、実装範囲も `SettingsModal.svelte` に限定できる。

**代替案:** 共通 OptionCard コンポーネントを新設する。今回は利用箇所が限定的で、抽象化のコストが見合わないため見送る。

### D2. ネイティブ radio の意味論は維持し、見た目だけカード化する

各選択肢は `<label>` 配下に `sr-only` の radio input を残し、既存の `checked` / `onchange` バインディングを継続利用する。これにより、保存ロジックやアクセシビリティを変えずに UI だけ更新できる。

**代替案:** button ベースのカスタムセレクタへ置き換える。状態管理とキーボード操作の実装負荷が増えるため採用しない。

### D3. 各 workflow に専用アイコンを付け、既存のコマンド preview を subtitle として残す

`standard` / `claude-code` / `skill` へそれぞれ視認しやすい Lucide icon を付け、既存の `<code>` preview はカード内の補足情報として残す。これにより Theme セレクタと同じ「アイコン + ラベル + 補足情報」の読み取り順を実現する。

## Risks / Trade-offs

- **[スタイル重複]** 解決済み — 共通 `OptionCard` コンポーネントに集約した
- **[横幅の消費]** カード化で各選択肢の占有幅が増える → 既存の `md:grid-cols-3` を維持し、1 列時でも中央寄せで読めるようにする
- **[視覚変更のみ]** 機能変更がないため spec との対応が曖昧になりやすい → 「カード型 workflow 選択」という UI 要件を delta spec に明示する

## Migration Plan

追加のデータ移行は不要。既存の保存済み workflow 値はそのまま使い、フロントエンド更新後は同じ値をカード UI で表示する。

## Open Questions

- なし
