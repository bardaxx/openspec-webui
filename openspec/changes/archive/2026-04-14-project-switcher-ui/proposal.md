## Why

複数プロジェクトを切り替えられるようになった一方で、左上の文脈整理がまだ不十分だった。Activity Bar のトップに project avatar を置く案は、Explorer Pane 側の project name / actions と意味が重複し、rail navigation と project context の責務も曖昧になった。さらに narrow drawer を開いた際に Activity Bar が隠れて見える regressions もあり、役割を整理し直したい。

## What Changes

- active project がある場合、Activity Bar の最上段を project avatar ではなく Explorer Pane open/close control に変更する
- current project identity は text-first に整理し、Dashboard title を current project name に変更しつつ、Explorer Pane header には folder icon 付き project name と project selector button を表示する
- top explorer toggle と navigation icons を separator / background difference で視覚的に分離する
- Dashboard header と Explorer Pane header から project selector を開けるようにする
- narrow layout では Explorer drawer を Activity Bar の右側から開き、drawer open 中も Activity Bar を見える状態に保つ
- Dashboard / Archive / Specs / Search / Settings の navigation icons は project-specific にせず既存の意味を維持する

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `activity-bar`: top slot を explorer toggle control として再定義し、no-project fallback icon / visual separation / nav responsibility を定義する
- `project-context`: Dashboard title と Explorer Pane header による project context 表示を定義する
- `explorer-pane`: folder icon + project name + folder-pen button の header と narrow drawer offset behavior を定義する
- `project-selector-ui`: Dashboard header / Explorer Pane header からの selector 導線を定義する

## Impact

- **Layout/UI**: `frontend/src/components/layout/AppLayout.svelte`, `ActivityBar.svelte`, `ExplorerPane.svelte` の rail / header / narrow drawer 構造
- **Project UI**: `frontend/src/components/layout/ProjectSelector.svelte`, `Dashboard.svelte`, `ExplorerPane.svelte` の selector 導線整理
