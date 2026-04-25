## Why

`2026-04-25-sync-specs-with-implementation` の確認で、同期後の main spec にまだ古い文言・参照が残っており、さらに初回 Add Project が `project:bound` を経由せずに未初期化の workspace 状態へ遷移しうることが分かった。spec sync の完了性を回復しつつ、この実装不整合を別 Change として安全に修正する必要がある。

## What Changes

- Add/reactivate project フローを修正し、`project:bound` 確認前に project-scoped UI を ready 扱いしないようにする
- SearchDialog の debounce を修正し、短い query へ戻した後や query 変更後に古い結果が再表示されないようにする
- 先行 sync change 後も残っていた main spec の stale wording / stale component path を整理する

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `client-project-binding`: API 起点の add/reactivate 後も `project:bound` を binding 完了の基準として明文化する
- `project-selector-ui`: 初回 Add Project を `project:bound` 完了まで loading として扱う
- `search`: stale debounce / stale response を無視する要件を追加する
- `activity-bar`: tooltip requirement の stale wording を bottom control に修正する
- `project-registry`: `connection:init` シナリオから古い `project:switched` 前提を除去する
- `command-shortcuts`: `CommandChip` の参照パスを shared component 構成に合わせる
- `shared-ui-parts`: `CommandChip` / `ItemContextMenu` の shared component path を実装に合わせる
- `explorer-pane`: list item component 名を `ExplorerSectionItem` に統一する

## Impact

- `frontend/src/lib/state/projects.svelte.ts`
- `frontend/src/lib/state/appData.svelte.ts`
- `frontend/src/lib/components/layout/AddProjectDialog.svelte`
- `frontend/src/lib/components/layout/SearchDialog.svelte`
- project binding / search 関連のテスト
- 上記 capability に対応する `openspec/specs/*/spec.md`
