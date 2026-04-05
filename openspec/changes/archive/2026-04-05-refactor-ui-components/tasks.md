## 1. Icon コンポーネント

- [x] 1.1 `Icon.svelte` を作成（`name`, `class`, `size` props、現行UIで使うアイコン群のSVG path データをmap管理）
- [x] 1.2 全SVGが `currentColor` を使ってテキスト色を継承することを確認

## 2. SVG ベタ書きの置換

- [x] 2.1 `Navigation.svelte` の設定アイコン(gear)を `<Icon name="gear" />` に置換
- [x] 2.2 `Modal.svelte` の閉じるアイコン(X)を `<Icon name="close" />` に置換
- [x] 2.3 `ChangeViewer.svelte` の戻る/提案開始アイコンを `<Icon name="chevron-left" />` / `<Icon name="pencil-square" />` に置換
- [x] 2.4 `SpecViewer.svelte` の戻るアイコンを `<Icon name="chevron-left" />` に置換
- [x] 2.5 `ChangesList.svelte` のアーカイブアイコンを `<Icon name="archive-box" />` に置換
- [x] 2.6 `TaskList.svelte` の完了/未完了アイコンを `<Icon name="check-circle" />` / `<Icon name="circle" />` に置換
- [x] 2.7 `SpecsList.svelte` の document / chevron-right アイコンを `<Icon />` に置換
- [x] 2.8 `ActiveChangesList.svelte` の提案開始アイコンを `<Icon name="pencil-square" />` に置換
- [x] 2.9 `CommandShortcutBar.svelte` のコピーアイコンを `<Icon name="clipboard" />` に置換
- [x] 2.10 `SuggestionPanel.svelte` の7箇所のSVGを `<Icon />` に置換（close×2, pencil-square, pencil, trash, document-arrow×2）

## 3. 設定画面の再設計

- [x] 3.1 `SettingsModal.svelte` を新規作成（左ペイン + 右詳細の2カラムレイアウト）
- [x] 3.2 左ペインに General / AI Tool / Commands のカテゴリリストを実装
- [x] 3.3 General セクションにテーマ選択（Change 2 の Appearance）を移行
- [x] 3.4 AI Tool セクションに CommandSettingsModal の AI Tool 設定を移行
- [x] 3.5 Commands セクションに CommandSettingsModal の Expanded Commands 設定を移行
- [x] 3.6 `CommandSettingsModal.svelte` を削除
- [x] 3.7 `Navigation.svelte` の参照を `CommandSettingsModal` → `SettingsModal` に変更

## 4. SettingsModal レイアウト改善

- [x] 4.1 `Modal.svelte` の横幅を `max-w-3xl` → `max-w-4xl` に拡張
- [x] 4.2 `Modal.svelte` に画面基準の固定高さ（`h-[85vh]`）とスクロール対応を追加
- [x] 4.3 `SettingsModal.svelte` の左ペインを固定高さ・スクロール可能に変更
- [x] 4.4 `SettingsModal.svelte` の右コンテンツエリアを固定高さ・スクロール可能に変更
- [x] 4.5 AI Tool / Expanded Commands を独立セクションとして分離
- [x] 4.6 狭い幅でカテゴリボタンを横並び・均一幅にする
- [x] 4.7 サイドパネルを簡素化し、カテゴリボタンをラベル + アイコンのみへ調整

## 5. 検証

- [x] 5.1 フロントエンドビルドが成功することを確認
- [x] 5.2 全アイコンが従来と同じ見た目で表示されることを確認
- [x] 5.3 設定画面の General セクションでテーマ切替が動作することを確認
- [x] 5.4 設定画面の AI Tool / Expanded Commands セクションで各設定が動作することを確認
- [x] 5.5 設定画面が画面からはみ出さず、スクロールで全項目にアクセスできることを確認
- [x] 5.6 型チェックが通ることを確認
