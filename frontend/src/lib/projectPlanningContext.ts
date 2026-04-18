import type { Project } from './types/api';

export function getPlanningContextNotice(project: Pick<Project, 'migrationState'>): {
  variant: 'warning' | 'info' | null;
  title: string;
} {
  if (project.migrationState === 'migration-needed') {
    return {
      variant: 'warning',
      title: 'Migration needed',
    };
  }

  if (project.migrationState === 'legacy-present') {
    return {
      variant: 'info',
      title: 'Legacy project.md detected',
    };
  }

  return {
    variant: null,
    title: '',
  };
}
