## 背景

OpenSpec は、コマンドアダプタを持つツール向けには `/opsx:*` / `/opsx-*` を使い、コマンドアダプタを持たないツール向けには skill ベースの `/openspec-*` 呼び出しを使います。現在の WebUI は copy 用テキストとして 2 種類のコマンド形式しか生成できず、`/openspec-*` を必要とするツール利用者に対して適切な呼び出し文字列を提示できません。

また、skill format では各 workflow に対して正しい skill invocation を生成する必要があります。加えて、core commands（`propose`, `explore`, `apply`, `archive`）は常に表示されており、expanded commands と違って個別に表示制御できません。

## 変更内容

- command format selector を 2 択から 3 択（Standard / Claude Code / Skill）に拡張し、設定セクション名を `AI Tool` から `Workflow` に変更する
- skill format では bare `openspec-*` ではなく `/openspec-*` を生成する
- 各 workflow ID に対応する skill 名マッピングを追加する
- core commands（`propose`, `explore`, `apply`, `archive`）にも個別表示トグルを追加する
- `Default` 表記を `Standard` に変更する
- core commands が visibility 設定を尊重しつつ、CLI availability には依存せず表示可否だけで制御されるようにする

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `command-shortcuts`: skill-based `/openspec-*` 出力の追加、core command visibility filtering の追加
- `command-preferences`: format selector の 3 択化、core command visibility toggle の追加、セクション名とラベルの更新

## 影響範囲

- `frontend/src/lib/commandTypes.ts` — `CommandFormat`、統合 command IDs、settings labels の定義
- `frontend/src/lib/commandShortcuts.ts` — `/openspec-*` を含む command 文字列生成、skill 名マッピング、format support 判定、core visibility 判定
- `frontend/src/stores/commandPreferencesCore.ts` / `frontend/src/stores/commandPreferences.svelte.ts` — legacy preference migration、統合 `commandVisibility`、runtime availability state
- `frontend/src/components/SettingsModal.svelte` — `Workflow` セクションの 3 radio options、`Commands` セクションの core + expanded groups
- `frontend/src/components/CommandShortcutBar.svelte` — `buildCommand()` の新しい format 振る舞いへの追従
