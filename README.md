# OpenSpec WebUI

Browser UI for OpenSpec-compatible directories, intended as a customizable base for personal and team workflows.

This repository started from the MIT-licensed `MusicAdam/openspec-viewer` project and is being generalized into a separate product.

## Installation

```bash
npm install
```

Requires Node.js >= 20.0.0.

## Development

```bash
npm run dev
```

- Backend API / app server: `http://127.0.0.1:3001`
- Frontend dev server (Vite): `http://127.0.0.1:3002`

By default, the server opens the current directory. To point dev mode at a fixture or workspace, set `OPENSPEC_WEBUI_DEV_PATH`:

- `npm run dev` / `npm run dev:server` は、この repo ではデフォルトで `./openspec` を開きます
- CLI 単体の `openspec-webui` コマンド既定値は引き続きカレントディレクトリです

```bash
OPENSPEC_WEBUI_DEV_PATH=./test-openspec npm run dev:server
```

## Usage

```bash
openspec-webui [path] [options]
```

### Examples

```bash
openspec-webui .                    # Current directory
openspec-webui ./my-project         # Specific directory
openspec-webui --port 8080          # Custom port
openspec-webui --no-open            # Don't auto-open browser
```

### Options

| Option | Description |
|--------|-------------|
| `-p, --port <port>` | Port to run server on (default: 3001) |
| `--no-open` | Don't open browser automatically |
| `-V, --version` | Display version |
| `-h, --help` | Display help |

## Current Direction

- Generalize the viewer beyond a single AI/tooling workflow
- Improve editing and suggestion-to-action handoff
- Keep OpenSpec browsing useful even when the source repo layout varies a bit
- Serve as a private sandbox for heavier customization before any future public release

## Features Today

- Live file watching with auto-refresh
- Markdown and HTML rendering
- Task progress tracking with checkbox parsing
- Search across all content
- Dark mode UI
- Folder-based tab grouping for change files

## OpenSpec-Compatible Layout

[OpenSpec](https://github.com/Fission-AI/OpenSpec) is a specification-driven development framework with directories like:

- `project.md` - Project conventions
- `specs/` - Current specifications
- `changes/` - Change proposals with `proposal.md`, `tasks.md`, `design.md`
- `changes/archive/` - Completed changes with date prefixes

Each change can also include extra folders, and this UI groups them into separate tabs.

## License

MIT. See [LICENSE](./LICENSE).

This project includes code derived from the MIT-licensed upstream repository `MusicAdam/openspec-viewer`.
