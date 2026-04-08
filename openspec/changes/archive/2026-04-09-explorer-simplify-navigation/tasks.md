## 1. 展開ボタン削除とトグル挙動

- [x] 1.1 `AppLayout.svelte` の Explorer 縮小時の ChevronRight 展開ボタンを削除し、未使用の `ChevronRight` import を削除
- [x] 1.2 `ActivityBar.svelte` の `openPreset` を「Explorer 展開中のアクティブセクション再クリック時のみトグル」に修正
- [x] 1.3 `ActivityBar.svelte` / `layout.svelte.ts` で active section を `activityPreset` ベースに見直し、タブ非生成時もハイライト/トグルが成立するようにする

## 2. Home タブの pinned 化

- [x] 2.1 `tabs.svelte.ts` の `HOME_TAB` 定数で `pinned: true` に変更し、初期化時に常に Home タブを含める
- [x] 2.2 タブバーコンポーネントで pinned タブに閉じるボタンが表示されないことを確認
- [x] 2.3 `TabBar.svelte` と `tabs.svelte.ts` で Home タブを unpin 不可にする

## 3. ActivityBar クリック時のタブ制御変更

- [x] 3.1 `ActivityBar.svelte` の Home 用 `openPreset('home', '/')` を `tabStore.focus('/')` に変更（`tabStore.open` ではなく）
- [x] 3.2 `ActivityBar.svelte` の Changes/Specs 用 `openPreset` から `tabStore.open(path)` を削除し、Explorer 展開＋セクションフォーカスのみに変更

## 4. ExplorerPane 最大幅変更

- [x] 4.1 `layout.svelte.ts` の ExplorerPane 最大幅定数を `600` に変更
- [x] 4.2 `AppLayout.svelte` の `getExplorerMaxWidth` と `Resizable.Panel` の `maxSize` prop に 600px を反映

## 5. ExplorerPane アイコン移動

- [x] 5.1 各セクションヘッダーのタイトルテキスト横にアイコン（SquarePen / Archive / FileText）を追加
- [x] 5.2 各リストアイテムの 32x32 アイコンボックス（h-8 w-8 div）を3セクション全てから削除

## 6. 検証

- [x] 6.1 `npm run typecheck` で TypeScript エラーがないことを確認
- [x] 6.2 `npm run build` で production build が成功することを確認
- [x] 6.3 Home タブが pinned で閉じるボタンが表示されないことを CDP 検証で確認
- [x] 6.4 Home タブが unpin できないことを CDP 検証で確認
- [x] 6.5 ActivityBar Home クリックで Home タブにフォーカスすることを CDP 検証で確認
- [x] 6.6 ActivityBar Changes/Specs クリックでタブが開かれないことを CDP 検証で確認
- [x] 6.7 アクティブボタン再クリックで Explorer がトグルすることを CDP 検証で確認
