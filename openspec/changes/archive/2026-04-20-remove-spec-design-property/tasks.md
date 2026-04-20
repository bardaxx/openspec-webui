## 1. OpenSpec contract cleanup

- [x] 1.1 `openspec/specs/spec-browsing/spec.md` を更新し、spec-level design requirement を削除して spec-only 表示に置き換える
- [x] 1.2 `openspec/specs/explorer-pane/spec.md` を更新し、SPECS section から Design badge 前提を削除する
- [x] 1.3 `openspec/specs/search/spec.md` を更新し、spec design markdown と `(design)` result 前提を削除する
- [x] 1.4 `openspec/specs/context-copy/spec.md` を更新し、SpecViewer Design tab の context menu / quote copy 前提を削除する

## 2. Server-side spec model cleanup

- [x] 2.1 `src/shared/types.ts` から `Spec.designContent` を削除し、spec-related comments / types を spec-only 前提に更新する
- [x] 2.2 `src/parser/specs.ts` から `specs/<capability>/design.md` 読み取りと関連 `lastModified` 処理を削除する
- [x] 2.3 `src/parser/index.ts` から spec design content の検索インデックス登録と `(design)` result 生成を削除する
- [x] 2.4 `src/server/routes/api.ts` から spec summary の `hasDesign` を削除する

## 3. Frontend spec surface cleanup

- [x] 3.1 `frontend/src/lib/types/api.ts` から `Spec.designContent` と `SpecSummary.hasDesign` を削除する
- [x] 3.2 `frontend/src/lib/views/SpecViewer.svelte` を spec-only 表示へ更新し、Design sub-tab と関連 state を削除する
- [x] 3.3 `frontend/src/lib/components/shared/explorer-section/specs-explorer-section.svelte` から Design badge を削除する
- [x] 3.4 `frontend/src/lib/views/Dashboard.svelte` と `frontend/src/lib/uiText.ts` を更新し、spec meta の `Spec + design` / `Spec only` 表示を削除する
- [x] 3.5 `frontend/src/lib/contextCopy.ts` と `frontend/src/lib/components/layout/SearchDialog.svelte` を更新し、Design tab / `(design)` suffix 前提を削除する

## 4. Verification

- [x] 4.1 design-related spec tests / mocks（例: `frontend/src/lib/contextCopy.test.ts`, `frontend/src/lib/commandShortcuts.test.ts`, parser tests）を spec-only contract に更新する
- [x] 4.2 `hasDesign`, `designContent`, spec-level `design.md` 前提の参照が runtime code に残っていないことを確認する
- [x] 4.3 `npm run build` と関連 typecheck / test を実行し、change-level design artifact の表示は維持されたまま spec-level design support だけが削除されたことを確認する
