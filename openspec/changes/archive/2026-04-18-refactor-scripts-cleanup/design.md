## Context

`scripts/` は開発専用ディレクトリであり、npm publish では公開されない（`package.json` の `files` フィールドが `bin/`, `dist/`, `dist-frontend/` に限定されている）。現在 12 ファイル + 空ディレクトリが存在するが、実際に使われているのは `dev.mjs` 経由の `npm run dev` のみ。残りは GPT との開発セッションで生成された未使用スクリプト。

`bin/openspec-webui.js` が 2 行のエントリーポイント（`import '../dist/cli/index.js'`）であり、npm ユーザーはこれを経由して利用する。`scripts/` は純粋に開発者体験の問題。

## Goals / Non-Goals

**Goals:**
- `scripts/` を実際の利用に合わせて最小構成にする
- `package.json` scripts を user-facing な 4 コマンドへ整理する
- E2E テストスクリプトを AI 用の隔離場所へ整理する
- 起動時の project 選択ルールを CWD ベースに単純化する
- README を npm パッケージユーザー向けに書き直す

**Non-Goals:**
- `dev.mjs`, `dev-utils.mjs`, `run-local-bin.mjs` の大規模な再設計
- E2E テストスクリプトの内容改善や CDP 共通化
- E2E スクリプトの人間向けドキュメント整備
- CI/CD パイプラインの構築
- npm publish ワークフローの自動化（version bump 等）

## Decisions

### D1: 削除対象の選定基準

**決定**: 利用実績のないスクリプトを全て削除。

**対象**:
| スクリプト | 理由 |
|---|---|
| `debug.mjs` | `dev.mjs` と 95% 同一。sourcemap + inspector の差分のみ。今後必要になれば `dev.mjs` に `--debug` フラグで追加 |
| `run-dev-server.mjs` | `dev.mjs` の server 部分だけの単独起動。使用実績なし |
| `run-dev-frontend.mjs` | `dev.mjs` の frontend 部分だけの単独起動。使用実績なし |
| `start.mjs` | `npm start` 用だが、bin エントリーポイントがあるため不要 |
| `release.mjs` | `build` + 起動。`npm run build` → `npm publish` で代替 |
| `doctor-dev.mjs` | 環境診断。`npm install` が通れば不要 |
| `browser-verify/` | 空ディレクトリ。旧変更の残骸 |

**代替案検討**: `start.mjs` を残す（`npm start` の慣例）。→ bin エントリーポイントが既にあるため不要。

### D2: E2E スクリプトの移動先

**決定**: `scripts/e2e/` に移動。

**理由**: `scripts/` 直下に AI が E2E 用スクリプトを無秩序に増やすと管理しにくい。`scripts/e2e/` に隔離することで、「AI 用のテストスクリプト置き場」であることを明確にする。

### D3: 残すスクリプトの役割

| ファイル | 役割 | 依存される npm script |
|---|---|---|
| `dev.mjs` | dev モード起動 (server + frontend watch) | `dev` |
| `dev-utils.mjs` | 共通ユーティリティ | `dev.mjs`, `run-local-bin.mjs` |
| `dev-utils.test.mjs` | dev-utils のテスト | `test:unit` |
| `run-local-bin.mjs` | CWD 保証付き bin ランナー | `build:server`, `build:frontend`, `typecheck:server`, `typecheck:frontend` |

### D4: package.json scripts の最終構成

```
dev                  ← node ./scripts/dev.mjs
build                ← node ./scripts/run-local-bin.mjs tsc && vite build ...
test                 ← node --import tsx --test (テストファイル群)
typecheck            ← node ./scripts/run-local-bin.mjs tsc --noEmit && svelte-check ...
prepublishOnly       ← npm run build
```

**補足**: user-facing な command surface は `dev`, `build`, `test`, `typecheck` の 4 つに限定し、`prepublishOnly` は npm lifecycle hook として残す。

削除する scripts: `debug`, `dev:server`, `dev:frontend`, `doctor`, `doctor:dev`, `setup`, `setup:dev`, `release`, `start`, `test:ui:tabbar`, `build:server`, `build:frontend`, `test:unit`, `typecheck:server`, `typecheck:frontend`

### D5: README の構成

**決定**: ユーザー向け（インストール〜利用）を上部に、開発者向けを下部に配置。

```
# openspec-webui
## インストール → 利用方法 → CLI オプション
## 開発（Contributing）→ npm run dev / build / test
```

## Risks / Trade-offs

- **[低リスク] debug.mjs 削除 → 将来デバッグが必要になったら `dev.mjs` に `--debug` フラグを追加すれば復元可能**
- **[低リスク] start.mjs 削除 → `npm start` が動かなくなるが、bin エントリーポイント（`npx openspec-webui`）が代替。`package.json` から `start` script を削除**
- **[低リスク] E2E スクリプトの移動 → `test:ui:tabbar` のパス更新が必要。これは npm script ごと削除するため影響なし**

### D6: 起動時の初期 project 選択

**決定**: `OPENSPEC_INITIAL_PROJECT` は廃止し、起動時は CWD が valid な OpenSpec project の場合だけ自動 bootstrap する。

**理由**:
- 特殊な環境変数ルールを README / テスト / AI の運用文脈に持ち込みたくない
- `npm run dev` では child process の CWD が repo root になるため、開発体験は維持される
- non-project directory から起動したときは、静かに server を起動して UI で project を選べばよい

**補足**:
- wrapper script は project path を環境変数へ変換しない
- invalid な CWD は warning を出さずに無視し、起動自体は継続する
