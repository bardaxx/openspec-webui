import type { ValidationResult } from '$lib/types/api';

export interface ValidationState {
  projectId: string | null;
  loading: boolean;
  result: ValidationResult | null;
  error: string | null;
  latestRunAt: string | null;
}

export interface ValidationControllerDependencies {
  /** Optional external state object. When provided (e.g. a Svelte $state proxy), mutations trigger reactivity. */
  state?: ValidationState;
  getProjectId: () => string | null;
  runValidation: () => Promise<ValidationResult>;
  getErrorMessage?: (cause: unknown) => string;
}

export interface ValidationController {
  readonly state: ValidationState;
  syncProject(): boolean;
  refresh(): Promise<ValidationResult | null>;
  reset(projectId?: string | null): void;
}

export function createDefaultValidationState(): ValidationState {
  return {
    projectId: null,
    loading: false,
    result: null,
    error: null,
    latestRunAt: null,
  };
}

export function createValidationRequestTracker() {
  let currentToken = 0;

  return {
    beginRequest() {
      currentToken += 1;
      return currentToken;
    },
    isCurrent(token: number) {
      return token === currentToken;
    },
    invalidate() {
      currentToken += 1;
      return currentToken;
    },
  };
}

export function shouldResetValidationState(currentProjectId: string | null, nextProjectId: string | null): boolean {
  return currentProjectId !== nextProjectId;
}

export function createValidationController(
  dependencies: ValidationControllerDependencies
): ValidationController {
  const state = dependencies.state ?? createDefaultValidationState();
  const requestTracker = createValidationRequestTracker();

  function reset(projectId = dependencies.getProjectId()) {
    state.projectId = projectId;
    state.loading = false;
    state.result = null;
    state.error = null;
    state.latestRunAt = null;
    requestTracker.invalidate();
  }

  function syncProject() {
    const nextProjectId = dependencies.getProjectId();
    if (!shouldResetValidationState(state.projectId, nextProjectId)) {
      return false;
    }

    reset(nextProjectId);
    return true;
  }

  async function refresh() {
    const projectId = dependencies.getProjectId();
    syncProject();

    if (!projectId) {
      state.loading = false;
      state.error = 'No active project selected';
      return null;
    }

    const token = requestTracker.beginRequest();
    state.projectId = projectId;
    state.loading = true;
    state.error = null;

    try {
      const result = await dependencies.runValidation();

      if (!requestTracker.isCurrent(token) || dependencies.getProjectId() !== projectId) {
        return null;
      }

      state.result = result;
      state.latestRunAt = result.runAt;
      return result;
    } catch (cause) {
      if (!requestTracker.isCurrent(token) || dependencies.getProjectId() !== projectId) {
        return null;
      }

      state.error = dependencies.getErrorMessage?.(cause) ?? (cause instanceof Error ? cause.message : 'Validation failed');
      return null;
    } finally {
      if (requestTracker.isCurrent(token) && dependencies.getProjectId() === projectId) {
        state.loading = false;
      }
    }
  }

  return {
    get state() {
      return state;
    },
    syncProject,
    refresh,
    reset,
  };
}
