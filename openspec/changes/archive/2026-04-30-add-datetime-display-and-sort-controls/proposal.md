## Why

Explorer Pane と Dashboard では日付表示が日付止まりの箇所と日時を持てるデータが混在しており、同日に複数の更新やアーカイブが発生すると Recent Activity や各セクションの並び順が不自然になる。加えて、locale-aware な日時表示は言語ごとに表記順と文字列長が変わるため、時刻追加後の UI overflow を招きやすく、対応言語が増えるほど日時フォーマットの仕様管理と検証コストが増える。OpenSpec CLI や archive workflow の生成物は変更せず、既存の `lastModified` を共通基準に寄せたうえで、表示は世界共通の canonical format `YYYY-MM-DD HH:mm` に統一し、Explorer Pane から日付順・名前順を切り替えられるようにして操作性を揃える必要がある。

## What Changes

- 全体の日時表示を locale 非依存の canonical `YYYY-MM-DD HH:mm` に統一し、specs / active changes / archived changes / Dashboard Recent Activity / viewer header で時刻まで表示する
- archived changes の表示・ソート・Dashboard Recent Activity では `archivedDate` ではなく change の `lastModified` を使用し、active changes と同じ更新日時基準へ揃える
- Explorer Pane の ACTIVE CHANGES / ARCHIVE / SPECS 各セクションヘッダーに `Date` / `Name` の並び替え UI を追加する
- デフォルト順序は、ACTIVE CHANGES と ARCHIVE が日時の降順、SPECS が名前順、Dashboard Recent Activity が日時の降順とする
- ARCHIVE の `Name` ソートは表示上の日付プレフィックスを除去した change 名 (`formatChangeName`) を基準にする

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `explorer-pane`: セクションヘッダーに並び替え切り替え UI を追加し、各リストを日付順・名前順で再配置できるようにする
- `change-browsing`: active / archived change の既定順と archive のソート基準を `lastModified` ベースへ更新する
- `spec-browsing`: spec list / viewer の日時表示を canonical `YYYY-MM-DD HH:mm` へ統一し、SPECS セクションの並び替え挙動を追加する
- `project-context`: Dashboard Recent Activity の日時表示と archived item の時系列基準を `lastModified` に揃える
- `ui-localization`: locale switching は application chrome と document semantics に限定し、共有日時表示は locale に依存しない canonical format を使う

## Impact

- `frontend/src/lib/utils.ts` / `frontend/src/lib/utils.test.ts`: 共通日時フォーマットを canonical `YYYY-MM-DD HH:mm` へ更新
- `frontend/src/lib/views/Dashboard.svelte`: Recent Activity の日時表示・ソート基準更新
- `frontend/src/lib/views/SpecViewer.svelte` / `frontend/src/lib/views/ChangeViewer.svelte`: ヘッダー補助情報の日時表示統一
- `frontend/src/lib/components/shared/explorer-section/*.svelte`: 各セクションの並び替え UI と表示順制御
- `frontend/src/lib/components/layout/ExplorerPane.svelte`: Explorer section への sort state 受け渡し
- `src/parser/changes.ts`: archived change の初期ソート基準を `lastModified` に揃える可能性がある
- `openspec/specs/explorer-pane/spec.md`, `openspec/specs/change-browsing/spec.md`, `openspec/specs/spec-browsing/spec.md`, `openspec/specs/project-context/spec.md`, `openspec/specs/ui-localization/spec.md`: 要件更新
