import { defineCustomClientStrategy } from '$lib/paraglide/runtime.js';

import {
  LOCALE_LABELS,
  loadStoredLocale,
  saveStoredLocale,
  type AppLocale,
} from '$lib/locale';
import { localeStore } from '$lib/state/locale.svelte.ts';

const CUSTOM_LOCALE_STRATEGY = 'custom-openspec-locale';

let strategyDefined = false;

export function defineAppLocaleStrategy() {
  if (strategyDefined || typeof window === 'undefined') {
    return;
  }

  defineCustomClientStrategy(CUSTOM_LOCALE_STRATEGY, {
    getLocale: () => loadStoredLocale() ?? undefined,
    setLocale: (locale) => {
      if (locale === 'en' || locale === 'ja') {
        saveStoredLocale(locale);
      }
    },
  });

  strategyDefined = true;
}

export function initializeLocaleSystem() {
  defineAppLocaleStrategy();
  return localeStore.initialize();
}

export function t<T extends (...args: any[]) => string>(message: T, ...args: Parameters<T>): string {
  localeStore.version;
  return message(...args);
}

export function getLocaleLabel(locale: AppLocale): string {
  return LOCALE_LABELS[locale];
}
