## 1. Icon コンポーネント

- [ ] 1.1 `Icon.svelte` を作成（`name`, `class`, `size` props、10種類のSVG path データをmap管理）
- [ ] 1.2 全SVGが `currentColor` を使ってテキスト色を継承することを確認

## 2. SVG ベタ書きの置換

- [ ] 2.1 `Navigation.svelte` の設定アイコン(gear)を `<Icon name="gear" />` に置換
- [ ] 2.2 `Modal.svelte` の閉じるアイコン(X)を `<Icon name="close" />` に置換
- [ ] 2.3 `ChangeViewer.svelte` の展開/折りたたみアイコンを `<Icon name="chevron-right" />` / `<Icon name="chevron-down" />` に置換
- [ ] 2.4 `SpecViewer.svelte` の展開アイコンを `<Icon name="chevron-right" />` に置換
- [ ] 2.5 `ChangesList.svelte` の展開アイコンを `<Icon name="chevron-right" />` に置換
- [ ] 2.6 `TaskList.svelte` のチェック/空アイコンを `<Icon name="checkmark" />` / `<Icon name="circle" />` に置換
- [ ] 2.7 `SpecsList.svelte` のチェック/空アイコンを `<Icon name="checkmark" />` / `<Icon name="circle" />` に置換
- [ ] 2.8 `ActiveChangesList.svelte` の追加アイコンを `<Icon name="plus" />` に置換
- [ ] 2.9 `CommandShortcutBar.svelte` のコピーアイコンを `<Icon name="clipboard" />` に置換
- [ ] 2.10 `SuggestionPanel.svelte` の5箇所のSVGを `<Icon />` に置換（close×2, chevron-down, plus, lightbulb, document）

## 3. 設定画面の再設計

- [ ] 3.1 `SettingsModal.svelte` を新規作成（左ペイン + 右詳細の2カラムレイアウト）
- [ ] 3.2 左ペインに General / Commands のカテゴリリストを実装
- [ ] 3.3 General セクションにテーマ選択（Change 2 の Appearance）を移行
- [ ] 3.4 Commands セクションに CommandSettingsModal の内容（AI Tool + Expanded Commands）を移行
- [ ] 3.5 `CommandSettingsModal.svelte` を削除
- [ ] 3.6 `Navigation.svelte` の参照を `CommandSettingsModal` → `SettingsModal` に変更

## 4. 検証

- [ ] 4.1 フロントエンドビルドが成功することを確認
- [ ] 4.2 全アイコンが従来と同じ見た目で表示されることを確認
- [ ] 4.3 設定画面の General セクションでテーマ切替が動作することを確認
- [ ] 4.4 設定画面の Commands セクションでAI Tool/拡張コマンド設定が動作することを確認
- [ ] 4.5 型チェックが通ることを確認
