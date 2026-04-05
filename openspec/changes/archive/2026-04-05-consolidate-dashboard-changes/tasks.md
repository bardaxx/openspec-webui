## 1. Navigation

- [x] 1.1 `Navigation.svelte` の Dashboard リンクを削除し、Specs / Changes の2項目にする
- [x] 1.2 Changes ナビゲーションのバッジを archived changes 数に変更
- [x] 1.3 ナビゲーションアクティブ状態のリアクティビティバグを修正（`isActive()` 関数を削除し、テンプレート内で `$currentRoute.startsWith()` を直接使用）

## 2. Home Page (Dashboard → Home)

- [x] 2.1 `Dashboard.svelte` のページタイトルを "Dashboard" → "Home" に変更
- [x] 2.2 Stats Cards セクション全体を削除
- [x] 2.3 Active Changes セクションヘッダーに件数バッジを追加
- [x] 2.4 未使用になった import（`stats`, `navigateTo`, `TaskProgress`）を削除

## 3. Changes Page (Archived 専用化)

- [x] 3.1 `ChangesList.svelte` から Active Changes セクションと `CommandShortcutBar` を削除
- [x] 3.2 ページタイトルを "Changes" → "Archived Changes" に変更
- [x] 3.3 Archived Changes のトグル表示を常時表示に変更
- [x] 3.4 アーカイブがない場合 "No archived changes" を表示

## 4. Back Links

- [x] 4.1 `ChangeViewer.svelte` の戻るリンクを、active change なら `/`、archived change なら `/changes` に条件分岐
- [x] 4.2 `SpecViewer.svelte` の戻るリンクが `/specs` であることを確認（変更不要）

## 5. Cleanup

- [x] 5.1 未使用の import（`CommandShortcutBar` 等）を `ChangesList.svelte` から削除
- [x] 5.2 ビルド・型チェックが通ることを確認
