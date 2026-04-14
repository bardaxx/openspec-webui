## Why

現在、Explorer Pane のアイテムをクリックすると常に新しいタブが追加される。素早く複数のアイテムを覗き見たい場合、タブが無駄に増殖してしまう。Preview Tab の UX を導入し、タブの乱雑さを防ぎつつ、目的のファイルをすばやく見つけられるようにする。同時に、single-click の反応速度を落とさないため、Explorer 上の確定タブ操作は double-click ではなく Ctrl+Click / Cmd+Click とコンテキストメニューへ置き換える。

## What Changes

- `Tab` インターフェースに `preview` フラグを追加
- Tab Store に `openPreview(path)` メソッドを追加
  - 既存の確定タブ（同一 path）があればフォーカスのみ
  - 既存の preview タブがあれば内容を差し替え
  - なければ新規に preview タブを作成
- Pinned タブ（Home 含む）は preview の置き換え対象外（保護）
- Preview mode 有効時、Explorer Pane のシングルクリックは即座に preview タブを開く
- Preview mode 有効時、Explorer Pane の Ctrl+Click / Cmd+Click とコンテキストメニューの "Open in New Tab" は確定タブ（`preview: false`）として開く
- TabBar で preview タブをイタリック体で表示し視覚的に区別
- Preview タブは既存の Pin 操作または TabBar 上のダブルクリックで確定できる
- Settings dialog に preview tab mode の ON/OFF 設定を追加し、デフォルト ON・永続化ありにする

## Capabilities

### New Capabilities

（なし — 既存の `tabbed-viewer` の拡張として実装）

### Modified Capabilities

- `tabbed-viewer`: preview タブモードの要件を追加。タブ管理ストアの操作（openPreview）、TabBar の視覚表現、Explorer Pane のクリック判定を拡張。
- `command-preferences`: Settings dialog から preview tab mode を有効/無効にできるよう拡張。

## Impact

- `frontend/src/stores/tabs.svelte.ts` — `preview` フラグ、`openPreview()` ロジック
- `frontend/src/components/layout/ExplorerPane.svelte` — シングルクリック preview / Ctrl+Click・Cmd+Click confirmed / コンテキストメニュー confirmed
- `frontend/src/components/layout/TabBar.svelte` — preview タブのイタリック表示、aria/tooltip 表示、TabBar 上のダブルクリック確定フロー
- `frontend/src/components/SettingsModal.svelte` — preview mode toggle UI
- `frontend/src/stores/uiPreferences.svelte.ts` — preview mode 設定の永続化
