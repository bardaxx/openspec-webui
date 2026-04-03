import { get, writable } from 'svelte/store';
import { getCommandAvailability, type CommandAvailability } from '../lib/api';
import { EXPANDED_COMMANDS, type AiTool, type ExpandedCommand } from '../lib/commandTypes';

const STORAGE_KEY = 'openspec-command-preferences';

type ExpandedVisibility = Record<ExpandedCommand, boolean>;

export interface CommandPreferencesState {
  initialized: boolean;
  availabilityLoading: boolean;
  aiTool: AiTool;
  expandedVisibility: ExpandedVisibility;
  availability: CommandAvailability;
}

const defaultAvailability: CommandAvailability = {
  status: 'unavailable',
  profile: null,
  workflows: [],
  availableExpandedCommands: [],
  error: null,
};

function createDefaultExpandedVisibility(): ExpandedVisibility {
  return {
    new: true,
    continue: true,
    ff: true,
    verify: true,
    sync: true,
    'bulk-archive': true,
  };
}

function isAiTool(value: unknown): value is AiTool {
  return value === 'default' || value === 'claude-code';
}

function normalizeExpandedVisibility(value: unknown): ExpandedVisibility {
  const normalized = createDefaultExpandedVisibility();

  if (!value || typeof value !== 'object') {
    return normalized;
  }

  const candidate = value as Partial<Record<ExpandedCommand, unknown>>;
  for (const command of EXPANDED_COMMANDS) {
    if (typeof candidate[command] === 'boolean') {
      normalized[command] = candidate[command];
    }
  }

  return normalized;
}

function loadPreferences(): Pick<CommandPreferencesState, 'aiTool' | 'expandedVisibility'> {
  const defaults = {
    aiTool: 'default' as AiTool,
    expandedVisibility: createDefaultExpandedVisibility(),
  };

  if (typeof localStorage === 'undefined') {
    return defaults;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaults;
    }

    const parsed = JSON.parse(stored) as {
      aiTool?: unknown;
      expandedVisibility?: unknown;
    };

    return {
      aiTool: isAiTool(parsed.aiTool) ? parsed.aiTool : defaults.aiTool,
      expandedVisibility: normalizeExpandedVisibility(parsed.expandedVisibility),
    };
  } catch {
    return defaults;
  }
}

function savePreferences(state: Pick<CommandPreferencesState, 'aiTool' | 'expandedVisibility'>) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        aiTool: state.aiTool,
        expandedVisibility: state.expandedVisibility,
      })
    );
  } catch {
    // Ignore storage errors.
  }
}

function createCommandPreferencesStore() {
  const { subscribe, update } = writable<CommandPreferencesState>({
    initialized: false,
    availabilityLoading: false,
    aiTool: 'default',
    expandedVisibility: createDefaultExpandedVisibility(),
    availability: defaultAvailability,
  });

  async function refreshAvailability() {
    update((state) => ({
      ...state,
      availabilityLoading: true,
    }));

    try {
      const availability = await getCommandAvailability();
      update((state) => ({
        ...state,
        availability,
        availabilityLoading: false,
      }));
    } catch (error) {
      update((state) => ({
        ...state,
        availability: {
          status: 'unavailable',
          profile: null,
          workflows: [],
          availableExpandedCommands: [],
          error: error instanceof Error ? error.message : 'Failed to load command availability',
        },
        availabilityLoading: false,
      }));
    }
  }

  async function initialize() {
    if (get({ subscribe }).initialized) {
      return;
    }

    const preferences = loadPreferences();
    update((state) => ({
      ...state,
      initialized: true,
      aiTool: preferences.aiTool,
      expandedVisibility: preferences.expandedVisibility,
    }));

    await refreshAvailability();
  }

  function setAiTool(aiTool: AiTool) {
    update((state) => {
      const nextState = {
        ...state,
        aiTool,
      };
      savePreferences(nextState);
      return nextState;
    });
  }

  function setExpandedVisibility(command: ExpandedCommand, visible: boolean) {
    update((state) => {
      const nextState = {
        ...state,
        expandedVisibility: {
          ...state.expandedVisibility,
          [command]: visible,
        },
      };
      savePreferences(nextState);
      return nextState;
    });
  }

  return {
    subscribe,
    initialize,
    refreshAvailability,
    setAiTool,
    setExpandedVisibility,
  };
}

export const commandPreferencesStore = createCommandPreferencesStore();
