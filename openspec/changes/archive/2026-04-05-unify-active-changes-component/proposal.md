## Why

Dashboard と Changes ページで「Active Changes」リストが独立したマークアップで重複実装されており、見た目や機能の差異（アイコン有無、レイアウト等）が生じている。また CommandShortcutBar が独立したカードセクションとして配置されているため、画面上の占有面積が大きく、セクションヘッダーと一体化することでよりスリムなレイアウトが可能になる。

## What Changes

- Active Changes リストを再利用可能な `ActiveChangesList` コンポーネントに抽出し、Dashboard と Changes ページ双方で利用する
- CommandShortcutBar からタイトル・説明文・外枠カードを削除し、ボタン群のみを描画するスリムな形に変更する
- Dashboard の Active Changes セクションヘッダーの右側に CommandShortcutBar のボタン群をインライン配置する
- Changes ページの Active Changes セクションヘッダーの右側に CommandShortcutBar のボタン群をインライン配置する
- ChangeViewer のヘッダー（戻るボタン・タイトル・Suggest Changes ボタン）の右側に CommandShortcutBar のボタン群をインライン配置する

## Capabilities

### New Capabilities

（なし — 既存コンポーネントのリファクタリングと配置変更のみ）

### Modified Capabilities

- `change-browsing`: Active Changes リストを共有コンポーネント化し、Dashboard と Changes ページで統一された表示にする
- `command-shortcuts`: CommandShortcutBar をボタン群のみのスリム構成にし、セクションヘッダーや ChangeViewer ヘッダーにインライン配置する

## Impact

- `frontend/src/components/Dashboard.svelte` — Active Changes リストを ActiveChangesList に置換、CommandShortcutBar の配置変更
- `frontend/src/components/ChangesList.svelte` — Active Changes リストを ActiveChangesList に置換、CommandShortcutBar の配置変更
- `frontend/src/components/ChangeViewer.svelte` — ヘッダーに CommandShortcutBar ボタン群をインライン配置
- `frontend/src/components/CommandShortcutBar.svelte` — 外枠カード・タイトル・説明文を削除し、ボタン群のみを描画するように変更
- `frontend/src/components/ActiveChangesList.svelte` — 新規追加、共有 Active Changes リストコンポーネント
