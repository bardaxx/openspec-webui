## Context

現状の WebUI は、OpenSpec workflow 上では change-level artifact である `design.md` を、spec capability 配下のオプション文書としても扱っている。`src/parser/specs.ts` が `specs/<capability>/design.md` を読み取り、`Spec.designContent` / `SpecSummary.hasDesign` を通じて API・検索・SpecViewer・Explorer・Dashboard・context copy まで伝播している。一方でプロジェクト内の main specs には spec-level `design.md` は存在せず、OpenSpec skill / change artifact でも `design.md` は `changes/<name>/design.md` にのみ存在する前提で運用されている。

この二重モデルにより、Dashboard では spec を `Spec + design` / `Spec only` と説明し、Explorer では spec に Design badge を付け、Search では spec design hit を別名で扱っている。誤ったデータモデルが UI copy と翻訳キーにまで浸透しており、変更を続けるほど誤情報が増幅される。

## Goals / Non-Goals

**Goals:**
- spec-level `design.md` を表す型・パーサー・API・UI を削除し、データモデルを change-level `design.md` のみに統一する
- SpecViewer / Explorer / Search / Dashboard / context copy から spec-design 前提を取り除く
- OpenSpec specs を現行 workflow に合わせ、実装仕様と artifact schema の矛盾を解消する
- 誤訳の元になっている spec meta labels と関連文言を単純化する

**Non-Goals:**
- change-level `design.md` の artifact 自体を変更すること
- proposal / tasks / change viewer における design artifact の扱いを廃止すること
- Dashboard 全体の情報設計や Explorer 全体のレイアウトを再設計すること

## Decisions

1. **Spec model から design を完全に削除する**
   - `Spec.designContent` と `SpecSummary.hasDesign` を server / frontend の両方から削除する
   - `src/parser/specs.ts` は `spec.md` のみを canonical source とし、`lastModified` も spec file 基準に統一する
   - **Why**: spec-level design を「残しつつ非表示」にすると検索・API・copy の再混入リスクが残る
   - **Alternative**: parser は残して UI だけ隠す。誤モデルが API と内部 state に残るため不採用

2. **spec browsing UX は single-document 前提に戻す**
   - `SpecViewer.svelte` の Design sub-tab を削除し、Specification 単独表示にする
   - Explorer の spec 行から Design badge を削除する
   - Dashboard recent activity / spec meta から `Spec + design` / `Spec only` を削除し、spec を単純な spec item として扱う
   - **Why**: UI が spec-level design existence を示し続けると、実際の OpenSpec schema と反する説明が再生成され続ける
   - **Alternative**: Design tab を disabled 状態で残す。存在しない artifact を示す UI は誤誘導になるため不採用

3. **search / context copy も spec-only semantics に合わせる**
   - 検索インデックスから spec design content と `(design)` suffix 処理を削除する
   - SpecViewer の quote copy context は常に `Specification` を使う
   - **Why**: parser だけ消しても search label や copy context が残ると、仕様誤認が別導線で継続する
   - **Alternative**: suffix だけ削除して内部検索対象は残す。見えない artifact が検索にだけ出る状態になり不整合なため不採用

4. **change-level design は現状維持する**
   - `Change.design`, active change badge, change artifact grouping (`proposal/tasks/design`) は変更しない
   - **Why**: 今回の問題は spec-level design との混同であり、change-level design は workflow と実装が一致している
   - **Alternative**: `design` という語自体を全面的に避ける。正しい change artifact まで壊すため不採用

## Risks / Trade-offs

- **spec-level design を使う隠れファイルがもし存在した場合、表示されなくなる** → 現状 main specs に存在しないことは確認済み。必要なら change artifact へ移す
- **型削除により frontend / tests の修正範囲が広い** → server types → API route → frontend types → UI helpers → tests の順で機械的に整理する
- **Dashboard の meta 文言変更で recent activity の見た目が変わる** → spec item は date + badge の情報が残るため、誤情報除去を優先する
- **過去 archive specs には design 前提の記述が残る** → archive は履歴として保持し、main specs と新 change で現在の正しい contract を示す

## Migration Plan

1. OpenSpec delta specs で spec-level design requirement を削除・置換する
2. parser / shared types / API から spec design field を削除する
3. SpecViewer / Explorer / Dashboard / search / context-copy / uiText / i18n の design-specific 分岐を削除する
4. tests と fixtures を spec-only 前提に更新する
5. build / typecheck / targeted tests で `hasDesign` / `designContent` の残存がないことを確認する

Rollback が必要な場合は、この change を revert すれば spec-level design support を復元できる。ただし rollback は誤った data model への回帰なので、必要時はまず実データに spec-level design file が存在するか再確認する。

## Open Questions

- Dashboard の spec recent activity meta は空文字にするか、`Updated <date>` 等の別表現へ置き換えるか。現時点では誤情報除去を優先し、実装時に最小で自然な表現を選ぶ
- `search/spec.md` を change proposal のみ対象に留めるか、change `design.md` / `tasks.md` も今後 searchable source に含めるか。これは今回の scope 外
