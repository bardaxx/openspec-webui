## Why

Dashboard、ChangeViewer、SpecViewer、Settings でカード風 UI がそれぞれ別のインライン class で実装されており、角丸・影・背景・ホバー・選択状態のトーンが揃っていない。`ui/card/` を共通基盤として導入済みの今、主要サーフェスを Card ベースへ寄せることで、見た目の一貫性と今後の UI 調整コストを下げる。

## What Changes

- Dashboard の summary cards、section containers、interactive item cards、planning context 内の card-like containers を共通 Card パターンへ寄せる
- ChangeViewer / SpecViewer の本文コンテナと spec delta コンテナを Card ベースの見た目へ統一する
- Settings の OptionCard と language Select の選択トーンを Card 系の背景・境界線トーンと整合させる
- 必要に応じて Card をラップする軽量 shared components を追加し、feature-local なインライン card class の重複を削減する
- ExplorerPane のプロジェクト名表示を InteractiveCard ベースに置き換え、下部に移動し、全体をクリッカブルにする
- ChangeViewer の spec delta を折りたたみ可能にし、spec タイトルで検索ダイアログを開けるようにする
- ChangeViewer のタブ並び順を思考順（Proposal → Design → Tasks → Specs）に固定する
- ChangeViewer のサブタブ選択を tabStore に永続化し、タブ切替後に復元できるようにする
- OptionCard を Card ラッパーから直接 label 要素に変更し（Card の gap-6/py-6 と衝突回避）、トーンを Card 系と統一する
- 非推奨 Lucide アイコン（`CheckSquare` → `CircleCheckBig`）を現行アイコンに置き換える
- AddProjectDialog のダイアログサイズとコンテナ余白を Card 系トーンと整合させる

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `shared-ui-parts`: Card ベースの共有サーフェス部品と利用方針を追加する
- `project-context`: Dashboard の各カードサーフェスが共通 Card パターンで表示される要件を明確化し、ExplorerPane の project selector 表示位置を下部に移動する要件を追加する
- `tabbed-viewer`: ChangeViewer / SpecViewer の主要コンテンツコンテナが共通 Card パターンで表示される要件を追加する
- `command-preferences`: Settings dialog の選択カードと listbox-style control の視覚トーンを Card パターンへ揃える要件を追加する

## Impact

- `frontend/src/lib/components/ui/card/` — 共通 Card 基盤の活用範囲を拡大
- `frontend/src/lib/views/Dashboard.svelte`
- `frontend/src/lib/views/ChangeViewer.svelte`
- `frontend/src/lib/views/SpecViewer.svelte`
- `frontend/src/lib/components/layout/SettingsModal.svelte`
- `frontend/src/lib/components/layout/ExplorerPane.svelte`
- `frontend/src/lib/components/layout/AddProjectDialog.svelte`
- `frontend/src/lib/components/shared/option-card/`
- `frontend/src/lib/components/shared/surface/` (new)
- `frontend/src/lib/state/tabs.svelte.ts`
- `openspec/specs/shared-ui-parts/spec.md`
- `openspec/specs/project-context/spec.md`
- `openspec/specs/tabbed-viewer/spec.md`
- `openspec/specs/command-preferences/spec.md`
