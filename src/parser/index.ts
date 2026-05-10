import { stat } from 'fs/promises';
import type {
  Project,
  Spec,
  Change,
  Stats,
  SearchResult,
  SearchMatchSource,
  ParseResult,
} from '../shared/types.js';
import { parseProject } from './project.js';
import { parseSpecs, parseSpec } from './specs.js';
import { parseChanges, parseChangeByName } from './changes.js';

export interface OpenSpecData {
  project: Project;
  specs: Spec[];
  changes: {
    active: Change[];
    archived: Change[];
  };
  stats: Stats;
}

interface SearchableDocument {
  type: SearchResult['type'];
  name: string;
  path: string;
  content: string | null;
  metadata: Array<{
    source: Exclude<SearchMatchSource, 'content'>;
    searchValue: string;
    previewValue: string;
  }>;
}

/**
 * Parse an entire OpenSpec directory
 */
export async function parseOpenSpec(openspecPath: string): Promise<ParseResult<OpenSpecData>> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate path exists
  try {
    const stats = await stat(openspecPath);
    if (!stats.isDirectory()) {
      return {
        data: null,
        errors: [`${openspecPath} is not a directory`],
        warnings: [],
      };
    }
  } catch (error) {
    return {
      data: null,
      errors: [`OpenSpec directory not found: ${openspecPath}`],
      warnings: [],
    };
  }

  // Parse all components
  const [projectResult, specsResult, changesResult] = await Promise.all([
    parseProject(openspecPath),
    parseSpecs(openspecPath),
    parseChanges(openspecPath),
  ]);

  errors.push(...projectResult.errors, ...specsResult.errors, ...changesResult.errors);
  warnings.push(...projectResult.warnings, ...specsResult.warnings, ...changesResult.warnings);

  if (!projectResult.data || !specsResult.data || !changesResult.data) {
    return { data: null, errors, warnings };
  }

  // Calculate stats
  const stats = calculateStats(specsResult.data, changesResult.data);

  return {
    data: {
      project: projectResult.data,
      specs: specsResult.data,
      changes: changesResult.data,
      stats,
    },
    errors,
    warnings,
  };
}

/**
 * Calculate overall statistics
 */
function calculateStats(
  specs: Spec[],
  changes: { active: Change[]; archived: Change[] }
): Stats {
  // Calculate overall task progress from active changes
  let totalDone = 0;
  let totalTasks = 0;

  for (const change of changes.active) {
    totalDone += change.taskProgress.done;
    totalTasks += change.taskProgress.total;
  }

  return {
    totalSpecs: specs.length,
    activeChanges: changes.active.length,
    archivedChanges: changes.archived.length,
    overallTaskProgress: {
      done: totalDone,
      total: totalTasks,
      percentage: totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0,
    },
  };
}

/**
 * Search across all OpenSpec content
 */
export function searchOpenSpec(data: OpenSpecData, query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const normalizedQuery = normalizeSearchText(query);

  const projectResult = searchDocument(
    {
      type: 'project',
      name: data.project.name,
      path: data.project.path,
      content: data.project.content,
      metadata: [
        {
          source: 'path',
          searchValue: [data.project.path, 'openspec/config.yaml'].join('\n'),
          previewValue: 'openspec/config.yaml',
        },
      ],
    },
    normalizedQuery
  );

  if (projectResult) {
    results.push(projectResult);
  }

  for (const spec of data.specs) {
    const specResult = searchDocument(
      {
        type: 'spec',
        name: spec.name,
        path: spec.path,
        content: spec.specContent,
        metadata: [
          {
            source: 'path',
            searchValue: [spec.path, `openspec/specs/${spec.name}/spec.md`].join('\n'),
            previewValue: `openspec/specs/${spec.name}/spec.md`,
          },
        ],
      },
      normalizedQuery
    );

    if (specResult) {
      results.push(specResult);
    }
  }

  const allChanges = [...data.changes.active, ...data.changes.archived];
  for (const change of allChanges) {
    const relativeProposalPath = change.isArchived
      ? `openspec/changes/archive/${change.name}/proposal.md`
      : `openspec/changes/${change.name}/proposal.md`;

    const changeResult = searchDocument(
      {
        type: 'change',
        name: change.name,
        path: change.path,
        content: change.proposal,
        metadata: [
          {
            source: 'path',
            searchValue: [change.path, relativeProposalPath].join('\n'),
            previewValue: relativeProposalPath,
          },
        ],
      },
      normalizedQuery
    );

    if (changeResult) {
      results.push(changeResult);
    }
  }

  return results;
}

function searchDocument(document: SearchableDocument, normalizedQuery: string): SearchResult | null {
  const content = document.content ?? '';

  if (content.length > 0 && normalizeSearchText(content).includes(normalizedQuery)) {
    return {
      type: document.type,
      name: document.name,
      path: document.path,
      excerpt: getExcerpt(content, normalizedQuery),
      matchLine: findMatchLine(content, normalizedQuery),
      matchSource: 'content',
    };
  }

  if (normalizeSearchText(document.name).includes(normalizedQuery)) {
    return {
      type: document.type,
      name: document.name,
      path: document.path,
      excerpt: document.name,
      matchLine: 0,
      matchSource: 'name',
    };
  }

  const metadataMatch = document.metadata.find((candidate) =>
    normalizeSearchText(candidate.searchValue).includes(normalizedQuery)
  );

  if (!metadataMatch) {
    return null;
  }

  return {
    type: document.type,
    name: document.name,
    path: document.path,
    excerpt: metadataMatch.previewValue,
    matchLine: 0,
    matchSource: metadataMatch.source,
  };
}

function normalizeSearchText(value: string): string {
  return value.toLowerCase().replaceAll('\\', '/');
}

/**
 * Find the line number of first match
 */
function findMatchLine(content: string, query: string): number {
  const lowerContent = content.toLowerCase();
  const index = lowerContent.indexOf(query);
  if (index === -1) return 0;

  const beforeMatch = content.substring(0, index);
  return beforeMatch.split('\n').length;
}

/**
 * Get an excerpt around the match
 */
function getExcerpt(content: string, query: string): string {
  const lowerContent = content.toLowerCase();
  const index = lowerContent.indexOf(query);
  if (index === -1) return content.substring(0, 100) + '...';

  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 50);

  let excerpt = content.substring(start, end);
  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';

  return excerpt.replace(/\n/g, ' ');
}

// Re-export individual parsers for targeted updates
export { parseProject } from './project.js';
export { parseSpecs, parseSpec } from './specs.js';
export { parseChanges, parseChangeByName } from './changes.js';
export { parseTasks } from './tasks.js';
