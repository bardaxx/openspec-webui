## 1. CommandShortcutBar スリム化

- [x] 1.1 CommandShortcutBar.svelte から外枠カード（`border`, `rounded-lg`, `bg-gray-800`, `p-4`, `shadow-lg`）を削除し、ボタン群のみを描画するように変更する
- [x] 1.2 CommandShortcutBar.svelte からタイトル（`<h2>`）と説明文（`<p>`）の描画を削除し、`title`・`description` props を unused としてマークする

## 2. ActiveChangesList 共有コンポーネント作成

- [x] 2.1 `ActiveChangesList.svelte` を新規作成し、ChangesList のリッチな行表示（アイコン + 名前 + spec delta 数 + design バッジ + TaskProgress）をベースに props（`changes`, `onSelect`）で汎用化する

## 3. Dashboard・ChangesList の配置変更

- [x] 3.1 Dashboard.svelte の Active Changes セクションヘッダーを `flex items-center justify-between` にし、右側に CommandShortcutBar ボタン群をインライン配置する
- [x] 3.2 Dashboard.svelte の Active Changes リストを ActiveChangesList コンポーネントに置換する
- [x] 3.3 Dashboard.svelte から独立した CommandShortcutBar セクションを削除する
- [x] 3.4 ChangesList.svelte の Active Changes セクションヘッダーを `flex items-center justify-between` にし、右側に CommandShortcutBar ボタン群をインライン配置する
- [x] 3.5 ChangesList.svelte の Active Changes リストを ActiveChangesList コンポーネントに置換する
- [x] 3.6 ChangesList.svelte から独立した CommandShortcutBar セクションを削除する

## 4. ChangeViewer の配置変更

- [x] 4.1 ChangeViewer.svelte のヘッダー（戻るボタン・タイトル・Suggest Changes ボタン）に CommandShortcutBar ボタン群をインライン配置する
- [x] 4.2 ChangeViewer.svelte から独立した CommandShortcutBar セクションを削除する
