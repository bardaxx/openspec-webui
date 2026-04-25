## 1. Shared card foundation

- [x] 1.1 `ui/card/` の current API を確認し、必要なら薄い shared wrappers（例: section / interactive / surface variants）を追加する
- [x] 1.2 Card 系の共通 class ルール（bg-card, bg-background/70, primary/5 selection tone）を shared component 側へ集約する

## 2. Dashboard card unification

- [x] 2.1 Dashboard の summary cards 4件を Card ベースの共通 surface に置き換える
- [x] 2.2 Dashboard の section containers（Active Changes / Recent Activity / Planning Context）を Card ベースに置き換える
- [x] 2.3 Dashboard の active change cards、recent activity cards、planning context 内 card-like containers を共通 Card pattern に揃える

## 3. Viewer card unification

- [x] 3.1 `ChangeViewer.svelte` の primary content container を Card ベースへ置き換える
- [x] 3.2 `ChangeViewer.svelte` の spec delta cards を Card ベースへ置き換える
- [x] 3.3 `SpecViewer.svelte` の primary content container を Card ベースへ置き換える

## 4. Settings surface alignment

- [x] 4.1 `OptionCard` の未選択・選択・hover トーンを Card 系ルールと整合する形で整理する
- [x] 4.2 Settings の language Select trigger / popup / item states を Card 系ルールで整理する

## 5. Validation

- [x] 5.1 影響ファイルの見た目差分を確認し、Dashboard / Viewer / Settings の card surface に一貫性があることを確認する
- [x] 5.2 `frontend` で `npx svelte-check --threshold error` を実行し、エラー・警告なしを確認する

## 6. ExplorerPane 下部移動

- [x] 6.1 ExplorerPane の project selector を下部に移動し、InteractiveCard 化する

## 7. ChangeViewer enhancements

- [x] 7.1 ChangeViewer の spec delta cards を Collapsible で折りたたみ可能にする（初期状態: 折りたたみ済み、hover 無効化）
- [x] 7.2 各 delta ヘッダーに Search ボタンを追加し、spec タイトルで検索ダイアログを開けるようにする
- [x] 7.3 タブ並び順を GROUP_ORDER (Proposal → Design → Tasks → Specs) に固定する
- [x] 7.4 `tabStore.viewerStates` を追加し、ChangeViewer の UnderlineTabs 選択をタブ切替後に復元できるようにする

## 8. OptionCard fix

- [x] 8.1 OptionCard を Card ラッパーから直接 label 要素に変更（Card の py-6/gap-6 がレイアウトと衝突する問題を解消）

## 9. Icon modernization

- [x] 9.1 非推奨 Lucide アイコン `CheckSquare` を `CircleCheckBig` に置き換える（Dashboard、ChangeViewer）

## 10. Dialog sizing

- [x] 10.1 AddProjectDialog のダイアログサイズとコンテナ余白を調整し、Card 系トーンと整合させる
