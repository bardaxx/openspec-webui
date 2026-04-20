import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import {
  LOCALE_STORAGE_KEY,
  loadStoredLocale,
  resolveBootstrapLocale,
  resolvePreferredLocale,
  saveStoredLocale,
} from './locale';

class MockStorage {
  #values = new Map<string, string>();

  constructor(initialValues: Record<string, string> = {}) {
    for (const [key, value] of Object.entries(initialValues)) {
      this.#values.set(key, value);
    }
  }

  getItem(key: string) {
    return this.#values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.#values.set(key, String(value));
  }
}

function installNavigatorMock(navigatorValue: Pick<Navigator, 'language' | 'languages'>) {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: navigatorValue,
  });
}

afterEach(() => {
  delete (globalThis as { localStorage?: Storage }).localStorage;
  delete (globalThis as { navigator?: Navigator }).navigator;
});

test('saveStoredLocale and loadStoredLocale persist supported locales', () => {
  const localStorage = new MockStorage();
  Object.assign(globalThis, { localStorage });

  saveStoredLocale('ja');

  assert.equal(localStorage.getItem(LOCALE_STORAGE_KEY), 'ja');
  assert.equal(loadStoredLocale(), 'ja');
});

test('resolveBootstrapLocale prefers stored locale over browser locale', () => {
  Object.assign(globalThis, {
    localStorage: new MockStorage({
      [LOCALE_STORAGE_KEY]: 'ja-JP',
    }),
  });
  installNavigatorMock({
    language: 'en-US',
    languages: ['en-US'],
  });

  assert.equal(resolveBootstrapLocale(), 'ja');
});

test('resolvePreferredLocale falls back from browser preferences to en', () => {
  installNavigatorMock({
    language: 'fr-FR',
    languages: ['fr-FR', 'de-DE'],
  });

  assert.equal(resolvePreferredLocale(), 'en');
  assert.equal(resolveBootstrapLocale(), 'en');
});
