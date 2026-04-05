import { writable, get } from 'svelte/store';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'openspec-theme';

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;

  if (theme === 'system') {
    // Remove data-theme so the @media (prefers-color-scheme) CSS handles it
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

function loadTheme(): Theme {
  if (typeof localStorage === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // Ignore storage errors
  }
  return 'dark';
}

function saveTheme(theme: Theme) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

export function createThemeStore() {
  const internal = writable<Theme>(loadTheme());
  const { subscribe, set } = internal;

  let mediaQuery: MediaQueryList | null = null;
  let mediaHandler: ((e: MediaQueryListEvent) => void) | null = null;

  function initialize() {
    const theme = loadTheme();
    set(theme);
    applyTheme(theme);

    // Keep System mode aligned with browser theme change events.
    // Visual resolution is still handled by the CSS media query.
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaHandler = () => {
      if (get(internal) === 'system') {
        // Ensure any explicit theme attribute stays cleared while System mode is active.
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', mediaHandler);
  }

  function setTheme(theme: Theme) {
    saveTheme(theme);
    set(theme);
    applyTheme(theme);
  }

  function destroy() {
    if (mediaQuery && mediaHandler) {
      mediaQuery.removeEventListener('change', mediaHandler);
    }
  }

  return { subscribe, initialize, setTheme, destroy };
}

export const themeStore = createThemeStore();
