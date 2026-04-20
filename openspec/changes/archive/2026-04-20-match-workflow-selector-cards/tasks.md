## 1. Workflow selector UI

- [x] 1.1 `frontend/src/lib/components/layout/SettingsModal.svelte` に workflow format 用の Lucide icon import を追加する
- [x] 1.2 `standard` / `claude-code` / `skill` の各 workflow option を、Theme セクションと同じカード型 radio UI に置き換える
- [x] 1.3 既存の workflow 値バインディング、command preview、help callout を維持したまま見た目だけを更新する

## 2. Shared OptionCard component

- [x] 2.1 `frontend/src/lib/components/shared/option-card/option-card.svelte` に OptionCard コンポーネントを作成する（icon, label, selected, name, value, description snippet を受け取るカード型 radio）
- [x] 2.2 `frontend/src/lib/components/shared/option-card/index.ts` に barrel export を追加する
- [x] 2.3 SettingsModal の Theme セレクタ（light / dark / system）を OptionCard を使うようにリファクタする
- [x] 2.4 SettingsModal の Workflow セレクタ（standard / claude-code / skill）を OptionCard を使うようにリファクタする

## 3. Language selector replacement

- [x] 3.1 ネイティブ `<select>` をカスタム `Select` コンポーネント (`ui/select/`) に置き換える
- [x] 3.2 Lucide `ChevronDown` を Trigger 内に配置してテーマ追従する矢印を実現
- [x] 3.3 Select.Item のホバー・選択色を `bg-primary/5` に統一（OptionCard と同じ濃さ）

## 4. shadcn Card component

- [x] 4.1 `ui/card/` に shadcn Card 一式 (Root, Header, Title, Description, Content, Footer) を追加
- [x] 4.2 Dashboard の全カード統一は別 Change で実施（Card コンポーネントは準備完了）

## 5. Style unification

- [x] 5.1 OptionCard 未選択時の背景を `bg-secondary/30` → `bg-card` に変更
- [x] 5.2 Select.Item の選択色を `bg-primary/5` に統一（OptionCard 選択時と完全一致）

## 6. Validation

- [x] 6.1 `frontend` で `npx svelte-check --threshold error` を実行し、エラー・警告なしを確認する
