## Context

obsidian-layout-redesign で3ペーンレイアウト（ActivityBar + ExplorerPane + MainViewer）を構築した。現在、ActivityBar の Home/Changes/Specs ボタンが ExplorerPane の展開に加えて MainViewer にもタブを開く設計になっている。ExplorerPane 自体がセクションリストを提供するため、Changes/Specs のタブ生成は冗長。

Home タブは初期状態で唯一開いているタブであり、他の全てのタブ（個別 change、spec）は Explorer から開くフローになる。したがって Home を「常にそこにある非クローズ可能なダッシュボード」として位置づけるのが自然。

フロントエンドは Svelte 5 (runes) + Vite 6 + Tailwind CSS 4 構成。タブストアには既に `pinned` フィールドと非クローズロジックが実装済み。

一方で現状の ActivityBar はアクティブ状態を `tabStore.activeTab.path` から導出しているため、Changes/Specs のタブ生成をやめるとハイライトと再クリックトグルが壊れる。またタブストア初期化は current URL の単一タブのみを生成するため、`/specs/...` や `/changes/...` への直URLアクセス時に Home タブが存在しない。

## Goals / Non-Goals

**Goals:**
- Home タブを pinned（非クローズ可能）とし、常にタブバーに存在するダッシュボードにする
- ExplorerPane をリストの主たる表示場所とし、Changes/Specs ボタンのタブ生成を廃止する
- Home ボタンは新しいタブを開かず、常に Home タブをフォーカスする
- VSCode ライクに、アクティブな ActivityBar ボタンの再クリックで Explorer をトグルする
- Explorer 縮小時の独立した展開ボタン（「＞」）を削除し、ActivityBar で一元制御する
- ExplorerPane の最大幅を 600px に拡大し、リスト単体がなくても視認性を確保する
- セクションヘッダーにアイコンを表示し、リストアイテムをコンパクトにする

**Non-Goals:**
- Explorer 内のセクション構成（ACTIVE CHANGES / ARCHIVE / SPECS）の変更
- ActivityBar のアイコンレイアウトや見た目の変更
- Home ダッシュボードのコンテンツ拡張（将来の別 change で対応）
- バックエンドの変更
- レスポンシブモード（narrow）の挙動変更

## Decisions

### Decision 1: Home タブを pinned で非クローズ化

**Choice**: `HOME_TAB` の `pinned` を `true` に設定し、タブストア初期化時に current URL に関係なく Home タブを常に含める。Home タブには閉じるボタンも unpin 操作も提供しない。

**Rationale**: Home は初期状態で唯一のタブであり、他のタブを全て閉じた時のフォールバックでもある。常に存在することを保証することで、ActivityBar Home の振る舞いが「フォーカス」だけになりシンプルになる。直URLアクセス時も Home を失わないよう初期タブ配列に常に含め、UI/ストア両方で unpin を防ぐことで「固定ダッシュボード」という前提を崩さない。

### Decision 2: ActivityBar クリック時のタブ制御をセクション別に変更

**Choice**:
- **Home**: `tabStore.focus('/')` のみ（常に存在するため `open` 不要）
- **Changes/Specs**: タブ操作なし（Explorer 展開＋セクションフォーカスのみ）
- ActivityBar の highlighted state は `layoutStore.activityPreset` を基準にしつつ、spec タブや archived change タブのような明示的ビューでは path 由来の fallback を使う
- ExplorerPane 側で section focus が変わったときも `activityPreset` を同期し、タブ非生成時でも ActivityBar の状態が崩れないようにする

**Rationale**: ExplorerPane がリストの代替として機能するため、Changes/Specs のタブ生成は不要。Home は pinned で常に存在するので `open` ではなく `focus` で足りる。一方でアクティブ状態を tab path のみに依存すると Changes/Specs クリック後も Home がハイライトされたままになるため、explorer preset を正とする必要がある。

### Decision 3: アクティブセクション再クリックでトグル

**Choice**: ActivityBar のアクティブなセクションボタンをクリックした場合、Explorer が展開中のときのみ `layoutStore.toggleExplorerCollapsed()` を呼ぶ。Explorer が既に縮小済みなら通常の preset 切替として扱う。

**Rationale**: VSCode の標準的な UX パターンに合わせる。独立した展開ボタンを廃止するため、トグル手段として ActivityBar が唯一のインタラクションポイントになる。縮小済みの状態で再クリックを単純トグルにすると Home フォーカスや section focus が実行されないため、展開中のみトグルとする。

### Decision 4: 展開ボタン削除

**Choice**: AppLayout.svelte にあった縮小時の ChevronRight 展開ボタンを削除。

**Rationale**: ActivityBar のトグルで代用可能であり、ボタンが MainViewer のレイアウトを乱していた。

### Decision 5: ExplorerPane 最大幅 600px

**Choice**: ExplorerPane の最大幅を 400px から 600px に増加し、`layout.svelte.ts` の制約値だけでなく `AppLayout.svelte` の drag clamp helper と `Resizable.Panel` の `maxSize` も同時に更新する。

**Rationale**: Changes/Specs の単独リストに依存せず Explorer 内で十分な情報量を表示するため。制約値が複数箇所に分散しているため、1箇所だけ更新すると drag 時の実際の上限が 400px のまま残る。

### Decision 6: ヘッダーにアイコン、リストからアイコン削除

**Choice**: 各セクションヘッダーのタイトル横にアイコン（SquarePen / Archive / FileText）を追加し、リストアイテムの 32x32 アイコンボックスを削除。

**Rationale**: セクションの視覚的識別をヘッダーレベルに集約し、リストアイテムをコンパクトにして情報密度を高める。

## Risks / Trade-offs

- **[Risk] タブ生成廃止で MainViewer が空になるケース** → Home タブが pinned で常に存在するため、MainViewer が空になることはない
- **[Trade-off] Explorer トグルが ActivityBar に依存** → ActivityBar は常に表示される（spec 準拠）のでアクセス性は損なわれない
- **[Trade-off] 600px 最大幅で小画面での MainViewer 空間が減る** → 最小幅 300px を下回らないよう Resizable コンポーネントが制御
- **[Trade-off] Home タブが閉じられない** → 将来 Home ダッシュボードの内容拡張で価値を高める前提。固定ダッシュボードは VSCode でも標準パターン
