## Context

OpenSpec WebUI is a local-first CLI tool that starts a Fastify HTTP server on the user's machine to serve a browser-based UI for exploring OpenSpec projects. Currently:

- The `package.json` description says "server-side project selection", implying a remote server model
- The CLI only accepts `--port` and `--no-open` options — there is no `--host` option
- The server's `ServerOptions` interface already accepts an optional `host` field (defaulting to `127.0.0.1`), but the CLI never passes it through
- `open()` uses the Fastify-returned URL directly, which would be `http://0.0.0.0:3001` if bound to `0.0.0.0` — this fails in the browser

## Goals / Non-Goals

**Goals:**
- Fix the `package.json` description to accurately convey local-first positioning
- Expose the host binding as a CLI option so users can opt into network access
- Ensure the browser always opens a working URL (localhost, not 0.0.0.0)

**Non-Goals:**
- Adding authentication or access control for network-exposed mode
- Changing the server architecture or adding TLS
- Modifying the frontend to detect local vs network mode

## Decisions

### 1. Default host remains 127.0.0.1

The CLI defaults to `127.0.0.1` even though Fastify's default is `0.0.0.0`. This keeps the tool local-first by default — users must explicitly opt into network access with `--host 0.0.0.0`.

**Alternative considered:** Default to `0.0.0.0` and document `--host 127.0.0.1` for restrictive mode. Rejected because local-first is the core philosophy.

### 2. Browser URL substitution for 0.0.0.0

When bound to `0.0.0.0`, the `open()` call replaces `//0.0.0.0` with `//localhost` in the URL. This ensures the local browser always navigates to a reachable address.

**Alternative considered:** Construct the browser URL independently from `os.networkInterfaces()`. Rejected as unnecessary complexity — the user's local browser should always use `localhost`.

### 3. No warning when exposing to network

We considered printing a security warning when `--host 0.0.0.0` is used. Decided against it because the README documents the intent and the user explicitly chose this option. The responsibility is clear.

## Risks / Trade-offs

- **[Risk]** Users may not realize that `--host 0.0.0.0` exposes their local OpenSpec files to all devices on the network → **Mitigation**: Default is local-only; README documents the behavior clearly
- **[Risk]** Fastify may return different URL formats in future versions → **Mitigation**: Simple string replacement on the `//0.0.0.0` pattern is stable across Fastify versions
