import type { ValidationResult } from '$lib/types/api';

export interface ValidationState {
  projectId: string | null;
  loading: boolean;
  result: ValidationResult | null;
  error: string | null;
  latestRunAt: string | null;
}

export type ValidationDashboardState = 'not-run' | 'running' | 'passed' | 'failed' | 'unknown';
export type ValidationDashboardIconVariant = 'info' | 'success' | 'muted' | 'warning' | 'danger';

export interface ValidationDashboardCopy {
  notRunPrimaryValue: string;
  notRunDescription: string;
  runningPrimaryValue: string;
  runningDescription: string;
  passedPrimaryValue: string;
  passedDescription: (lastRun: string | null) => string;
  failedPrimaryValue: (failedCount: number) => string;
  failedDescription: (failedCount: number, lastRun: string | null) => string;
  unknownPrimaryValue: string;
  unknownDescription: (error: string | null) => string;
}

export interface ValidationDashboardSummary {
  state: ValidationDashboardState;
  primaryValue: string;
  description: string;
  failedCount: number;
  iconVariant: ValidationDashboardIconVariant;
}

export interface ValidationDashboardSummaryOptions {
  copy: ValidationDashboardCopy;
  formatLastRun?: (runAt: string | null) => string | null;
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

export function deriveValidationDashboardSummary(
  state: Pick<ValidationState, 'loading' | 'result' | 'error' | 'latestRunAt'>,
  options: ValidationDashboardSummaryOptions,
): ValidationDashboardSummary {
  const { copy, formatLastRun } = options;
  const failedCount = state.result?.summary.failed ?? 0;
  const lastRunSource = state.latestRunAt ?? state.result?.runAt ?? null;
  const lastRun = formatLastRun ? formatLastRun(lastRunSource) : lastRunSource;

  if (state.loading) {
    return {
      state: 'running',
      primaryValue: copy.runningPrimaryValue,
      description: copy.runningDescription,
      failedCount: 0,
      iconVariant: 'warning',
    };
  }

  if (!state.result) {
    if (state.error) {
      return {
        state: 'unknown',
        primaryValue: copy.unknownPrimaryValue,
        description: copy.unknownDescription(state.error),
        failedCount: 0,
        iconVariant: 'warning',
      };
    }

    return {
      state: 'not-run',
      primaryValue: copy.notRunPrimaryValue,
      description: copy.notRunDescription,
      failedCount: 0,
      iconVariant: 'muted',
    };
  }

  if (state.result.status === 'failed' || failedCount > 0) {
    return {
      state: 'failed',
      primaryValue: copy.failedPrimaryValue(failedCount),
      description: copy.failedDescription(failedCount, lastRun),
      failedCount,
      iconVariant: 'danger',
    };
  }

  return {
    state: 'passed',
    primaryValue: copy.passedPrimaryValue,
    description: copy.passedDescription(lastRun),
    failedCount: 0,
    iconVariant: 'success',
  };
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
