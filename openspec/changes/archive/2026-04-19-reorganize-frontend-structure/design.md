## Context

現在の frontend は SvelteKit ではなく Vite + Svelte 5 SPA で、`frontend/src` 直下には `App.svelte`, `main.ts`, `app.css` のほかに `components/`, `stores/`, `lib/` が並んでいる。ここで次の混線が起きている。

- `components/` 直下に画面 (`Dashboard`, `ChangeViewer`, `SpecViewer`) と共有部品 (`MarkdownRenderer`, `CommandShortcutBar`) と app shell に近い部品 (`SettingsModal`, `EmptyProjectState`) が混在している
- `components/layout/` は存在するが、overlay や shell 専用 UI の一部が外にあり、分類軸が揺れている
- `stores/` は `$lib` の外にあり、ネストしたコンポーネントから `../../stores/...` の相対 import が発生している
- `api.ts` に共有型が多く同居しており、ファイル責務が広い

一方で、現状のコード量はまだ大きくなく、`features/<feature>` を全面導入するほどではない。今回は「最終形」を決め打ちするのではなく、まず AI と人間が迷いにくい最小構成へ寄せる。

## Goals / Non-Goals

**Goals:**
- `frontend/src` ルートを薄く保ち、再利用コードを `$lib` 基準に寄せる
- app-wide state の置き場を `$lib/state` に統一し、深い相対 import を減らす
- Svelte コンポーネントを `layout`, `shared`, `views` の3分類で整理する
- shadcn-svelte の既存配置 (`$lib/components/ui`) は維持する
- 今回の規模に対して過剰な細分化を避ける

**Non-Goals:**
- SvelteKit への移行
- API / WebSocket / project sync ロジックの再設計
- 全モジュールの feature-first 再編
- UI 挙動や state の意味の変更
- テスト戦略の変更

## Decisions

### 1. 最小の `$lib` taxonomy を採用する

**Choice:** `frontend/src` ルートには `App.svelte`, `main.ts`, `app.css` だけを残し、アプリ内部の再利用コードは `$lib` 配下へ寄せる。今回導入する主な置き場は `$lib/state`, `$lib/components/layout`, `$lib/components/shared`, `$lib/views`, `$lib/types` とする。さらに `$lib/components/ui` は shadcn-svelte primitive 専用とし、アプリ固有の wrapper / 複合 component は `$lib/components/shared` に置く。

**Rationale:** 現状の問題は「分類が足りない」より「分類軸が混ざっている」ことにある。feature-first の大規模構成を先取りするより、まず `$lib` 基準の役割分離を揃えた方が import と探索が単純になる。

**Alternative considered:** `src/features/<feature>` を全面導入する。却下。今の規模ではディレクトリが増えすぎ、かえって探索コストが増える。

### 2. app shell 関連は `layout` にまとめる

**Choice:** `AppLayout`, `ActivityBar`, `ExplorerPane`, `MainViewer`, `TabBar`, 各種ダイアログ、`EmptyProjectState` は `$lib/components/layout/` に集約する。

**Rationale:** これらは再利用 primitive ではなく、アプリシェルを構成する部品群である。layout 配下にまとめると、「画面の枠」と「画面の中身」の境界が明確になる。

**Alternative considered:** `SettingsModal` や `EmptyProjectState` を feature / shared に分ける。却下。現状では単体ファイルであり、専用ディレクトリを切るほどの量ではない。

### 3. page-like component は `views` に寄せる

**Choice:** `Dashboard`, `ChangeViewer`, `SpecViewer` は `$lib/views/` に移す。

**Rationale:** これらは shared component ではなく、`MainViewer` が path と tab 状態に応じて切り替える画面単位のコンポーネントである。`views` に分けると layout と shared から独立して把握しやすい。

**Alternative considered:** `components/` 直下に残す。却下。現状の混線を残すため。

### 4. `stores` は `state` へ寄せ、曖昧な `index.svelte.ts` は改名する

**Choice:** `frontend/src/stores/*` を `$lib/state/*` へ移し、`index.svelte.ts` は `appData.svelte.ts` に改名する。既存の state ロジック分割 (`themeCore.ts`, `projectsCore.ts` など) は維持する。

**Rationale:** Svelte 5 的にも `state` は意図が明確で、`$lib/state/...` なら深い相対 import が消える。`index.svelte.ts` は役割が見えにくいため、AI にも人にも伝わる名前へ寄せる。

**Alternative considered:** すべてを feature-local state に分割する。却下。今の state は app shell 全体で共有されており、今回の目的よりスコープが広い。

### 5. 共有型の抽出は必要最小限にとどめる

**Choice:** `commandTypes.ts` は `$lib/types/` に移し、`api.ts` に埋まっている shared な型だけを `$lib/types/api.ts` へ抽出する。API 実装そのものは `api.ts` に残す。

**Rationale:** 共有型の所在は整理したいが、`api.ts` を全面分割すると今回の構造整理を超えてしまう。まず import 先として明快な型置き場を作る。

**Alternative considered:** `api.ts` を endpoint ごとに全面分割する。却下。今回はやりすぎ。

### 6. `ui` は shadcn primitive 専用に保つ

**Choice:** `button`, `dialog`, `sheet`, `tabs` などの shadcn-svelte primitive は `$lib/components/ui/` に残し、`dialog-header`, `error-banner`, `underline-tabs`, `explorer-section` のような app-specific wrapper は `$lib/components/shared/` に移す。

**Rationale:** `ui` に generator 管理対象と app-specific component が混在すると、AI も人間も「ここに追加してよいのは primitive か wrapper か」で迷いやすい。`ui = shadcn only` に揃えると、更新境界と責務境界が明確になる。

**Alternative considered:** app-specific wrapper も `ui/` に残す。却下。shadcn 管理領域とアプリ独自 UI の境界が曖昧なままになる。

## Risks / Trade-offs

- **[Risk] 一度に多くの import パスが変わる** → Mitigation: 役割ごとに段階移動し、各段階で typecheck/build を実行する
- **[Risk] `package.json` の test path が移動に追従しない** → Mitigation: 変更対象のテストファイルパスを最後にまとめて更新する
- **[Risk] `SettingsModal` や `CommandShortcutBar` の最終配置が将来変わる** → Mitigation: 今回は最小構成を優先し、関連ファイルが増えた時点で feature フォルダを導入する
- **[Trade-off] feature-first 構成を見送るため、完全な最終形ではない** → Acceptable: 現在の規模では、整理の効果に対して過剰設計のコストが大きい

## Migration Plan

1. `$lib/state`, `$lib/components/layout`, `$lib/components/shared`, `$lib/views`, `$lib/types` を作る
2. state modules と共有型を先に移し、import を `$lib` 基準へ更新する
3. layout / shared / views の順で Svelte コンポーネントを移動する
4. `$lib/components/ui` 配下の app-specific wrapper を `$lib/components/shared` へ移し、`ui` を shadcn primitive 専用にする
5. 空ディレクトリや古い import を掃除する
6. `npm run typecheck`, `npm run test`, `npm run build` で検証する

## Open Questions

- `SettingsModal` を将来的に `features/settings/` へ切り出すかどうかは、関連コンポーネントや専用 state が増えた段階で再判断する
- `views` が増えて route-like な責務が明確になったら、将来的に `views/` から feature / route 構成へ再編する余地がある
