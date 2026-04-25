## Context

`2026-04-25-sync-specs-with-implementation` は spec-only change として archive 済みだが、レビューで 2 種類の問題が残っていることが分かった。

1. `frontend/src/lib/state/projects.svelte.ts` の `addProject()` は `refreshSnapshot()` で先に `activeProjectId` を切り替えるため、続く `bindProjectRequest()` が「すでにその project が active」と判定して early return しうる。初回 Add Project では WebSocket client がまだ `null` binding のままなので、`project:bound` を起点にした project-scoped 再初期化が走らない。
2. `frontend/src/lib/components/layout/SearchDialog.svelte` の debounce 実装は query ごとの無効化がなく、query を短く戻した後でも古い request の結果で UI が上書きされうる。
3. main spec には `top control` / `project:switched` / `$lib/components/ui/*` / `ExplorerItem` などの stale wording が残っている。

## Goals / Non-Goals

**Goals:**
- Add/reactivate project を `project:bound` 確認付きの確定フローに戻す
- Search を last-query-wins にする
- spec sync の取りこぼしだった stale references を main spec から除去する

**Non-Goals:**
- multi-project architecture の再設計
- Cmd+Click / metaKey など別 UX 課題の同時修正
- server-side registry schema の変更

## Decisions

### 1. Add/reactivate の ready 判定は `project:bound` を基準にする

REST の `/api/projects` 応答や `/api/projects` snapshot だけでは client binding / refCount / refresh routing が確定しないため、binding 完了の authoritative signal は引き続き `project:bound` とする。実装では、API 起点で local state が先に target project を指していても bind を short-circuit しない流れに寄せる。

**Alternative considered:** refreshed snapshot と `X-Project-Id` header だけで続行する。  
**Rejected because:** WebSocket binding が stale のままになり、初回 Add Project で project-scoped reset / initialize が抜ける。

### 2. Search は request invalidation で stale result を無視する

SearchDialog は単一 input / 単一 result list なので、AbortController よりも query snapshot または request token で last-query-wins を保証する方が小さく安全である。

**Alternative considered:** すべての search request を abort する。  
**Rejected because:** 現在の API helper は cancellation 前提ではなく、今回必要なのは UI 反映の無効化だけで足りる。

### 3. 残存 spec drift は同じ Change で閉じる

今回見つかった stale wording/path は直前の sync change の「spec を真実源に戻す」という目的に直接反するため、別 docs-only change へ先送りせず同じ修正ラインで閉じる。

**Alternative considered:** 実装バグ修正と spec cleanup を別 Change に分ける。  
**Rejected because:** 現在の baseline が再び「部分的にしか同期していない」状態のまま残る。

## Risks / Trade-offs

- **Risk:** bind を必須にすると websocket 未接続時の失敗が表面化する  
  **Mitigation:** add flow の loading / error 表示を維持し、失敗時は project list 再同期と明示的なエラー表示を行う。
- **Risk:** `project:bound` 基準にすると dialog close までの待ち時間が少し伸びる  
  **Mitigation:** 既存の loading UI を即時表示し、待機理由を binding + data refresh に限定する。
- **Risk:** spec cleanup で requirement の規範文を誤って変えすぎる  
  **Mitigation:** current main spec の requirement block を丸ごとコピーし、確認済みの stale references だけを修正する。

## Migration Plan

- 先に spec delta を揃え、そのあと frontend の state / search 修正とテスト更新を行う
- 永続データ移行は不要
- rollback は frontend 変更と delta spec をまとめて revert すればよい

## Open Questions

- なし（Cmd+Click parity は別 Change 候補として切り分ける）
