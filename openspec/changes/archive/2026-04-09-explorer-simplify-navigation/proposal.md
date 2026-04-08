## Why

ActivityBar の Home/Changes/Specs ボタンをクリックすると、ExplorerPane を展開しつつ MainViewer にも重複したリスト（Dashboard、Changes、Specs）タブを開いてしまい冗長。ExplorerPane 自体がリストの代替として機能するため、Changes/Specs ボタンはタブ生成不要。また、Home は常に存在するダッシュボードであり、初期状態で唯一のタブとして残り続けるべき。Explorer の展開ボタン（「＞」）がレイアウトを乱し、ActivityBar で代替可能。VSCode ライクにアクティブボタンの再クリックでトグル可能にしたい。

## What Changes

- ActivityBar のアクティブボタン再クリック時、ExplorerPane をトグル（展開→縮小）する
- Explorer 縮小時に表示される「＞」展開ボタンを削除（ActivityBar で代用）
- ActivityBar の Changes/Specs クリック時、MainViewer にタブを開かない（Explorer 展開＋セクションフォーカスのみ）
- ActivityBar の Home クリック時、新しいタブは開かず Home タブをフォーカス（常に存在する前提）
- Home タブを pinned（非クローズ・非 unpin）にし、直URLアクセス時も常にタブバーに残る「ダッシュボード」として位置づける
- ExplorerPane の最大幅を 400px から 600px に増加し、リスト単体なしでも視認性を確保
- ExplorerPane セクションヘッダーにアイコンを表示し、リストアイテムからアイコンを削除

## Capabilities

### New Capabilities

（なし）

### Modified Capabilities

- `explorer-pane`: 展開/縮小の制御方法変更（トグル、独立展開ボタン削除）、最大幅 600px、セクションヘッダーにアイコン追加・リストアイテムからアイコン削除
- `activity-bar`: アクティブセクション再クリック時のトグル挙動追加、アクティブ状態を explorer preset ベースに変更、クリック時のタブ生成廃止（Home はフォーカスのみ、Changes/Specs はタブなし）
- `tabbed-viewer`: Home タブの pinned 化（常に存在・非クローズ・非 unpin）による Dashboard の位置づけ変更
- `resizable-layout`: ExplorerPane 最大幅 400px → 600px

## Impact

- **Frontend**: `ActivityBar.svelte`, `ExplorerPane.svelte`, `AppLayout.svelte`, `tabs.svelte.ts`, タブバー関連コンポーネントが影響
- **CSS**: 幅制約の変更のみ
- **Dependencies**: 新規依存なし
- **Backend**: 影響なし
- **Breaking**: なし（UI 操作の改善のみ）
