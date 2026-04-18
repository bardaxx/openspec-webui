## 1. Alias-friendly structureを導入する

- [x] 1.1 `$lib/state`, `$lib/components/layout`, `$lib/components/shared`, `$lib/views`, `$lib/types` を作成する
- [x] 1.2 `frontend/src/stores/*` を `$lib/state/*` へ移動し、`index.svelte.ts` を `appData.svelte.ts` に改名する
- [x] 1.3 `commandTypes.ts` と `api.ts` 内の共有型を `$lib/types/` へ整理し、import を更新する

## 2. コンポーネントを役割別に再配置する

- [x] 2.1 app shell / overlay 関連コンポーネントを `$lib/components/layout/` へ移動する（`components/layout/*`, `SettingsModal.svelte`, `EmptyProjectState.svelte`）
- [x] 2.2 汎用ヘルパーコンポーネントを `$lib/components/shared/` へ移動する（`CommandShortcutBar.svelte`, `MarkdownRenderer.svelte`）
- [x] 2.3 画面相当コンポーネントを `$lib/views/` へ移動し、`MainViewer` などの参照先を更新する（`Dashboard.svelte`, `ChangeViewer.svelte`, `SpecViewer.svelte`）

## 3. 参照と検証を整える

- [x] 3.1 古い import、空ディレクトリ、不要な相対パス参照を削除する（`src/components/project/`, 旧 `stores/` パスなど）
- [x] 3.2 `package.json` のテスト対象パスを更新し、`npm run typecheck`, `npm run test`, `npm run build` を通す
- [x] 3.3 タブ切り替え、Dashboard/Spec/Change 表示、Settings/Search/Project ダイアログ表示を手動でスモーク確認する

## 4. ui/shared 境界を明確化する

- [x] 4.1 `$lib/components/ui/` 配下の app-specific wrapper / 複合 UI を `$lib/components/shared/` へ移動する（`callout`, `command-chip`, `dialog-header`, `empty-state`, `error-banner`, `explorer-section`, `icon-box`, `item-context-menu`, `loading-state`, `underline-tabs`）
- [x] 4.2 移動後の import と型 export を更新し、`$lib/components/ui/` を shadcn primitive 専用にする
- [x] 4.3 `npm run typecheck`, `npm run test`, `npm run build` を再実行して、主要画面の表示が崩れていないことを確認する
