import { getLocale, getTextDirection, setLocale } from '$lib/paraglide/runtime.js';

import { createLocaleStoreWithAdapter, DEFAULT_LOCALE, type AppLocale } from './localeCore';

export { DEFAULT_LOCALE, LOCALE_LABELS, SUPPORTED_LOCALES, type AppLocale } from './localeCore';

export function createLocaleStore() {
  let value = $state<AppLocale>(DEFAULT_LOCALE);
  let version = $state(0);

  return createLocaleStoreWithAdapter(
    {
      getLocale: () => value,
      setLocale: (locale) => {
        value = locale;
      },
      getVersion: () => version,
      setVersion: (nextVersion) => {
        version = nextVersion;
      },
    },
    {
      getLocale,
      getTextDirection,
      setLocale,
    }
  );
}

export const localeStore = createLocaleStore();
