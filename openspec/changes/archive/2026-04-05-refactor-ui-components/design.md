## Context

テーマシステム（Change 2）完了後。全コンポーネントの色はセマンティック変数化済み。残る課題:

1. **SVGベタ書き**: 19箇所（約13種類）のSVGアイコンがコンポーネント内にインライン展開されている
2. **設定画面**: `CommandSettingsModal` が単一セクション構成で、Appearance（Change 2で追加）とCommandsが混在
3. **HTMLの冗長性**: SVGベタ書きにより各コンポーネントのテンプレートが長い

### アイコン使用状況

| アイコン種類 | 使用箇所数 | 使用コンポーネント |
|---|---|---|
| 設定(`gear`) | 1 | Navigation |
| 閉じる(`close`) | 3 | Modal, SuggestionPanel×2 |
| 戻る(`chevron-left`) | 2 | ChangeViewer, SpecViewer |
| 展開(`chevron-right`) | 1 | SpecsList |
| 仕様書(`document`) | 1 | SpecsList |
| アーカイブ(`archive-box`) | 1 | ChangesList |
| 完了(`check-circle`) | 1 | TaskList |
| 未完了(`circle`) | 1 | TaskList |
| 提案開始(`pencil-square`) | 3 | ChangeViewer, ActiveChangesList, SuggestionPanel |
| コピー(`clipboard`) | 1 | CommandShortcutBar |
| 編集(`pencil`) | 1 | SuggestionPanel |
| 削除(`trash`) | 1 | SuggestionPanel |
| ドキュメント操作(`document-arrow`) | 2 | SuggestionPanel |

## Goals / Non-Goals

**Goals:**
- `Icon.svelte` コンポーネントでSVGアイコンを一元管理
- 19箇所のSVGベタ書きを `<Icon name="..." />` に置換
- 設定画面を左ペイン+右詳細の2カラムレイアウトに再設計
- `CommandSettingsModal` → `SettingsModal` に統合（General / AI Tool / Commands）

**Non-Goals:**
- 外部アイコンライブラリ（lucide, heroicons等）の導入はしない
- アイコンの新規デザインはしない（既存SVGをそのまま移行）
- Tailwindクラスの最適化・@applyの削除はしない
- コンポーネント間のprops/イベントの再設計はしない

## Decisions

### D1: Icon コンポーネントの設計
`name` prop でアイコン種類を切り替え、`class` や `size` prop でスタイルを制御。SVG path データはコンポーネント内の switch/map で管理。外部ファイル化は不要（十数種類程度）。

```svelte
<!-- 使用例 -->
<Icon name="gear" class="h-5 w-5" />
<Icon name="close" class="h-5 w-5 text-on-surface-muted" />
```

**代替案**: CSS mask + bg-current → 現在のSVG形式から移行しやすく、stroke/fill両対応できるコンポーネント方式を採用。

### D2: 設定画面のレイアウト
左ペインに `General` / `AI Tool` / `Commands` の大分類リスト、右ペインに選択中セクションの詳細を表示。初期状態は General（Appearance含む）を選択。サイドパネルは簡素化し、ラベルとアイコンのみを表示する。

```
┌────────────────────────────────────────────────────────────┐
│  Settings                                              ✕    │
├────────────────┬───────────────────────────────────────────┤
│                │                                           │
│  General       │  ┌─────────────────────────────────────┐  │
│  AI Tool       │  │ THEME                               │  │
│  Commands      │  │                                     │  │
│                │  │  ┌────────┐ ┌────────┐ ┌────────┐  │  │
│                │  │  │ System │ │ Light  │ │ Dark   │  │  │
│                │  │  └────────┘ └────────┘ └────────┘  │  │
│                │  └─────────────────────────────────────┘  │
│                │                                           │
│                │  [Scrollable content area]                │
│                │                                           │
└────────────────┴───────────────────────────────────────────┘
```

**レイアウト仕様:**
- モーダル横幅: `max-w-4xl` (896px) - コンテンツが見切れない十分な幅
- モーダル高さ: `h-[85vh]` - 画面基準の固定高さ
- 左ペイン: 固定幅 `14rem`、高さ制限付きで独立スクロール
- `lg` 未満ではカテゴリボタンを3列グリッドで横並び表示し、各ボタン幅を均一にする
- カテゴリボタンは説明文を持たず、ラベルとアイコンのみを表示する
- 右コンテンツ: 残り幅、高さ制限付きで独立スクロール
- `AI Tool` と `Commands` は左ペイン上の独立セクションとして分離し、`Commands` 選択時に Expanded Commands 設定を表示する

**代替案**: タブ切り替え → 将来的にセクションが増えた時に水平スクロールになる。左ペイン方式はスケーラブル。

### D3: CommandSettingsModal の移行
新規 `SettingsModal` に既存 `CommandSettingsModal` の内容を統合し、Appearance を General、AI Tool を `AI Tool`、Expanded Commands を `Commands` に再編する。`CommandSettingsModal` は削除する。

### D4: SettingsModal のスクロール設計
モーダル全体は画面基準の固定高さにし、各ペインを独立してスクロール可能にすることで、長いコンテンツでも画面からはみ出さない。詳細パネルは常に上詰めで表示し、内容が少ない場合は下側に余白が残る。

```
┌────────────────────────────────────────────────────────────┐
│  Settings Modal (max-h: 85vh)                              │
├────────────────┬───────────────────────────────────────────┤
│                │ ▲                                         │
│  General       │ │  Scrollable Content Area                │
│  ──────────    │ │  (independent scroll)                   │
│  AI Tool       │ │                                         │
│  Commands      │ │                                         │
│                │ │  ┌─────────────────────────────────┐    │
│                │ │  │ AI Tool                         │    │
│                │ │  │ [radio buttons...]              │    │
│                │ │  └─────────────────────────────────┘    │
│                │ │                                         │
│                │ │  ┌─────────────────────────────────┐    │
│                │ │  │ Expanded Commands               │    │
│                │ │  │ [checkbox list...]              │    │
│                │ │  │                                 │    │
│                │ │  │ [checkbox list...]              │    │
│                │ │  │                                 │    │
│                │ │  │ [checkbox list...]              │    │
│                │ ▼  └─────────────────────────────────┘    │
│                │                                           │
└────────────────┴───────────────────────────────────────────┘
       ▲
       │  Left pane also scrollable independently
       │  (if needed for many sections)
       ▼
```

## Risks / Trade-offs

- [Icon コンポーネントの Props 設計の将来性] → 現在は十数種類で十分シンプル。種類が大幅に増えた場合は分割を検討。
- [設定画面の2カラムがモバイルで見づらい] → モバイルではペインを折りたたむか縦並びにする対応を将来検討。現状はデスクトップ前提のローカルツールなので優先度低。
- [スクロールエリアの視覚的区別] → スクロール可能な領域が分かりやすいよう、必要に応じてスクロールバーのスタイルを調整。
