## Context

現在の OpenSpec WebUI は Vite + Svelte 5 の CSR アプリで、i18n ライブラリは未導入。`frontend/src/lib/components/layout/SettingsModal.svelte` に Settings ダイアログは存在し、theme / workflow / preview tab などの設定は localStorage ベースの store で管理されている。一方で UI 文言は各コンポーネントに英語で分散ハードコードされており、`frontend/index.html` の `<html lang>` も `en` 固定、`frontend/src/lib/utils.ts` の `formatDate()` も locale 非対応である。

今回の変更は Settings、Activity Bar、Explorer、Dashboard、Project Selector、Search、Spec/Change Viewer、context menu、toast など複数モジュールを横断する。単に辞書ファイルを追加するだけではなく、build 生成、初期 locale 解決、Settings からの切替、document 属性、共有 formatter、shared UI feedback を一貫した流れで設計する必要がある。

## Goals / Non-Goals

**Goals:**
- Paraglide JS を使った型安全な UI 多言語基盤を導入する
- 初期対応言語として `en` と `ja` をサポートする
- Settings の General セクションから言語を切り替えられるようにする
- 言語切替後も現在のタブ / overlay 文脈を維持したまま UI 文言を更新できるようにする
- locale をブラウザに永続化し、初回訪問時はブラウザ言語を利用して妥当な初期 locale を選ぶ
- `<html lang>` / `dir` と日付表示を現在 locale に同期する

**Non-Goals:**
- OpenSpec の markdown 本文 (`spec.md`, `proposal.md`, `design.md` など) を機械翻訳すること
- locale prefix 付き URL や SEO 向け i18n routing を導入すること
- `en` / `ja` 以外の locale をこの change の初期スコープに含めること
- サーバー側 API レスポンスを locale 別に変えること

## Decisions

### D1: Paraglide JS を Vite plugin と frontend 内カタログで導入する

`frontend/vite.config.ts` に Paraglide JS plugin を追加し、`frontend/project.inlang` と `frontend/messages/*.json` を source-of-truth にする。生成物は `frontend/src/lib/paraglide/` 配下へ出力し、Svelte コンポーネントはそこから typed messages / runtime を import する。固定英語の短い title / command-derived term は `frontend/src/lib/uiText.ts` の code constants に集約し、`frontend/messages/*.json` には locale ごとに差が出る説明文・help text に加えて、ユーザーに直接返る error / toast / context menu 文言を残す。

**理由**: 現在のアプリは SvelteKit ではなく Vite ベースの CSR 構成なので、SvelteKit middleware や locale routing を持ち込む必要はない。i18n 資産を `frontend/` に閉じ込めることで build 設定と責務が明確になり、OpenSpec 本体や Node サーバー側ファイルと混ざらない。

**代替案**: 手書き JSON 辞書 + 自前 lookup 関数 → 型安全性がなく、キー不整合や未使用文言の温床になるため不採用。

### D2: locale 解決は custom strategy + browser fallback で行う

Paraglide runtime の strategy は `custom-openspec-locale -> preferredLanguage -> baseLocale` とし、custom strategy が dedicated storage key (`openspec-locale`) を読み書きする。初回訪問時は保存済み locale がなければ browser language から `ja` / `en` を解決し、どちらにも正規化できなければ `en` を使う。

**理由**: built-in `localStorage` strategy だけでは保存キーや bootstrap の責務が runtime 内部に隠れ、`index.html` の先行初期化と揃えにくい。custom strategy にすることで既存設定 store と同じ命名規約を守りながら、早期 bootstrap・永続化・将来拡張を明示的に制御できる。

**代替案**: `localStorage` built-in strategy をそのまま使う → 実装量は少ないが、初期 `<html lang>` 同期や既存設定基盤との整合が弱いため不採用。

### D3: 言語切替は reload なしで反映する

locale 変更は Paraglide runtime の `setLocale(..., { reload: false })` を使用し、同時に rune ベースの `localeStore` を更新する。各 UI コンポーネントは message 呼び出し時に locale store に依存することで再描画し、theme 設定と同様に Settings 操作で即時反映させる。

**理由**: 現在のアプリはページ reload 時にタブ状態や一時 overlay 文脈を保持しないため、locale 切替で full reload を起こすと UX が悪い。Settings 内の他設定（theme, preview tabs）と同様にその場で切り替わる挙動に揃える。

**代替案**: `setLocale()` のデフォルト reload 動作を使う → 実装は単純だが、現在の作業文脈を壊すので不採用。

### D4: 翻訳対象は application chrome の説明文中心に限定する

翻訳対象は Settings、Activity Bar、Explorer、Dashboard、Project Selector、Search、Viewer の補足説明・help text・empty state 説明に加えて、toast / error / context menu 文言と copy feedback を含める。Settings / Dashboard / Archive / Specs / Workflow / Commands / Specification / Design / Spec Deltas / Next Step のような短い title、OpenSpec command 名、folder/capability と対応する用語は英語固定で表示し、これらは message catalog ではなく code constants で管理する。OpenSpec の markdown 本文、change/spec 名、ユーザーが作成したファイル内容もそのまま表示する。

**理由**: command や folder 構成が英語のままなのに UI 見出しまで翻訳すると、OpenSpec 上の用語との対応関係が見えづらくなる。短い title / command-derived term は英語のまま、補足説明だけを各 locale に合わせて翻訳する方が、関連性と理解の両方を保ちやすい。

### D5: document 属性と日付 formatter は locale store から一元同期する

`frontend/index.html` で保存済み locale か browser language を元に `<html lang>` と `dir` を Svelte mount 前に設定し、アプリ起動後は `localeStore.initialize()` / `localeStore.setLocale()` が document 属性を更新し続ける。`formatDate()` は active locale に応じて `Intl.DateTimeFormat` を使い、表示順序だけを locale 化しつつ同一 calendar day を維持するため UTC 基準で日付を整形する。

**理由**: 初回描画前に `lang` が正しくないと assistive technology やブラウザヒントがずれる。日付は locale-aware にしたい一方で、現行 UI の日境界が端末 timezone でずれないようにしたい。

## Risks / Trade-offs

- **[ハードコード文言の取りこぼし]** → Settings / layout / viewer / shared helper ごとに置換対象を棚卸しし、最終検証で repo 全体を再検索する
- **[reload なし切替で一部コンポーネントが再描画されない]** → locale store を経由する message helper を用意し、主要画面で en↔ja の切替検証を行う
- **[翻訳キーの不足やズレ]** → `en` を source-of-truth にして `ja` を同期し、build/typecheck を必須検証に含める
- **[locale-aware date 表示の回帰]** → `formatDate()` のユニットテストを追加し、固定 timestamp で `en` / `ja` の双方を確認する
- **[generated files の管理コスト]** → 生成先を `frontend/src/lib/paraglide` に固定し、message source と generated files を明示的に分離する

## Migration Plan

1. Paraglide JS dependency・project config・message catalog・generated runtime を追加する
2. locale store / custom strategy / early bootstrap を追加し、Settings から locale を切り替えられる状態を作る
3. shared helper と主要 UI surfaces を段階的に message 化する
4. formatter / toast / context menu などの周辺 UI を locale 対応する
5. `npm test` / `npm run typecheck` / `npm run build` と手動切替検証を通す

## Open Questions

- 初期リリースで `ja` / `en` 以外の locale を要求するかどうか（この change では `ja` / `en` 前提で設計）
