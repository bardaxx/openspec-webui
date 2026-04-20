import type { Project } from './types/api';
import { FIXED_LABELS } from './uiText';

export function getPlanningContextNotice(project: Pick<Project, 'migrationState'>, _localeVersion = 0): {
  variant: 'warning' | 'info' | null;
  title: string;
} {
  if (project.migrationState === 'migration-needed') {
    return {
      variant: 'warning',
      title: FIXED_LABELS.dashboard.migrationNeeded,
    };
  }

  if (project.migrationState === 'legacy-present') {
    return {
      variant: 'info',
      title: FIXED_LABELS.dashboard.legacyDetected,
    };
  }

  return {
    variant: null,
    title: '',
  };
}
