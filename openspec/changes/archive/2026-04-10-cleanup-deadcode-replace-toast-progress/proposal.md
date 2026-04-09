## Why

`TaskList.svelte` はどこからも import されていないデッドコード。`Toast.svelte` は自前の簡易実装で、shadcn-svelte の Sonner/Toast に置き換えればテーマ統合・アクセシビリティ・スタック管理が改善される。`TaskProgress.svelte` も自前 div 実装を shadcn Progress ベースに移行し、ui コンポーネントの整合性を高める。

## What Changes

- **削除**: `TaskList.svelte` — デッドコンポーネント（自己再帰のみ、外部からの import なし）
- **置き換え**: `Toast.svelte` → shadcn-svelte Sonner（`svelte-sonner`）ベースの toast システム
- **削除**: `TaskProgress.svelte` — 呼び出し側は標準の shadcn `<Progress>` を直接使用

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `shadcn-integration`: Progress コンポーネントを `$lib/components/ui/progress/` に追加し、Sonner toast を `$lib/components/ui/sonner/` に追加する
- `shared-ui-parts`: TaskProgress コンポーネントを削除し、各呼び出し側で shadcn Progress を直接使用するよう要件を更新する

## Impact

- `frontend/src/components/Toast.svelte` — 削除、`App.svelte` の toast 表示を Sonner に移行
- `frontend/src/stores/index.svelte.ts` — `addToast()` / toast 状態管理を Sonner の API に置き換え
- `frontend/src/components/TaskProgress.svelte` — 削除、呼び出し側は `<Progress>` を直接使用
- `frontend/src/components/TaskList.svelte` — 削除
- 新規追加: `$lib/components/ui/progress/`, `$lib/components/ui/sonner/`
- 依存関係: `svelte-sonner` パッケージの追加
