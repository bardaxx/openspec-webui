## Data flow

1. 呼び出し側が `layoutStore.openOverlay('search', { initialQuery: 'spec-name' })` を呼ぶ
2. `layoutStore` は `overlay = 'search'` と `searchInitialQuery = 'spec-name'` を設定
3. `SearchDialog` の `$effect` が `open` 変化を検知し、`layoutStore.searchInitialQuery` を読み取る
4. 初期クエリがあれば `searchQuery.value` にセットし、`search()` API を即座に呼ぶ
5. ダイアログが検索結果付きで表示される

## Context menu structure

```
Active Changes item → right-click
  └ Copy Name → clipboard

Archive item → right-click
  └ Copy Name → clipboard

Specs item → right-click
  ├ Copy Name → clipboard
  └ Search Related Changes → openOverlay('search', { initialQuery: spec.name })
```

## SpecViewer button

Dashboard のタイトル横ボタン（FolderPen）と同じスタイル:
- `<Button variant="ghost" size="icon" class="ml-auto size-7 shrink-0 text-muted-foreground hover:text-foreground">`
- `<Search>` アイコンのみ、テキストなし
- `<h1>` タイトルの右端に配置
