## Context

`ui/card/` は追加済みだが、Dashboard、ChangeViewer、SpecViewer、Settings では依然として feature-local な card class が複数残っている。特に Dashboard には summary card / section container / interactive item / inner content / empty state の5系統以上のカード風パターンがあり、`rounded-lg` / `rounded-xl`、`bg-card` / `bg-background/70`、`shadow-sm` / `shadow-lg`、`hover:bg-secondary/40` などが場当たり的に混在している。

今回の変更は、既存の Card primitive を起点に「共通外枠 + surface variant + interactive variant」という整理を行い、主要ビュー間で card surface の見た目と実装パターンを揃えるものである。対象は Dashboard、ChangeViewer、SpecViewer、Settings で、Explorer item や tab bar のような非カード UI は含めない。

## Goals / Non-Goals

**Goals:**
- Dashboard の主要カードサーフェスを Card ベースへ整理し、同じ役割のサーフェスで同じ class / component を再利用できるようにする
- ChangeViewer / SpecViewer の本文コンテナと delta コンテナを Dashboard と整合する Card トーンへ揃える
- Settings の OptionCard と Select.Item の色・背景・境界線トーンを Card 系サーフェスと整合させる
- feature-local なインライン card class の重複を減らし、今後の微調整を shared component / shared class に集約できる状態を作る

**Non-Goals:**
- Dashboard の情報構造や並び順の変更
- ChangeViewer / SpecViewer の内容、context menu 機能の変更
- Settings の設定値、保存方式、操作フローの変更
- Explorer Pane や TabBar などカード以外の UI のリデザイン

## Decisions

### D1. `ui/card/` を単体 primitive として維持し、役割別の薄いラッパーを shared 側に追加する

`Card.Root/Header/Content/Footer` だけでは Dashboard の summary card や interactive item card まで直接表現すると class の上書きが多くなる。そのため `ui/card/` 自体は shadcn 互換の primitive のまま維持し、必要であれば `shared/` 側に `SurfaceCard` / `InteractiveCard` / `SectionCard` のような薄いラッパーを追加して feature 間で再利用する。

**代替案:** すべてを `Card.Root` へ直接 class 追加して使う。短期的には速いが、Dashboard の 15 箇所以上で class の再重複が続くため採用しない。

### D2. 視覚トーンは `bg-card` を基準にし、補助コンテンツだけ `bg-background/70` を許容する

外側の主要サーフェス（summary card、section container、viewer content container、settings option の未選択状態）は `bg-card` を基準に揃える。一方で planning context 内の補助的な内側コンテナや delta content wrapper のように親 card の中に入る要素は、階層差を出すため `bg-background/70` を許容する。

**代替案:** すべて `bg-card` に統一する。階層差が消え、planning context や delta 内容の区切りが弱くなるため採用しない。

### D3. インタラクティブ選択トーンは `primary/5` 系で統一する

OptionCard と Select.Item ですでに採用した `bg-primary/5`、`hover:border-primary/40~50` を、選択・hover・focus の基準トーンとして扱う。command-emphasis 系のアクセント色は使わず、通常 UI の選択表現は primary に統一する。

**代替案:** component ごとに accent / secondary / primary を混在させる。視覚ルールが増えて Settings と Dashboard の一貫性が壊れるため採用しない。

### D4. OpenSpec の spec では「見た目の完全一致」ではなく「Card パターン利用」を要件化する

spec には細かな Tailwind class 文字列を固定せず、共通 Card pattern / shared card surface / listbox-style control tone などの振る舞いを要件として記述する。これにより実装の自由度を保ちつつ、インライン card 実装へ逆戻りしない契約を作る。

**代替案:** `rounded-xl border bg-card shadow-sm` のような class レベルまで spec に書く。表現が過度に実装依存になるため採用しない。

### D5. ChangeViewer のタブ並び順は思考順に固定する

GROUP_ORDER = `['proposal', 'design', 'tasks', 'specs']` で fileGroups をソートし、ユーザーが Change を追う際の思考プロセス（提案 → 設計 → 実装手順 → 仕様影響）に合う順序にする。Spec Deltas タブは常に末尾。

### D6. ChangeViewer のサブタブ選択を tabStore に永続化する

`tabStore.viewerStates` に change タブごとの `activeGroupIndex` と `activeFileIndex` を保存し、タブ切替後に復元する。`deltaOpenStates`（折りたたみ状態）はローカル状態のまま保存しない。

### D7. Spec Delta の折りたたみと検索

各 spec delta を Collapsible で折りたたみ可能にし、初期状態は閉じた状態とする。InteractiveCard の hover アニメーションは delta では無効化する。各 delta ヘッダーの Search ボタンで `layoutStore.openOverlay('search', { initialQuery: delta.capability })` を呼び出し、既存の検索ダイアログで spec タイトル検索を可能にする。

### D8. OptionCard は Card ラッパーを使わず直接 label 要素とする

`Card` コンポーネントのベースクラス（`py-6`, `gap-6`, `shadow`）が OptionCard のレイアウト（`p-4`, `gap-3`, `items-center`, `text-center`）と衝突するため、`Card` をラップせず `<label>` 要素に直接 Card トーンの class を適用する。

### D9. ExplorerPane の project selector を下部に移動する

Dashboard が常に開いているため、ExplorerPane 上部の project selector は冗長になる。下部に移動することで、画面上部の情報密度を下げる。旧 `project-context` spec の "Explorer Pane header SHALL show a folder icon plus the current project name" は下部配置へ更新する。

### D10. 非推奨 Lucide アイコンを現行アイコンに置き換える

`CheckSquare` は非推奨アイコンとなり、代わりに `CircleCheckBig` を使用する。Dashboard と ChangeViewer のタスク進捗表示箇所で一括置換する。Settings や他ビューでの `CheckSquare` 使用箇所も同様に更新する。

### D11. AddProjectDialog のダイアログサイズを調整する

AddProjectDialog のサイズがコンテンツに対して大きすぎる、または小さすぎる場合があるため、適切なサイズに調整する。これは card surface 統一の一環として、ダイアログコンテナの余白と shadow も Card 系トーンと整合させる。

## Risks / Trade-offs

- **[広範囲UI変更]** 複数ビューにまたがるため差分が大きくなる → まず shared primitive / wrappers を整備し、次に Dashboard、viewer、Settings の順で段階的に置換する
- **[抽象化しすぎ]** shared component を増やしすぎると用途が曖昧になる → variant の意味が明確なものだけを shared 化し、単発用途は `Card.Root` への class 合成で留める
- **[既存 spec との重複]** Dashboard や viewer の既存要件に style 要件を足しすぎると責務が曖昧になる → shared-ui-parts に基盤を置き、各 feature spec では「その基盤を使うこと」だけを追記する

## Migration Plan

データ移行は不要。実装は `ui/card/` と shared wrappers を先に整え、各 feature のインライン card class を段階的に置換する。問題があれば individual file 単位で差し戻せるため、ロールバックは通常の git revert で対応できる。

## Open Questions

- Dashboard の empty state card を専用 shared component にするか、既存 `EmptyState` + container class のままにするか
- Summary card と recent activity card を別 shared component に分けるか、単一の interactive surface variant で扱うか
