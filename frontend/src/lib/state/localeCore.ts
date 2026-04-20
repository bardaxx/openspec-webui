import {
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  syncDocumentLocale,
  type AppLocale,
  normalizeLocaleTag,
} from '../locale';

export { DEFAULT_LOCALE, LOCALE_LABELS, SUPPORTED_LOCALES, type AppLocale } from '../locale';

export interface LocaleAdapter {
  getLocale(): AppLocale;
  setLocale(locale: AppLocale): void;
  getVersion(): number;
  setVersion(version: number): void;
}

export interface LocaleRuntimeAdapter {
  getLocale(): string;
  setLocale(locale: AppLocale, options?: { reload?: boolean }): Promise<void> | void;
  getTextDirection(locale?: string): 'ltr' | 'rtl';
}

export function normalizeRuntimeLocale(locale: string | null | undefined): AppLocale {
  return normalizeLocaleTag(locale) ?? DEFAULT_LOCALE;
}

export function createLocaleStoreWithAdapter(adapter: LocaleAdapter, runtime: LocaleRuntimeAdapter) {
  let initialized = false;

  function applyLocale(locale: AppLocale) {
    adapter.setLocale(locale);
    adapter.setVersion(adapter.getVersion() + 1);
    syncDocumentLocale(locale, runtime.getTextDirection(locale));
  }

  return {
    get initialized() {
      return initialized;
    },

    get value() {
      return adapter.getLocale();
    },

    get version() {
      return adapter.getVersion();
    },

    get supportedLocales() {
      return SUPPORTED_LOCALES;
    },

    get currentLabel() {
      return LOCALE_LABELS[adapter.getLocale()];
    },

    initialize() {
      const locale = normalizeRuntimeLocale(runtime.getLocale());
      applyLocale(locale);
      initialized = true;
      return locale;
    },

    syncFromRuntime() {
      const locale = normalizeRuntimeLocale(runtime.getLocale());
      applyLocale(locale);
      initialized = true;
      return locale;
    },

    async setLocale(locale: AppLocale) {
      if (initialized && adapter.getLocale() === locale) {
        return locale;
      }

      await runtime.setLocale(locale, { reload: false });
      applyLocale(locale);
      initialized = true;
      return locale;
    },
  };
}
