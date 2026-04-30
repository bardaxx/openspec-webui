## Why

The OpenSpec official documentation showcases six language examples (Portuguese-BR, Spanish, Chinese-Simplified, Japanese, French, German). The WebUI currently supports only English and Japanese. Adding the remaining five languages aligns the WebUI with the upstream documentation's language coverage and broadens accessibility for a global user base without requiring new infrastructure — the existing Paraglide i18n pipeline already supports adding locales by creating JSON catalogs and updating configuration.

## What Changes

- Add five new locale catalogs: `pt-BR`, `es`, `zh-CN`, `fr`, `de` under `frontend/messages/`
- Register the new locales in `frontend/project.inlang/settings.json`
- Update the language switcher in Settings to display native labels for each new locale
- Translate all existing message keys from `en.json` into each new language
- Update the locale store and bootstrap script to recognize the new locale codes for browser-language matching
- Persist any selected supported locale across reloads via the shared `openspec-locale` storage key

## Capabilities

### New Capabilities

(none — this change extends an existing capability)

### Modified Capabilities

- `ui-localization`: Extend supported locales from `{en, ja}` to `{en, ja, pt-BR, es, zh-CN, fr, de}`. The language switcher, locale resolution strategy, and document semantics requirements are updated to cover the additional locales.

## Impact

- **Translation catalogs**: Five new JSON files in `frontend/messages/`
- **Configuration**: `frontend/project.inlang/settings.json` (locale list)
- **UI**: `frontend/src/lib/components/layout/SettingsModal.svelte` (language options)
- **Locale infrastructure**: `frontend/src/lib/locale.ts` (locale display names, direction mapping)
- **Locale persistence**: `frontend/src/lib/i18n.ts` (custom locale strategy storage)
- **Bootstrap**: `frontend/index.html` (language-to-locale matching)
- **Build**: `npm run i18n:compile` will generate additional Paraglide runtime modules
- **No breaking changes**: Existing `en` and `ja` behavior is unaffected
