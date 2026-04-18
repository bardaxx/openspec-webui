import {
  createUiPreferencesStoreWithAdapter,
  loadUiPreferences,
  type UiPreferences,
} from './uiPreferencesCore';

export type { UiPreferences } from './uiPreferencesCore';

export function createUiPreferencesStore() {
  let value = $state<UiPreferences>(loadUiPreferences());

  return createUiPreferencesStoreWithAdapter({
    get: () => value,
    set: (preferences) => {
      value = preferences;
    },
  });
}

export const uiPreferencesStore = createUiPreferencesStore();
