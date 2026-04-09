## Context

現在の frontend には以下の課題がある：

1. **`TaskList.svelte`** — どこからも import されていないデッドコンポーネント。自己再帰（`subtasks`）の import のみ存在。
2. **`Toast.svelte`** — 自前の簡易 toast（38行）。`stores/index.svelte.ts` の `addToast()` + `setTimeout` でキュー管理。アニメーション・スタック・アクセシビリティが最小限。
3. **`TaskProgress.svelte`** — 自前のプログレスバー（46行）。shadcn-svelte の Progress コンポーネントはまだ ui/ に存在しない。

shadcn-svelte の Sonner（`svelte-sonner`）と Progress を導入し、ui コンポーネントの整合性を改善する。

## Goals / Non-Goals

**Goals:**

- デッドコード（`TaskList.svelte`）を削除
- Toast を shadcn-svelte Sonner に移行し、テーマ統合・スタック・自動消滅を改善
- TaskProgress を shadcn Progress ベースにリファクタし、ui コンポーネントフォルダに配置
- 既存の toast 呼び出し箇所（`addToast`）を Sonner API に置き換え

**Non-Goals:**

- MarkdownRenderer / HtmlRenderer の変更（ドメインロジックが多く自前必須のため対象外）
- 新しい toast の種類（warning 等）の追加
- TaskProgress の仕様変更（色分けロジック・fraction 表示はそのまま）

## Decisions

### D1: Toast — svelte-sonner（Sonner）を採用

**Choice**: `svelte-sonner` を shadcn-svelte スタイルで `$lib/components/ui/sonner/` に配置。

**理由**: shadcn-svelte 公式が Sonner を推奨。`svelte-sonner` は Svelte 5 対応済みで、`toast()` 関数呼び出しで直接 toast を発火できるため、store 管理が不要になる。

**代替案**: shadcn-svelte の `Toast` コンポーネント（`bits-ui` ベース）。→ 宣言的 API で store が必要になり、現在の imperative な `addToast()` からの移行コストが高い。

### D2: TaskProgress — 削除して shadcn Progress を直接使用

**Choice**: `TaskProgress.svelte` を削除し、各呼び出し側で shadcn `<Progress>` を直接使用する。

**理由**: 色分けロジック・fraction 表示・label 表示は不要。カスタムラッパーを持たず、標準のまま使うことで `components/` 配下を最小限に保つ。

### D3: Toast API の移行

**Choice**: `addToast(message, type)` を `toast()`（svelte-sonner）に置き換え。info/success/error はそれぞれ `toast()` / `toast.success()` / `toast.error()` にマッピング。

**理由**: Sonner は種類別メソッドを提供しており、既存の3タイプと1:1で対応可能。

### D4: TaskList.svelte の削除

**Choice**: ファイルごと削除。外部からの参照なし。

## Risks / Trade-offs

- [svelte-sonner が Svelte 5 runes に完全対応していない可能性] → 最新版（1.x）で対応済み。未対応の場合は `bits-ui` ベースの Toast にフォールバック
- [Sonner のスタイルが既存テーマと競合する可能性] → `$lib/components/ui/sonner/` でテーマ変数を上書きして調整
- [Toast 移行で `stores/index.svelte.ts` の `toasts` state / `addToast` を削除する際、他の参照漏れ] → `grep` で全参照を確認してから削除
