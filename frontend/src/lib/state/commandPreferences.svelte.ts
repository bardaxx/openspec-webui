import { getCommandAvailability } from '$lib/api';
import type { CommandAvailability } from '$lib/types/api';
import type { WorkflowCommand } from '$lib/types/commandTypes';

import {
  createCommandPreferencesStoreWithAdapter,
  loadCommandPreferences,
  type CommandFormat,
  type CommandPreferences,
  type CommandVisibility,
} from './commandPreferencesCore';

export type { CommandFormat, CommandPreferences, CommandVisibility } from './commandPreferencesCore';

export interface CommandPreferencesState {
  initialized: boolean;
  availabilityLoading: boolean;
  format: CommandFormat;
  commandVisibility: CommandVisibility;
  availability: CommandAvailability;
}

const defaultAvailability: CommandAvailability = {
  status: 'unavailable',
  profile: null,
  workflows: [],
  availableExpandedCommands: [],
  error: null,
};

function createCommandPreferencesStore() {
  let initialized = $state(false);
  let availabilityLoading = $state(false);
  let availability = $state<CommandAvailability>(defaultAvailability);
  let preferences = $state<CommandPreferences>(loadCommandPreferences());

  const preferencesStore = createCommandPreferencesStoreWithAdapter({
    get: () => preferences,
    set: (nextPreferences) => {
      preferences = nextPreferences;
    },
  });

  async function refreshAvailability() {
    availabilityLoading = true;

    try {
      availability = await getCommandAvailability();
    } catch (cause) {
      availability = {
        status: 'unavailable',
        profile: null,
        workflows: [],
        availableExpandedCommands: [],
        error: cause instanceof Error ? cause.message : 'Failed to load command availability',
      };
    } finally {
      availabilityLoading = false;
    }
  }

  return {
    get initialized() {
      return initialized;
    },

    get availabilityLoading() {
      return availabilityLoading;
    },

    get format() {
      return preferencesStore.format;
    },

    get commandVisibility() {
      return preferencesStore.commandVisibility;
    },

    get availability() {
      return availability;
    },

    async initialize() {
      if (initialized) {
        return;
      }

      initialized = true;
      preferencesStore.initialize();

      await refreshAvailability();
    },

    refreshAvailability,

    setFormat(format: CommandFormat) {
      preferencesStore.setFormat(format);
    },

    setCommandVisibility(command: WorkflowCommand, visible: boolean) {
      preferencesStore.setCommandVisibility(command, visible);
    },
  };
}

export const commandPreferencesStore = createCommandPreferencesStore();
