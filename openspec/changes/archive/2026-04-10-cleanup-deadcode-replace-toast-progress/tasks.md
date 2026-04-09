## 1. デッドコード削除

- [x] 1.1 `frontend/src/components/TaskList.svelte` を削除

## 2. Sonner toast 導入

- [x] 2.1 `svelte-sonner` パッケージをインストール
- [x] 2.2 `$lib/components/ui/sonner/` に shadcn-svelte Sonner コンポーネントを追加（`Toaster` コンポーネント + `toast()` 関数の re-export）
- [x] 2.3 `App.svelte` の toast 表示セクションを `<Toaster />` に置き換え、既存の `<div class="fixed bottom-4 right-4">` と `{#each}` ループを削除
- [x] 2.4 `stores/index.svelte.ts` の `addToast()` を `toast()` / `toast.success()` / `toast.error()` に置き換え、`toasts` state と `toastId` カウンターを削除
- [x] 2.5 `addToast` の全呼び出し箇所を grep で確認し、新しい `toast()` API に移行

## 3. shadcn Progress 導入

- [x] 3.1 `$lib/components/ui/progress/` に shadcn-svelte Progress コンポーネントを追加
- [x] 3.2 `TaskProgress.svelte` の全呼び出し側（`Dashboard`, `ChangeViewer`, `ExplorerPane`）を `<Progress value={progress.percentage} />` に置き換え

## 4. クリーンアップ

- [x] 4.1 `frontend/src/components/TaskProgress.svelte` を削除
- [x] 4.2 `frontend/src/components/Toast.svelte` を削除
- [x] 4.3 ビルドが正常に完了することを確認
