## 1. Fix package.json description

- [x] 1.1 Replace the `description` field in `package.json` with a local-first description that does not contain "server-side"

## 2. Add --host CLI option

- [x] 2.1 Add `--host <address>` option to the Commander program in `src/cli/index.ts` with help text "Host to bind to (default: 127.0.0.1)"
- [x] 2.2 Update the `.action()` handler to accept `host` from options, defaulting to `127.0.0.1`, and pass it to `createServer({ port, host })`

## 3. Fix browser URL for 0.0.0.0 binding

- [x] 3.1 Replace `//0.0.0.0` with `//localhost` in `server.url` before passing to `open()` on startup
- [x] 3.2 Apply the same substitution in the `l` key handler for interactive terminal sessions

## 4. Update README

- [x] 4.1 Add `--host <address>` to the options table with description "Host to bind to (default: 127.0.0.1)"
- [x] 4.2 Add a network access example (`openspec-webui --host 0.0.0.0`) to the Examples section
- [x] 4.3 Change "Port to run the server on" wording to "Port to listen on" in the options table
