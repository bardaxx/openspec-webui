# OpenSpec WebUI

Browser-based viewer for [OpenSpec](https://github.com/Fission-AI/OpenSpec) projects.

![OpenSpec WebUI](https://raw.githubusercontent.com/oioi555/openspec-webui/main/screenshot.png)

## What is this?

[OpenSpec](https://github.com/Fission-AI/OpenSpec) is a spec-driven development workflow that organizes project knowledge into directories — `config.yaml`, `specs/`, `changes/` with proposals, designs, and tasks.

OpenSpec WebUI gives you an interactive browser interface to explore those directories. Launch the app locally, select your projects, and browse specs, changes, and artifacts — all from the browser.

- Multi-project support — add, switch, and remove projects from the UI
- Browse `config.yaml`, `specs/`, `active changes`, and `archived changes`
- Render Markdown artifacts with live preview
- Track checkbox task progress
- Search across all OpenSpec content
- Live refresh when files change
- Group supplemental change files by folder/tab
- Contextual command actions — copy pre-filled workflow commands to paste into your AI tools
- Light / dark / system theme support

## Install

```bash
npm install -g openspec-webui
```

Or use without installing:

```bash
npx openspec-webui
```

## Usage

```bash
openspec-webui [options]
```

### Examples

```bash
# Start with default settings (127.0.0.1:3001, auto-open browser)
openspec-webui

# Use a different port
openspec-webui --port 8080

# Allow access from other devices on the network
openspec-webui --host 0.0.0.0

# Start without opening the browser
openspec-webui --no-open
```

### Options

| Option | Description |
| -------- | ------------- |
| `-p, --port <port>` | Port to listen on (default: 3001) |
| `--host <address>` | Host to bind to (default: 127.0.0.1) |
| `--no-open` | Do not open the browser automatically |
| `-V, --version` | Display version |
| `-h, --help` | Display help |

## Development

### Requirements

- Node.js >= 20

### Commands

```bash
npm install
npm run dev        # Start dev mode (server + frontend watch)
npm run dev -- --host 0.0.0.0 --port 3001 --no-open
npm run build      # Build production assets
npm run test       # Run unit tests
npm run typecheck  # TypeScript + Svelte diagnostics
```

### Dev mode details

- App URL: `http://127.0.0.1:3001`
- Server code is watched and restarted automatically
- Frontend source changes rebuild `dist-frontend` automatically
- After frontend edits, refresh the browser manually

## License

MIT. See [LICENSE](./LICENSE).

This project is based on [MusicAdam/openspec-viewer](https://github.com/MusicAdam/openspec-viewer), which is licensed under the MIT License.

Third-party package licenses can be found in the included `ThirdPartyNotices.txt`.
