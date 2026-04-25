## 1. Spec delta repair

- [x] 1.1 `client-project-binding` / `project-selector-ui` / `search` の delta spec を追加し、今回の修正後の期待挙動を明文化する
- [x] 1.2 `activity-bar` / `project-registry` / `command-shortcuts` / `shared-ui-parts` / `explorer-pane` の stale wording と stale component path を delta spec で修正する

## 2. Project binding implementation

- [x] 2.1 Add/reactivate project フローを修正し、local snapshot 状態だけで `project:bind` を skip しないようにする
- [x] 2.2 初回 Add Project と reactivate flow で、`project:bound` を起点に project-scoped refresh / loading が完了するよう state 遷移を整える
- [x] 2.3 project binding の回帰テストを追加または更新し、empty state からの初回追加と既存 project の再選択を検証する

## 3. Search implementation

- [x] 3.1 SearchDialog の debounce を修正し、query 変更後・短縮後の stale timer / stale response を無視する
- [x] 3.2 Search の回帰テストを追加または更新し、短い query への戻しと連続入力の race を検証する

## 4. Verification

- [x] 4.1 関連する frontend / server テストを実行し、project binding と search の修正を確認する
- [x] 4.2 変更後の spec を確認し、`openspec status --change "fix-project-binding-and-spec-drift"` が apply-ready になることを確認する
