## Context

現在、Dashboard (`/`) と Changes (`/changes`) の2ページで `ActiveChangesList` コンポーネントを使って同一の Active Changes を表示している。Changes ページにのみ Archived Changes の折りたたみ表示がある。ナビゲーションは Dashboard / Specs / Changes の3項目。

フロントエンドは Svelte + Svelte Store による SPA ルーティング。コンポーネント構成:
- `Dashboard.svelte`: Stats Cards + ActiveChangesList + Project Docs
- `ChangesList.svelte`: ActiveChangesList + Archived Changes (toggle)
- `ActiveChangesList.svelte`: 共通リストコンポーネント
- `Navigation.svelte`: ナビゲーションバー

## Goals / Non-Goals

**Goals:**
- Dashboard を Home に改名し、Active Changes の単一表示ポイントにする
- Stats Cards を削除し、件数はナビゲーションバッジとセクションヘッダーバッジで代替
- Changes ページを Archived Changes 専用にする
- 3ページ構成（Home / Archived / Specs）に整理
- バックリンクを新しいルート構造に合わせる
- ナビゲーションアクティブ状態の Svelte リアクティビティバグを修正

**Non-Goals:**
- 既存の ChangeViewer / SpecViewer の内部機能変更はしない
- API エンドポイントの変更はしない
- `ActiveChangesList` コンポーネント自体の仕様変更はしない

## Decisions

### D1: Home ページの構成
`/` に Active Changes（ヘッダーに件数バッジ付き）+ Project Docs を配置。Stats Cards は削除。件数情報はナビゲーションバッジ（Specs数・Archived数）とセクションヘッダーバッジ（Active Changes数）で十分に代替できる。

**代替案**: Stats Cards をコンパクト化して残す → 情報がナビゲーションと重複するため不採用。

### D2: Changes ページ → Archived 専用
`ChangesList.svelte` から Active Changes セクションを削除し、Archived Changes のみを表示。ページタイトルを「Archived Changes」に統一。

**代替案**: 別コンポーネント新規作成 → 既存コンポーネントの修正で対応可能なので不採用。

### D3: ナビゲーション構成
Specs / Changes の2項目。ロゴクリックで `/` に戻る。Changes のバッジは Archived Changes 数を表示。Dashboard リンクは不要（ロゴが Home へのリンク）。

### D4: ナビゲーションアクティブ状態のバグ修正
`isActive()` 関数内で `$currentRoute` を読んでいたが、Svelte はテンプレート式内で関数経由の store 読み取りをリアクティブに追跡しないため、ルート変更時にハイライトが更新されなかった。`isActive()` を削除し、テンプレート内で直接 `$currentRoute.startsWith(...)` を使うことで修正。

### D5: バックリンク
- `ChangeViewer`: 戻るリンクを状況に応じて Home (`/`) または Archived Changes (`/changes`) にする（change が active か archived かで判定）
- `SpecViewer`: 戻るリンクは `/specs` のまま

## Risks / Trade-offs

- [ユーザーが Changes ページで Active Changes を探す癖がある] → Home が Active Changes の正しい場所であることをナビゲーションで明示。移行期の混乱は最小限。
- [Stats Cards 削除でメトリクスが見えなくなる] → ナビゲーションバッジ（Specs数・Archived数）と Active Changes ヘッダーバッジ（件数）で同等情報を表示。Overall Progress は各 change の TaskProgress で個別に確認可能。
