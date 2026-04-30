## 1. Locale Infrastructure

- [x] 1.1 Register 5 new locales in `frontend/project.inlang/settings.json`: add `pt-BR`, `es`, `zh-CN`, `fr`, `de` to the `locales` array
- [x] 1.2 Update `SUPPORTED_LOCALES` and `LOCALE_LABELS` in `frontend/src/lib/locale.ts` with new locale codes and native-language labels (`Português (Brasil)`, `Español`, `简体中文`, `Français`, `Deutsch`)
- [x] 1.3 Extend `normalizeLocaleTag()` in `frontend/src/lib/locale.ts` to match regional variants: `es-*` → `es`, `fr-*` → `fr`, `zh-*` → `zh-CN`, `de-*` → `de`, `pt-*` → `pt-BR`
- [x] 1.4 Update the bootstrap `normalizeLocale()` function in `frontend/index.html` to match the same regional variant logic as `locale.ts`

## 2. Translation Catalogs

- [x] 2.1 Create `frontend/messages/pt-BR.json` with Brazilian Portuguese translations for all keys from `en.json`
- [x] 2.2 Create `frontend/messages/es.json` with Spanish translations for all keys from `en.json`
- [x] 2.3 Create `frontend/messages/zh-CN.json` with Simplified Chinese translations for all keys from `en.json`
- [x] 2.4 Create `frontend/messages/fr.json` with French translations for all keys from `en.json`
- [x] 2.5 Create `frontend/messages/de.json` with German translations for all keys from `en.json`

## 3. Build and Verification

- [x] 3.1 Run `npm run i18n:compile` and verify the Paraglide runtime generates correctly for all 7 locales
- [x] 3.2 Run the full build (`npm run build`) and confirm no compilation errors
- [x] 3.3 Verify each locale renders correctly in the Settings language switcher and throughout the UI
- [x] 3.4 Verify browser-language auto-detection works for each new locale (test with `navigator.language` values like `es-MX`, `fr-FR`, `zh-Hans-CN`, `de-DE`, `pt-BR`)
- [x] 3.5 Verify selected locale persists across reload via the `openspec-locale` storage key for every supported locale, including `pt-BR`, `es`, `zh-CN`, `fr`, and `de`
