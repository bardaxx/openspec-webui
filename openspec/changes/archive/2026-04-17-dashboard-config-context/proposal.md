## Why

現在の Dashboard は OpenSpec の planning に実際に使われる `openspec/config.yaml` ではなく、旧来の `openspec/project.md` を主要な project context として扱っています。これにより、`config.yaml` は存在していても中身が初期値のままで、実際の文脈が `project.md` にだけ残っている手動移行中の状態を利用者に正しく伝えられていません。

## What Changes

- `openspec/config.yaml` から planning context を読み取り、`AI Context`、`Artifact Rules`、`Workflow Schema` に分けて公開する。
- Dashboard の `project.md` 中心の documentation 表示を、OpenSpec planning の参照元が `config.yaml` だと明示する単一の planning-context ブロックに置き換える。
- `project.md` は非推奨の legacy 情報として折りたたみ表示し、missing-file warning ではなく migration を促す文言を表示する。
- `config.yaml` が変更されたときに project-scoped UI を refresh し、Dashboard の表示を planning context と同期させる。

## Capabilities

### New Capabilities
- なし。

### Modified Capabilities
- `project-context`: `project.md` フォールバック文言中心の project context 表示を、`config.yaml` 駆動の planning context 表示と legacy `project.md` 開示に変更する。
- `live-refresh`: `openspec/config.yaml` の変更を、active session 向けの project refresh event として扱う。

## Impact

- project parser と dashboard context 用 API response shape
- Dashboard UI のレイアウトと migration messaging
- project-scoped refresh のための file watcher
- project-context 関連のテストと fixture
