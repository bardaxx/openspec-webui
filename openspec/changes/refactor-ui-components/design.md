## Context

テーマシステム（Change 2）完了後。全コンポーネントの色はセマンティック変数化済み。残る課題:

1. **SVGベタ書き**: 19箇所（約8種類）のSVGアイコンがコンポーネント内にインライン展開されている
2. **設定画面**: `CommandSettingsModal` が単一セクション構成で、Appearance（Change 2で追加）とCommandsが混在
3. **HTMLの冗長性**: SVGベタ書きにより各コンポーネントのテンプレートが長い

### アイコン使用状況

| アイコン種類 | 使用箇所数 | 使用コンポーネント |
|---|---|---|
| 設定(gear) | 1 | Navigation |
| 閉じる(X) | 3 | Modal, SuggestionPanel×2 |
| 展開(chevron-right) | 3 | ChangeViewer, SpecViewer, ChangesList |
| 折りたたみ(chevron-down) | 2 | ChangeViewer, SuggestionPanel |
| チェック(checkmark) | 2 | TaskList, SpecsList |
| 空(circle) | 2 | TaskList, SpecsList |
| 追加(plus) | 2 | SuggestionPanel, ActiveChangesList |
| コピー(clipboard) | 1 | CommandShortcutBar |
| 提案(lightbulb) | 1 | SuggestionPanel |
| 空状態(document) | 1 | SuggestionPanel |

## Goals / Non-Goals

**Goals:**
- `Icon.svelte` コンポーネントでSVGアイコンを一元管理
- 19箇所のSVGベタ書きを `<Icon name="..." />` に置換
- 設定画面を左ペイン+右詳細の2カラムレイアウトに再設計
- `CommandSettingsModal` → `SettingsModal` に統合（General + Commands）

**Non-Goals:**
- 外部アイコンライブラリ（lucide, heroicons等）の導入はしない
- アイコンの新規デザインはしない（既存SVGをそのまま移行）
- Tailwindクラスの最適化・@applyの削除はしない
- コンポーネント間のprops/イベントの再設計はしない

## Decisions

### D1: Icon コンポーネントの設計
`name` prop でアイコン種類を切り替え、`class` や `size` prop でスタイルを制御。SVG path データはコンポーネント内の switch/map で管理。外部ファイル化は不要（8種類程度）。

```svelte
<!-- 使用例 -->
<Icon name="gear" class="h-5 w-5" />
<Icon name="close" class="h-5 w-5 text-on-surface-muted" />
```

**代替案**: CSS mask + bg-current → 現在のSVG形式から移行しやすく、stroke/fill両対応できるコンポーネント方式を採用。

### D2: 設定画面のレイアウト
左ペインに大分類リスト、右ペインに選択中セクションの詳細を表示。初期状態は General（Appearance含む）を選択。

```
┌──────────────────────────────────────────────┐
│  Settings                                ✕    │
├──────────────┬───────────────────────────────┤
│              │                               │
│  General     │  テーマ                        │
│  ──────────  │                               │
│  Commands    │  ○ Light    ○ Dark            │
│              │  ○ System                    │
│              │                               │
└──────────────┴───────────────────────────────┘
```

**代替案**: タブ切り替え → 将来的にセクションが増えた時に水平スクロールになる。左ペイン方式はスケーラブル。

### D3: CommandSettingsModal の移行
新規 `SettingsModal` に CommandSettingsModal の内容と Appearance セクションを統合。CommandSettingsModal は削除。

## Risks / Trade-offs

- [Icon コンポーネントの Props 設計の将来性] → 現在8種類で十分シンプル。種類が大幅に増えた場合は分割を検討。
- [設定画面の2カラムがモバイルで見づらい] → モバイルではペインを折りたたむか縦並びにする対応を将来検討。現状はデスクトップ前提のローカルツールなので優先度低。
