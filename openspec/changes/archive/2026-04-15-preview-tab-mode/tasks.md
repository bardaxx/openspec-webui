## 1. Tab Store — Preview ロジック追加

- [x] 1.1 `Tab` インターフェースに `preview?: boolean` を追加する
- [x] 1.2 `createTabForPath()` は `preview` を付与しないままにする（`undefined` = 確定タブ）
- [x] 1.3 `openPreview(path)` メソッドを実装する — 既存確定タブがあればフォーカス、preview タブがあればそのタブの内容（`id`/`type`/`name`/`path`）を差し替えて active のまま再利用し、なければ新規作成（`preview: true`）
- [x] 1.4 `pin()` メソッドで pinned 化時に `preview: false` にリセットするよう修正
- [x] 1.5 `confirmTab(tabId)` メソッドを追加 — preview フラグを false にする（TabBar のダブルクリック用）
- [x] 1.6 Explorer の confirmed open 用に `openConfirmed(path)` ヘルパーを追加する
- [x] 1.7 preview タブを一括で確定化するヘルパーを追加し、設定OFF時に使えるようにする

## 2. Explorer Pane — 即時 preview / confirmed open 導線

- [x] 2.1 `openItemPreview()` ヘルパーを追加する
- [x] 2.2 `openItemConfirmed()` ヘルパーを追加し、confirmed open flow を共通化する
- [x] 2.3 Preview mode ON 時、各アイテムボタン（change / archived change / spec）の single-click で即座に preview を開く
- [x] 2.4 Preview mode ON 時、Ctrl+Click / Cmd+Click で confirmed open を行う
- [x] 2.5 各アイテムのコンテキストメニューに "Open in New Tab" を追加し、confirmed open を行う

## 3. TabBar — Preview 視覚表現

- [x] 3.1 preview タブの名前に `italic` クラスを追加する条件分岐を追加
- [x] 3.2 preview タブの Tooltip/aria-label に "Preview" を含める
- [x] 3.3 TabBar のタブダブルクリックで `confirmTab()` を呼ぶハンドラを追加
- [x] 3.4 コンテキストメニューの "Pin" 選択時に preview タブが確定タブになるよう、更新後の `pin()` ロジックへ追従させる

## 4. Settings Dialog — Preview mode toggle

- [x] 4.1 preview mode 設定を保存する store を追加する（default ON, localStorage 永続化）
- [x] 4.2 Settings dialog の General セクションに preview mode ON/OFF トグルを追加する
- [x] 4.3 preview mode OFF 時は Explorer Pane の single-click が確定タブ open になるよう配線する
- [x] 4.4 preview mode OFF に切り替えた時点で既存 preview タブが確定タブ化されるようにする
- [x] 4.5 Settings の説明文を Ctrl+Click / Cmd+Click / コンテキストメニュー導線に更新する

## 5. 動作確認

- [x] 5.1 シングルクリック → preview タブが開く（イタリック表示）
- [x] 5.2 別アイテムをシングルクリック → 既存 preview タブが差し替わる
- [x] 5.3 Ctrl+Click / Cmd+Click → 確定タブとして開く（通常表示）
- [x] 5.4 Explorer コンテキストメニューの "Open in New Tab" → 確定タブとして開く
- [x] 5.5 既存確定タブと同じアイテムをシングルクリック → フォーカスのみ
- [x] 5.6 Preview タブを右クリック → Pin → 確定タブ化
- [x] 5.7 Home タブがプレビューで上書きされないことを確認
- [x] 5.8 Settings dialog の preview mode toggle が default ON / OFF 永続化になることを確認
- [x] 5.9 preview mode OFF 時の single-click が confirmed open になることを確認
- [x] 5.10 `scripts/test-tabbar-ui.mjs` を preview open / reuse / Ctrl+Click・Cmd+Click confirm / context menu confirm / TabBar double-click confirm / settings toggle シナリオに更新する
