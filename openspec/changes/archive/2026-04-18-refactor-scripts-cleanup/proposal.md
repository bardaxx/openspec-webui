## Why

`scripts/` ディレクトリに GPT との開発セッション中に生成された多数のスクリプトが蓄積しており、大部分が未使用・未理解の状態。npm パッケージとしての公開に向け、開発体験を最小限に整理し README をユーザー向けに書き直す。

加えて、`OPENSPEC_INITIAL_PROJECT` による特殊な起動ルールは、マルチプロジェクト前提の運用や AI の README / テスト挙動と相性が悪い。起動時の初期 project 選択は、現在の作業ディレクトリ（CWD: Current Working Directory）が OpenSpec project である場合だけ自動投入し、それ以外は UI から選ぶシンプルな挙動へ統一する。

## What Changes

- **削除**: `debug.mjs`, `run-dev-server.mjs`, `run-dev-frontend.mjs`, `start.mjs`, `release.mjs`, `doctor-dev.mjs` — 使われていない GPT 生成スクリプト
- **削除**: `browser-verify/` (空ディレクトリ)
- **移動**: `verify-ui.mjs`, `test-tabbar-ui.mjs` → `scripts/e2e/` — AI がテスト用スクリプトを root に散らかさないための隔離先として整理
- **残す**: `dev.mjs`, `dev-utils.mjs`, `dev-utils.test.mjs`, `run-local-bin.mjs`
- **更新**: `package.json` の user-facing scripts を `dev`, `build`, `test`, `typecheck` に整理し、補助 alias を削除
- **削除**: `OPENSPEC_INITIAL_PROJECT` に依存した起動ルールと wrapper 側の project 引数変換
- **更新**: 起動時は CWD が valid な OpenSpec project のときだけ自動 bootstrap し、それ以外は UI から project を選択
- **更新**: `README.md` を npm パッケージユーザー向けに書き直し

## Capabilities

### New Capabilities

なし

### Modified Capabilities

- `cli-runtime`: `package.json` scripts の削減と起動ルールの単純化により CLI 開発フローが簡素化される
- `project-registry`: 起動時の初期 project 選択が CWD ベースに統一される

## Impact

- `scripts/` ディレクトリ: 12 ファイル → 4 ファイル + `e2e/` サブディレクトリ
- `package.json` scripts: user-facing 4 commands + `prepublishOnly` hook のみ
- 起動時の初期 project 選択: `OPENSPEC_INITIAL_PROJECT` 依存を廃止し、CWD が有効な OpenSpec project のときだけ自動投入
- `README.md`: 開発者向け → ユーザー + 開発者の二層構造に書き直し
- 既存の `npm run dev`, `npm run build`, `npm run test`, `npm run typecheck` は変更なし
