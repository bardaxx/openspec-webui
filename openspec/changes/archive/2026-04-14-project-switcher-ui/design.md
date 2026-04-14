## Context

現在の top-left UI は、Activity Bar に置いた project avatar と ExplorerPane header の project name / actions が競合している。レイアウト上は 48px rail と resizable / collapsible explorer をまたぐ一体感を狙っていたが、実際には「project context が二重に見える」「rail の先頭ボタンが navigation なのか context なのか分かりにくい」という問題が出た。加えて narrow drawer は fixed overlay のため、開いたときに Activity Bar 自体が隠れて見える regression がある。

今回見直すのは主に UI responsibility と responsive behavior であり、project-specific icon / appearance customization は scope から外す。

## Goals / Non-Goals

**Goals:**
- Activity Bar を navigation rail として整理し、先頭 control を Explorer open/close responsibility に寄せる
- current project identity を text-first に整理し、Dashboard title と ExplorerPane header に役割分担して表示する
- top explorer toggle と nav icons を視覚的に分離する
- narrow layout でも Activity Bar を見えるまま残し、drawer を rail の右側から開く

**Non-Goals:**
- Dashboard / Archive / Specs / Search / Settings の nav icon を project-specific にすること
- custom image upload / drag-and-drop image storage / avatar binary serving
- per-project icon / appearance customization

## Decisions

### D1: project identity は text-first にする

**決定**: project-specific avatar / icon selection は廃止する。current project identity は `project.name` を主として扱い、ExplorerPane header では folder icon + project name、Dashboard では page title に project name を表示する。

**理由**: YAGNI であり、text の方が一貫して読みやすく、global context も保ちやすいため。

### D2: Activity Bar の top slot は explorer toggle にする

**決定**: active project がある場合、Activity Bar の最上段は current project avatar ではなく Explorer open/close control とする。wide / medium では pane collapse を切り替え、narrow では drawer open/close を切り替える。no active project のときだけ shared app icon fallback で project selector を開く。

**理由**: rail 先頭の意味を navigation / pane chrome に寄せたほうが理解しやすく、project identity duplication も消える。

### D3: Dashboard と ExplorerPane に役割分担して project context を出す

**決定**: Dashboard header は current project name を page title として表示し、横の `folder-pen` button で project selector を開く。ExplorerPane header は folder icon + project name の text row とし、右側の `folder-pen` button で project selector を開く。

**理由**: Dashboard では project home として名前を大きく見せられ、ExplorerPane では常時 visible な text context を保てるため。

### D4: top explorer toggle は visual grouping を分ける

**決定**: Activity Bar の top explorer toggle は nav stack から divider / background difference で分離する。

**理由**: pane chrome と navigation destination を一目で区別できるようにするため。

### D5: narrow drawer は rail を避けて開く

**決定**: narrow drawer の overlay / sheet content は 48px Activity Bar の右側から始まるよう offset し、drawer open 中も Activity Bar を視認・操作できるようにする。

**理由**: current regression を解消し、drawer open 状態でも rail が app の主要 navigation であることを保つため。

### D6: project registry / API は project entry 基本情報だけに戻す

**決定**: `ProjectEntry.appearance` と `PUT /api/projects/:id/appearance` は削除する。WebSocket payload は従来どおり `activeProjectId` のままとする。

## Risks / Trade-offs

- **[Dashboard に寄せすぎると global context が弱くなる]** → Dashboard 以外で project が見えづらくなる → Mitigation: ExplorerPane header にも project name を残す
- **[top toggle と nav icon toggle の二重導線]** → explorer 開閉導線が増える → Mitigation: top toggle は explicit open/close、active nav icon toggle は section-preserving shortcut と位置づける
- **[narrow overlay offset の実装ずれ]** → sheet overlay/content の left offset が崩れると rail が再び隠れる → Mitigation: sheet overlay/content を両方 offset し、Activity Bar の z-index を明示する

## Migration Plan

1. ActivityBar top slot を explorer toggle に置き換える
2. Dashboard title を current project name に変更する
3. ExplorerPane header を folder icon + project name + folder-pen button に整理する
4. project appearance metadata / API / modal を削除する
5. narrow drawer overlay/content を rail offset に合わせて調整する
6. tests と spec-driven verification を更新する
