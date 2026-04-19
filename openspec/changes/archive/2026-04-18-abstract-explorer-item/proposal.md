## Why

ExplorerPane の3セクション（Active Changes, Archive, Specs）では、もともと `ItemContextMenu + button` のラッピング、アクティブ状態のスタイリング、クリックハンドリング、border による区切り線が重複していた。最初の狙いは共通 item コンポーネントへの抽象化だったが、最終的には「セクション構成自体が固定」であることがより支配的だった。item だけを共通化しても、`title` / `icon` / `section` / `kind` / 日付整形 / `headerExtra` の配線が `ExplorerPane` に残り続ける。

最終状態では、共有ロジックを `shared/explorer-section` モジュールに集約し、`ExplorerSection` が EmptyState と折りたたみ UI を担い、内部 `ExplorerSectionItem` が item 共通挙動を担い、各セクションは固定 wrapper コンポーネントで表現する形に整理する。

## What Changes

- `shared/explorer-section/explorer-section.svelte` に `emptyMessage` / `emptyIcon` を持たせ、`count === 0` の場合に EmptyState を自動表示する
- 同モジュール内に内部 `explorer-section-item.svelte` を追加し、`ItemContextMenu + button` 構造、border-b による区切り線、active 状態スタイル、preview/confirmed のクリックハンドリング、メタデータ表示をカプセル化する
- `ActiveChangesExplorerSection` / `ArchiveExplorerSection` / `SpecsExplorerSection` の固定 wrapper を追加し、各セクション固有の `title` / `icon` / `section` / `kind` / 表示整形 / `headerExtra` 配線を wrapper 側へ寄せる
- `ExplorerPane.svelte` から `{#if empty}` 分岐、直接の item レンダリング、直接の `ExplorerSection` 利用を削除し、wrapper コンポーネントを組み合わせる構成へ移行する

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `shared-ui-parts`: `ExplorerSection` に EmptyState 内包を追加し、`shared/explorer-section` モジュール配下の wrapper / item 抽象化を反映する。
- `explorer-pane`: `ExplorerPane` が section wrapper コンポーネントを組み合わせる最終構成に要件を更新する。

## Impact

- `frontend/src/lib/components/shared/explorer-section/explorer-section.svelte` — EmptyState を内包する共有セクション本体
- `frontend/src/lib/components/shared/explorer-section/explorer-section-item.svelte` — item 共通挙動を担う内部 helper
- `frontend/src/lib/components/shared/explorer-section/active-changes-explorer-section.svelte` — Active Changes 固定 wrapper
- `frontend/src/lib/components/shared/explorer-section/archive-explorer-section.svelte` — Archive 固定 wrapper
- `frontend/src/lib/components/shared/explorer-section/specs-explorer-section.svelte` — Specs 固定 wrapper
- `frontend/src/lib/components/shared/explorer-section/index.ts` — `ExplorerSection` と wrapper 群の公開面
- `frontend/src/lib/components/layout/ExplorerPane.svelte` — wrapper を組み合わせる薄い composition 層
