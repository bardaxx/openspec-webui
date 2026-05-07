import { getApiErrorMessage, runValidation } from '$lib/api';
import { projectStore } from '$lib/state/projects.svelte.ts';
import { tabStore } from '$lib/state/tabs.svelte.ts';
import type { ValidationItem } from '$lib/types/api';

import { createDefaultValidationState, createValidationController } from './validationCore';

const reactiveState = $state(createDefaultValidationState());

const controller = createValidationController({
  state: reactiveState,
  getProjectId: () => projectStore.activeProjectId,
  runValidation,
  getErrorMessage: (cause) => getApiErrorMessage(cause, 'Validation failed'),
});

export const validationStore = {
  get loading() {
    return controller.state.loading;
  },

  get error() {
    return controller.state.error;
  },

  get result() {
    return controller.state.result;
  },

  get latestRunAt() {
    return controller.state.latestRunAt;
  },

  get failedCount() {
    return controller.state.result?.summary.failed ?? 0;
  },

  reset(projectId?: string | null) {
    controller.reset(projectId);
  },

  syncProject() {
    return controller.syncProject();
  },

  refresh() {
    return controller.refresh();
  },

  openItem(item: ValidationItem, options?: { confirmed?: boolean }) {
    controller.syncProject();

    if ((item.type !== 'spec' && item.type !== 'change') || !item.name) {
      return false;
    }

    const path = item.type === 'spec'
      ? `/specs/${encodeURIComponent(item.name)}`
      : `/changes/${encodeURIComponent(item.name)}`;

    if (options?.confirmed) {
      tabStore.openConfirmed(path);
    } else {
      tabStore.openPreview(path);
    }

    return true;
  },
};
