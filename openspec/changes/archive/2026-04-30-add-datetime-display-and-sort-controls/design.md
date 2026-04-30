## Context

現在の日時表示は `formatDate` に集約されている一方、archived change だけはアーカイブ名由来の `archivedDate` を表示・ソートに使っており、active change や spec が使う `lastModified` と意味が揃っていない。さらに `formatDate` は active locale に応じて表記順と文字列長が変わるため、時刻追加後は Explorer item や viewer subtitle で overflow を起こしやすく、将来的に対応 locale が増えるほど date formatting の仕様判断と QA コストが膨らむ。Explorer Pane の各セクションもバックエンドから渡された固定順をそのまま描画しているため、運用中に「最新順で見たい」「名前順で見たい」を切り替えられず、Archive では表示名から日付プレフィックスを除去しているため名前順ソートのキーも UI 上の見え方と一致していない。

## Goals / Non-Goals

**Goals:**
- 日時表示を locale 非依存の canonical `YYYY-MM-DD HH:mm` に統一する
- archived changes でも `lastModified` を表示・並び順の基準に使い、Dashboard Recent Activity と Explorer Pane の時系列を揃える
- Explorer Pane の ACTIVE CHANGES / ARCHIVE / SPECS に `Date` / `Name` の sort control を追加する
- 既定順を Active/Archive = date desc、Specs = name asc、Dashboard = date desc として明文化する
- ARCHIVE の name sort は `formatChangeName` 後の表示名で比較し、見た目と順序を一致させる
- `ui-localization` capability でも locale-aware な日時表示を廃止し、locale は application chrome と document semantics に限定する

**Non-Goals:**
- OpenSpec CLI の archive workflow や `.openspec.yaml` の生成仕様変更
- 厳密な archivedAt の導入や保存
- Explorer Pane のセクション構造・コンポーネント階層の大規模再設計
- 並び順設定の永続化（この change ではセッション内の既定動作のみ扱う）

## Decisions

1. **日時の canonical source は existing `lastModified` を使う**
   - Spec は `spec.md` mtime、Change は change 配下の relevant files の最大 mtime を引き続き使う。
   - archived change も `archivedDate` ではなく `lastModified` を表示とソートに使用する。
   - これにより Dashboard Recent Activity と Explorer Pane の sort key を一本化できる。
   - 代替案として `archivedDate` を維持する案もあるが、日付粒度のままで同日内の順序が崩れるため不採用。

2. **`formatDate` は locale 非依存の canonical formatter に切り替える**
   - 共通 utility は `Intl.DateTimeFormat` をやめ、ローカルタイムゾーン基準で `YYYY-MM-DD HH:mm` を組み立てて返す。
   - locale store は document `lang` / `dir` と message catalog 切り替えにだけ使い、日時表示には関与させない。
   - archived change でこれまで生文字列だった箇所も `formatDate(lastModified)` に寄せる。
   - 代替として locale-aware formatting を維持しつつ各 locale ごとに width 調整と文化依存の検証を続ける案もあるが、対応言語追加時の保守コストが高いため不採用。

3. **Explorer Pane の sort state はフロントエンド局所 state で持つ**
   - `ExplorerPane.svelte` で各セクションの sort mode を持ち、section component に渡して再ソートする。
   - バックエンドの初期配列順には依存せず、表示前にフロント側で sort key を計算する。
   - 永続化は将来的に `uiPreferences` へ拡張可能だが、今回は scope 外とする。

4. **sort control は `ExplorerSection` の `headerExtra` を活用して section header 内に出す**
   - 既存の ACTIVE CHANGES では command shortcut 用に `headerExtra` を使っているため、同じ仕組みで Date/Name toggle を差し込む。
   - UI は既存 select コンポーネントを使うか、最小限の segmented control で実装する。
   - 共通の `SortControl` 小コンポーネントを作ると 3 セクションでの重複を抑えられる。

5. **ARCHIVE の name sort は full name ではなく display name で比較する**
   - 表示は `formatChangeName(change.name)` なので、名前順も同じ変換後の文字列を基準にする。
   - full name で比較すると `YYYY-MM-DD-` が混ざり、UI 上の見え方と順序がずれるため不採用。

## Risks / Trade-offs

- **mtime 依存の曖昧さ** → git checkout / copy で更新時刻が変わる可能性は残るが、CLI/YAML を変えない前提では最も一貫した近似値として採用する
- **日時表示の横幅増加** → canonical format は predictable だが date-only より長いため、Explorer item や viewer subtitle で gap / wrap / truncate の微調整が必要になる
- **sort UI の視覚ノイズ** → 各セクション header に control を置くと密度が上がるため、コンパクトなラベル/サイズに抑える
- **バックエンド順と表示順の乖離** → API は従来どおりでもフロントで再ソートするため、一覧順は UI ルールが正本になることを前提とする
- **文化圏ごとの日付慣習を反映しない** → locale ごとの最適化は失うが、世界共通の見た目と将来 locale 追加時の保守容易性を優先する
