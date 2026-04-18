## Why

`frontend/src` は `components/`, `stores/`, `lib/` に責務がまたがっており、画面コンポーネント・アプリシェル・共有 UI・共有 state の置き場が一貫していない。特に `stores/` が `$lib` の外にあるため、深い階層からの import が不揃いになり、AI と人間の両方にとって構造判断がしづらい。今の規模に合わせて、過剰な feature 分割は避けつつ、役割が明確な最小構成へ整理する。

## What Changes

- アプリ全体で共有する rune state を `frontend/src/stores/` から `frontend/src/lib/state/` へ移動する
- `frontend/src/components/` を役割ごとに再配置し、app shell/overlay は `$lib/components/layout/`、汎用 UI は `$lib/components/shared/`、画面相当のコンポーネントは `$lib/views/` に整理する
- shadcn-svelte 生成物は `$lib/components/ui/` に維持し、app-specific な wrapper / 複合 UI は `$lib/components/shared/` へ分離する
- 共有 TypeScript 型を `$lib/types/` に寄せ、実装ファイルに埋まった共有型を必要最小限だけ抽出する
- 空ディレクトリや曖昧なファイル名を整理し、移動後の import を `$lib/...` 基準に揃える
- **BREAKING**: フロントエンド内部の import パスが変わる

## Capabilities

### New Capabilities

- `frontend-module-organization`: Svelte 5 SPA フロントエンドのディレクトリ責務を、`$lib` 基準の最小構成として定義する

### Modified Capabilities

- （なし）

## Impact

- `frontend/src/stores/*` → `$lib/state/*` への移動と import 更新
- `frontend/src/components/layout/*`, `SettingsModal.svelte`, `EmptyProjectState.svelte` → `$lib/components/layout/*` への移動
- `frontend/src/components/CommandShortcutBar.svelte`, `MarkdownRenderer.svelte` → `$lib/components/shared/*` への移動
- `frontend/src/lib/components/ui/` 配下の app-specific custom component → `$lib/components/shared/*` への移動
- `frontend/src/components/Dashboard.svelte`, `ChangeViewer.svelte`, `SpecViewer.svelte` → `$lib/views/*` への移動
- `frontend/src/lib/api.ts`, `frontend/src/lib/commandTypes.ts` などの共有型整理
- `package.json` のテスト対象パス、および必要に応じた TypeScript import 更新
