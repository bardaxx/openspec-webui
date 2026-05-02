## Why

The `package.json` description says "server-side project selection", which implies a remote server — contradicting the tool's local-first nature. Additionally, the CLI has no `--host` option: the server hard-binds to `127.0.0.1`, so users cannot expose the UI to other devices on the network even if they want to. The default should stay local-only, but an opt-in mechanism is needed for network access.

## What Changes

- Fix `package.json` description to accurately reflect local-first positioning
- Add `--host <address>` CLI option that defaults to `127.0.0.1` and passes through to the server
- Ensure `open()` always opens `localhost` (not `0.0.0.0`) in the browser
- Update README to document the new `--host` option and adjust "server" wording

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `cli-runtime`: Add `--host <address>` option with `127.0.0.1` default; ensure browser opens with `localhost` URL when bound to `0.0.0.0`
- `package-distribution`: Description field in `package.json` must reflect local-first positioning

## Impact

- `package.json` — description field
- `src/cli/index.ts` — new `--host` option, `open()` URL handling
- `README.md` — options table, example commands
