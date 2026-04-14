## Context

現在のタブシステム (`tabs.svelte.ts`) は `upsertTab` ベースで、Explorer Pane のクリックは常に `tabStore.open()` を呼ぶ。これにより毎回新しいタブが追加され、タブが増殖しやすい。

VSCode の Preview Tab パターンを導入する：
- **シングルクリック** → プレビュータブ（同一タブを流用）
- **Ctrl+Click / Cmd+Click / コンテキストメニュー** → 確定タブ（通常タブとして開く）

### 現状の制約
- `Tab` インターフェース: `{ id, type, name, path, pinned? }`
- `upsertTab()`: 同一 path が既にあればフォーカス、なければ新規追加
- Dashboard/Home タブは常に `pinned: true`
- Explorer Pane: `<button onclick={...}>` のみ、ダブルクリック判定なし

## Goals / Non-Goals

**Goals:**
- シングルクリックでプレビュータブを再利用し、タブ増殖を防ぐ
- Explorer の single-click に遅延を入れずに preview を開く
- Ctrl+Click / Cmd+Click またはコンテキストメニューから確定タブを開く
- Preview タブをイタリックで視覚的に区別
- Pinned タブ（Home 含む）はプレビュー対象外として保護
- 既存の確定タブと同じ path の場合はフォーカスのみ（プレビューを作らない）
- Settings dialog から preview tab mode を無効化でき、設定はブラウザに永続化される

**Non-Goals:**
- エディタの差分プレビュー機能（これは仕様/変更の閲覧UIでありテキストエディタではない）
- タブの分割表示（split view）
- ワークスペースをまたぐタブ状態の永続化

## Decisions

### D1: `preview` フラグを Tab インターフェースに追加

`Tab` に `preview?: boolean` を追加。これが最もシンプルで既存コードへの影響が少ない。

**代替案**: 別の `previewTabId` state を持つ → タブとプレビューの同期が複雑になる。却下。

### D2: `openPreview(path)` を tabStore に追加

新しいメソッドで、以下のロジックを実行：
1. 同一 path の確定タブ（`preview !== true`）が存在 → フォーカスのみ
2. 既存の preview タブが存在 → そのタブの内容（`id`, `type`, `name`, `path`）を path に差し替え、そのタブを active のまま再利用
3. 上記いずれもなし → 新規タブを `preview: true` で追加

**代替案**: `upsertTab` にオプション引数を追加 → 既存の `open()` 呼び出しに影響する恐れがある。独立メソッドの方が安全。

### D3: Pinned タブはプレビュー差し替えから保護

preview タブの差し替えロジックは `!tab.pinned` のタブのみ対象。これにより Home/Dashboard やユーザーが Pin したタブは上書きされない。

### D4: Explorer のシングルクリックは即時 preview、確定タブは Ctrl+Click / Cmd+Click / コンテキストメニューで開く

Explorer Pane の item button は preview mode ON のとき、通常 click で即座に `openPreview()` を呼ぶ。Ctrl+Click と Cmd+Click は確定タブの open flow を呼ぶ。行のコンテキストメニューには "Open in New Tab" を追加し、同じ確定タブ flow を提供する。これにより double-click 判定待ちをなくし、single-click の反応を保つ。

### D5: Preview タブの確定（Keep Open）

以下の操作で preview タブが確定タブになる：
- Explorer Pane の Ctrl+Click / Cmd+Click で同一 item を開いた場合
- Explorer Pane のコンテキストメニューで "Open in New Tab" を選んだ場合
- Preview タブをコンテキストメニューで Pin した場合
- TabBar 上の preview タブをダブルクリックした場合

Explorer Pane の確定タブ flow は、対象 path が既存 preview タブならそのタブを確定し、それ以外は通常の confirmed tab open/focus にフォールバックする。

### D6: 視覚的区別 — イタリック + ツールチップ

TabBar で `preview: true` のタブは `italic` スタイルを適用。Tooltip で "Preview" と表示。

### D7: Preview mode は Settings dialog で切り替える

`uiPreferences` 系の localStorage 永続化ストアを追加し、`previewTabsEnabled` を保持する。デフォルト値は `true`。Explorer Pane はこの設定が ON のときだけ single-click を preview として扱い、Ctrl+Click / Cmd+Click / コンテキストメニューから confirmed open を提供する。OFF のときは single-click を通常の確定タブ open として扱う。OFF に切り替えた時点で既存 preview タブは確定タブへ変換する。

## Risks / Trade-offs

- **[発見可能性]** Ctrl+Click / Cmd+Click / コンテキストメニューは double-click より明示的だが、初見では見つけにくい可能性がある → Settings の説明文とコンテキストメニュー項目で補う
- **[既存動作の変更]** Explorer Pane のクリック挙動が変わる → `openPreview` は `upsertTab` と同等のフォーカス動作を含むため、既存のユースケースは壊れない
- **[タブの意図しない消失]** preview タブは次のシングルクリックで上書きされる → これが目的の挙動だが、ユーザーが戸惑う可能性あり。イタリック表示で十分に伝達する
