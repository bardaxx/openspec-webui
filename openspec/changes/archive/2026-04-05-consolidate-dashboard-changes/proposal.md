## Why

Dashboard (`/`) と Changes (`/changes`) ページで Active Changes の表示が `ActiveChangesList` コンポーネントにより完全に重複している。ナビゲーションも冗長で、ユーザーは同じ内容を2つのページで見ることになる。3ページ（Home / Archived Changes / Specs）に整理して情報の重複をなくす。

## What Changes

- Dashboard ページ（`/`）を Home に改名し、Active Changes（バッジ付き）+ Project Docs を表示
- Changes ページ（`/changes`）を Archived Changes 専用ページに変更
- ナビゲーションの「Dashboard」リンクを削除し、Specs / Changes の2項目に整理
- Stats Cards を削除（件数はナビゲーションバッジとセクションヘッダーバッジで代替）
- Active Changes セクションヘッダーに件数バッジを追加
- ChangeViewer / SpecViewer のバックリンクを新しいルート構造に合わせて調整
- ナビゲーションのアクティブ状態表示の Svelte リアクティビティバグを修正

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `project-context`: ナビゲーション構造の変更（Dashboard→Home、Changes→Archived専用）、Stats Cards 削除、Active Changes ヘッダーに件数バッジ追加、3ページ構成への再編、ナビゲーションアクティブ状態のリアクティビティ修正
- `change-browsing`: ChangesList を Archived Changes 専用に変更、ページ名の統一

## Impact

- フロントエンドコンポーネント: `Dashboard.svelte`（Home化・Stats Cards削除）、`ChangesList.svelte`（Archived専用化）、`Navigation.svelte`（ナビ更新・リアクティビティ修正）、`ChangeViewer.svelte`（バックリンク）、`SpecViewer.svelte`（バックリンク確認）
- 既存spec: `project-context` と `change-browsing` の要件変更
