## REMOVED Requirements

### Requirement: Enable suggestion mode for active changes
**Reason**: Suggestion機能全体を廃止。narrow modeでメインビューとパネルが同時使用不可であり、ワークフローが現在のユースケースに合わない。
**Migration**: 将来シンプルな代替が必要な場合は新規changeで再設計する。旧コードはgit履歴から参照可能。

### Requirement: Persist and manage suggestions per change in the browser
**Reason**: 同上。suggestion蓄積・永続化機能を廃止。
**Migration**: なし。localStorage内の `openspec-suggestions-*` キーは参照されなくなるが実害なし。

### Requirement: Reconcile suggestions against refreshed content
**Reason**: 同上。suggestionのreconcile機能を廃止。
**Migration**: なし。

### Requirement: Generate clipboard-ready implementation instructions
**Reason**: 同上。promptGeneratorによる指示書き生成機能を廃止。
**Migration**: なし。
