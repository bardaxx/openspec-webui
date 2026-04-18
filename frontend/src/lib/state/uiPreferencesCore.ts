export interface UiPreferences {
  previewTabsEnabled: boolean;
}

const STORAGE_KEY = 'openspec-ui-preferences';

interface UiPreferencesAdapter {
  get(): UiPreferences;
  set(preferences: UiPreferences): void;
}

export function createDefaultUiPreferences(): UiPreferences {
  return {
    previewTabsEnabled: true,
  };
}

function normalizeUiPreferences(value: unknown): UiPreferences {
  const defaults = createDefaultUiPreferences();

  if (!value || typeof value !== 'object') {
    return defaults;
  }

  const candidate = value as Partial<Record<keyof UiPreferences, unknown>>;

  return {
    previewTabsEnabled: typeof candidate.previewTabsEnabled === 'boolean'
      ? candidate.previewTabsEnabled
      : defaults.previewTabsEnabled,
  };
}

export function loadUiPreferences(): UiPreferences {
  if (typeof localStorage === 'undefined') {
    return createDefaultUiPreferences();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createDefaultUiPreferences();
    }

    return normalizeUiPreferences(JSON.parse(stored));
  } catch {
    return createDefaultUiPreferences();
  }
}

function saveUiPreferences(preferences: UiPreferences) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Ignore storage errors.
  }
}

export function createUiPreferencesStoreWithAdapter(adapter: UiPreferencesAdapter) {
  return {
    get previewTabsEnabled() {
      return adapter.get().previewTabsEnabled;
    },

    initialize() {
      adapter.set(loadUiPreferences());
    },

    setPreviewTabsEnabled(previewTabsEnabled: boolean) {
      const nextPreferences = {
        ...adapter.get(),
        previewTabsEnabled,
      };

      saveUiPreferences(nextPreferences);
      adapter.set(nextPreferences);
    },
  };
}

export function createUiPreferencesStore() {
  let preferences = loadUiPreferences();

  return createUiPreferencesStoreWithAdapter({
    get: () => preferences,
    set: (nextPreferences) => {
      preferences = nextPreferences;
    },
  });
}
