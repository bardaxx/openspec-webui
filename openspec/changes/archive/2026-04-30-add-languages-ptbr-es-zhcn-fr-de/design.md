## Context

The OpenSpec WebUI uses `@inlang/paraglide-js` for compile-time i18n with a flat JSON catalog per locale. Currently `en` (base) and `ja` are supported. The translation pipeline is:

1. Source catalogs in `frontend/messages/{locale}.json`
2. Inlang config in `frontend/project.inlang/settings.json` declares `locales`
3. `npm run i18n:compile` generates Paraglide runtime in `frontend/src/lib/paraglide/`
4. `frontend/src/lib/locale.ts` exports `SUPPORTED_LOCALES`, `LOCALE_LABELS`, `normalizeLocaleTag()`, `isAppLocale()`
5. `frontend/src/lib/state/localeCore.ts` → `locale.svelte.ts` wires the store to Paraglide runtime
6. `frontend/index.html` bootstrap script matches `localStorage` / `navigator.languages` to locales
7. `SettingsModal.svelte` renders `<Select>` from `LOCALE_LABELS` and `localeStore.supportedLocales`

The existing infrastructure is locale-agnostic — adding a new language requires only:
- A new JSON catalog
- Registering the locale code in 3 places (`settings.json`, `locale.ts`, `index.html` bootstrap)
- Adding a native-language label to `LOCALE_LABELS`
- Ensuring the shared locale strategy persists any supported locale in `openspec-locale`

No new architecture is needed.

## Goals / Non-Goals

**Goals:**
- Add 5 locales: `pt-BR`, `es`, `zh-CN`, `fr`, `de`
- Translate all ~100 message keys from `en.json` into each language
- Make all new locales selectable from the Settings dialog
- Ensure browser-language auto-detection works for all new locales
- Keep the same compile-time Paraglide pipeline with no runtime changes

**Non-Goals:**
- No RTL language support (all 5 new locales are LTR)
- No server-side rendering or locale-based routing changes
- No changes to `FIXED_LABELS` in `uiText.ts` (those stay English intentionally)
- No machine-translation pipeline or automated translation CI step
- No new UI components or architectural changes

## Decisions

### Decision 1: Paraglide locale codes use BCP 47 with hyphens

**Choice**: Use `pt-BR`, `zh-CN` (with hyphens) as Paraglide locale identifiers.

**Rationale**: Paraglide and browser `navigator.language` both use BCP 47 format. Using `pt-BR` (not `pt`) avoids ambiguity with European Portuguese and matches the OpenSpec upstream documentation. Similarly `zh-CN` distinguishes Simplified Chinese.

**Alternative considered**: `pt`, `zh` — rejected because less specific and doesn't match browser preferences accurately.

### Decision 2: All locales are LTR

**Choice**: All 5 new locales use `dir="ltr"`. No changes to text-direction logic.

**Rationale**: Portuguese, Spanish, Chinese, French, and German are all LTR languages. The existing `syncDocumentLocale(locale, 'ltr')` default works unchanged.

### Decision 3: Translation catalogs are human-authored

**Choice**: Create initial translations as human-quality JSON files. Accept that some entries may need community review.

**Rationale**: The existing `ja.json` already has accepted gaps where English strings appear. The same approach applies: better to ship with good-faith translations and iterate than block on perfection.

### Decision 4: `normalizeLocaleTag()` handles regional variants

**Choice**: Extend `normalizeLocaleTag()` to map regional variants to the canonical code (e.g., `es-419` → `es`, `fr-CA` → `fr`, `zh-TW` → `zh-CN`).

**Rationale**: Users with `es-MX`, `fr-CA`, or `zh-HK` browser settings should still get the closest match. The existing pattern (`startsWith('ja-')`) extends naturally.

### Decision 5: Single-step catalog + config update

**Choice**: Each language addition is a single commit scope: JSON catalog + config registration + label update.

**Rationale**: Keeps the change atomic and testable. The `i18n:compile` build step will fail fast if config and catalogs are out of sync.

### Decision 6: Persist any supported locale through the browser storage key

**Choice**: The custom locale strategy writes any supported `AppLocale` selected in Settings to `openspec-locale`, so `pt-BR`, `es`, `zh-CN`, `fr`, and `de` survive reloads just like `en` and `ja`.

**Rationale**: The added languages are first-class user choices, so persistence must round-trip the exact locale the operator picked. Limiting persistence to a subset would cause newly added locales to reset on refresh.

## Risks / Trade-offs

- **[Translation quality]** → Initial translations may have imperfect phrasing. Mitigation: accept gaps like `ja.json` does; community contributions can refine later.
- **[Bundle size]** → 5 additional JSON catalogs (~100 keys each ≈ ~15KB total uncompressed). Negligible impact since Paraglide compiles only used messages.
- **[Maintenance burden]** → Each new UI message key must be translated in 7 locales instead of 2. Mitigation: base-locale fallback means missing translations degrade gracefully to English.
- **[Chinese Simplified vs Traditional]** → `zh-CN` covers Simplified Chinese only. Traditional Chinese (`zh-TW`) users get Simplified via `normalizeLocaleTag` mapping, which may not be ideal. Mitigation: can add `zh-TW` as a future locale if demand exists.
