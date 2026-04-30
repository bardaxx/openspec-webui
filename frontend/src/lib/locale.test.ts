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
      [LOCALE_STORAGE_KEY]: 'fr-FR',
    }),
  });
  installNavigatorMock({
    language: 'en-US',
    languages: ['en-US'],
  });

  assert.equal(resolveBootstrapLocale(), 'fr');
});

test('resolvePreferredLocale normalizes supported regional browser variants', () => {
  const cases = [
    { input: 'es-MX', expected: 'es' },
    { input: 'fr-FR', expected: 'fr' },
    { input: 'zh-Hans-CN', expected: 'zh-CN' },
    { input: 'de-DE', expected: 'de' },
    { input: 'pt-PT', expected: 'pt-BR' },
    { input: 'pt-BR', expected: 'pt-BR' },
  ] as const;

  for (const { input, expected } of cases) {
    installNavigatorMock({
      language: input,
      languages: [input],
    });

    assert.equal(resolvePreferredLocale(), expected);
  }
});

test('resolveBootstrapLocale normalizes supported stored regional variants', () => {
  const cases = [
    { input: 'es-MX', expected: 'es' },
    { input: 'fr-FR', expected: 'fr' },
    { input: 'zh-Hans-CN', expected: 'zh-CN' },
    { input: 'de-DE', expected: 'de' },
    { input: 'pt-PT', expected: 'pt-BR' },
    { input: 'pt-BR', expected: 'pt-BR' },
  ] as const;

  for (const { input, expected } of cases) {
    Object.assign(globalThis, {
      localStorage: new MockStorage({
        [LOCALE_STORAGE_KEY]: input,
      }),
    });
    installNavigatorMock({
      language: 'en-US',
      languages: ['en-US'],
    });

    assert.equal(resolveBootstrapLocale(), expected);
  }
});

test('resolvePreferredLocale falls back from unsupported browser preferences to en', () => {
  installNavigatorMock({
    language: 'it-IT',
    languages: ['it-IT', 'nl-NL'],
  });

  assert.equal(resolvePreferredLocale(), 'en');
  assert.equal(resolveBootstrapLocale(), 'en');
});
