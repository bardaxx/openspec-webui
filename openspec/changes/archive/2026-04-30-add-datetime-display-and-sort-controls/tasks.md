## 1. 共通日時表示の更新

- [x] 1.1 `frontend/src/lib/utils.ts` の `formatDate` を locale-aware な日時表示へ拡張し、既存テスト期待値を更新する
- [x] 1.2 `Dashboard.svelte` / `SpecViewer.svelte` / `ChangeViewer.svelte` / Explorer section 各所で日時表示が統一されるよう `formatDate` 呼び出しを整理する
- [x] 1.3 archived change の表示と Dashboard Recent Activity が `archivedDate` ではなく `lastModified` を日時表示に使うよう更新する

## 2. Explorer Pane の sort control 追加

- [x] 2.1 `ExplorerPane.svelte` に ACTIVE CHANGES / ARCHIVE / SPECS 用の sort mode state を追加し、既定値を active/archive=date desc, specs=name asc に設定する
- [x] 2.2 `ExplorerSection` の headerExtra を利用して、各セクション header に `Date` / `Name` 切り替え UI を追加する
- [x] 2.3 `active-changes-explorer-section.svelte` で `Date` / `Name` 切り替えに応じた再ソートを実装する
- [x] 2.4 `archive-explorer-section.svelte` で `Date` / `Name` 切り替えに応じた再ソートを実装し、`Name` ソートは `formatChangeName(change.name)` をキーにする
- [x] 2.5 `specs-explorer-section.svelte` で `Name` / `Date` 切り替えに応じた再ソートを実装する

## 3. Dashboard Recent Activity の並び順統一

- [x] 3.1 `Dashboard.svelte` の recent activity sort key を archived item も含めて `lastModified` ベースに統一する
- [x] 3.2 Dashboard の recent activity metadata 表示が全 item 種別で日時表示になるよう調整する

## 4. 補助ロジックとデフォルト順の整合

- [x] 4.1 必要に応じて `src/parser/changes.ts` の archived 初期 sort を `lastModified` ベースへ揃えるか、フロント表示順に依存する設計であることを確認する
- [x] 4.2 ARCHIVE の表示名トリムと name sort key が一致することをテストまたは補助関数で担保する
- [x] 4.3 日時文字列の増加による Explorer item / Dashboard card のレイアウト崩れがないよう微調整する

## 5. 検証

- [x] 5.1 `frontend/src/lib/utils.test.ts` と関連 unit test を更新し、日時フォーマットと sort 補助ロジックを検証する
- [x] 5.2 Explorer Pane の各セクションで既定順と `Date` / `Name` 切り替えが仕様どおり動作することを確認する
- [x] 5.3 Dashboard Recent Activity が日時降順で表示され、archived item も `lastModified` ベースで自然に並ぶことを確認する

## 6. Canonical datetime format revision

- [x] 6.1 `proposal.md` / `design.md` と change spec delta を更新し、`ui-localization` も含めて shared datetime を canonical `YYYY-MM-DD HH:mm` 方針へ切り替える
- [x] 6.2 `frontend/src/lib/utils.ts` / `frontend/src/lib/utils.test.ts` の `formatDate` を locale 非依存の canonical formatter へ変更する
- [x] 6.3 `ExplorerSectionItem` / `SpecViewer` など日時表示が長くなる UI で overflow を防ぐレイアウト調整を行う
- [x] 6.4 関連表示とテストを再確認し、locale 切り替えに関係なく同じ日時文字列が表示されることを検証する
