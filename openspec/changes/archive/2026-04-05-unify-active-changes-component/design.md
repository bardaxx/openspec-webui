## Context

現在、Dashboard (`Dashboard.svelte`) と Changes ページ (`ChangesList.svelte`) のそれぞれに独立した Active Changes リストのマークアップが存在する。Dashboard 側はシンプルな行表示、Changes 側はアイコン付きのリッチな行表示となっており、同一データ（`$activeChanges` ストア）を使いながら表示に差異がある。

CommandShortcutBar はタイトル・説明文・外枠カードを含む独立したセクションとして描画されており、Dashboard・Changes・ChangeViewer の各ページでそれぞれセクションとして配置されているため、縦方向の占有面積が大きい。

## Goals / Non-Goals

**Goals:**
- Active Changes リストの表示を Dashboard と Changes ページで完全に統一する
- CommandShortcutBar をボタン群のみのスリムな構成にし、セクションヘッダーにインライン配置して画面占有率を下げる
- ChangeViewer のヘッダーにもコマンドボタンを自然に配置する

**Non-Goals:**
- ストアや API の変更（データレイヤーは変更しない）
- 新規コンポーネントの追加以外のアーキテクチャ変更
- Archived Changes セクションの変更（ChangesList 側はそのまま維持）

## Decisions

### 1. ActiveChangesList コンポーネントの抽出
- ChangesList のリッチな行表示（アイコン + spec delta 数 + design バッジ + TaskProgress）をベースに `ActiveChangesList.svelte` を新規作成する
- Props: `changes`（配列）, `onSelect`（コールバック）のみ
- Dashboard の Stats Card の Active Changes 数値表示は Stats セクションの一部として残す（リストとは別物）

### 2. CommandShortcutBar のスリム化
- 外枠カード（`border`, `rounded-lg`, `bg-gray-800`, `p-4`, `shadow-lg`）を削除
- タイトル（`<h2>`）と説明文（`<p>`）を削除
- ボタン群のみを描画する `<div class="flex flex-wrap gap-2">` に変更
- `title`・`description` props は非推奨とし（後方互換のため残すが使用しない）、Props は `commands`, `changeName` に絞る

### 3. ヘッダーへのインライン配置パターン
- Dashboard・ChangesList の Active Changes セクションヘッダー：`<div class="flex items-center justify-between">` でタイトル `<h2>` の右側に CommandShortcutBar を配置
- ChangeViewer のヘッダー：既存の戻るボタン・タイトル・Suggest Changes ボタンの並びの右側（または Suggest Changes の左）に CommandShortcutBar を配置
- CommandShortcutBar が非表示（`commands.length === 0`）の場合はレンダリングしない

## Risks / Trade-offs

- **既存の title/description が消える →** Dashboard・ChangesList では「Workspace Commands」というセクションが消滅するが、ボタンがセクションヘッダーに統合されることで文脈は維持される
- **CommandShortcutBar の破壊的変更 →** CommandShortcutBar はプロジェクト内の3箇所でのみ使用されており、すべてこの change で同時に修正するためリスクは低い
