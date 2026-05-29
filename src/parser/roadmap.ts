import { readFile } from 'fs/promises';
import { join } from 'path';
import type {
  ParseResult,
  Roadmap,
  RoadmapDependency,
  RoadmapProgressEntry,
  RoadmapSlice,
  RoadmapSliceStatus,
} from '../shared/types.js';

const SECTION_HEADINGS = [
  'How To Use This Roadmap',
  'Status Model',
  'Parallelism and WIP limits',
  'Spec verification gate (mandatory)',
  'Slices',
  'Dependencies',
  'Recommended Execution Order',
  'Compacted history',
  'Post-implementation reality check',
] as const;

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n/g, '\n');
}

function trimCodeTicks(value: string): string {
  return value.replace(/^`+|`+$/g, '').trim();
}

function extractSection(content: string, heading: string): string {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`^## ${escapedHeading}\\n([\\s\\S]*)`, 'm'));
  if (!match) {
    return '';
  }

  const body = match[1] ?? '';
  const nextHeading = body.search(/^## /m);
  return (nextHeading >= 0 ? body.slice(0, nextHeading) : body).trim();
}

function extractListItems(section: string): string[] {
  return section
    .split('\n')
    .map((line) => {
      const match = line.match(/^\d+\.\s+(.+)$/) ?? line.match(/^-\s+(.+)$/);
      return match?.[1]?.trim() ?? '';
    })
    .filter((line) => line.length > 0);
}

function extractValue(block: string, label: string): string {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(new RegExp(`^${escapedLabel}:\\s*(.+)$`, 'm'));
  return trimCodeTicks(match?.[1] ?? '');
}

function extractBulletValues(block: string, label: string): string[] {
  const labelPrefix = `${label}:\n`;
  const labelIndex = block.indexOf(labelPrefix);
  if (labelIndex < 0) {
    return [];
  }

  const tail = block.slice(labelIndex + labelPrefix.length);
  const boundary = tail.search(/\n(?:[A-Z][^\n]+:|### )/);
  const section = (boundary >= 0 ? tail.slice(0, boundary) : tail).trimEnd();
  return section
    .split('\n')
    .map((line) => line.match(/^-\s+(.+)$/)?.[1]?.trim() ?? '')
    .filter((line) => line.length > 0)
    .map(trimCodeTicks);
}

function extractProgress(block: string): RoadmapProgressEntry[] {
  const progressStart = block.indexOf('Progress:\n');
  if (progressStart < 0) {
    return [];
  }

  const tail = block.slice(progressStart + 'Progress:\n'.length);
  const boundary = tail.search(/\n(?:### |[A-Z][^\n]+:)/);
  const section = (boundary >= 0 ? tail.slice(0, boundary) : tail).trimEnd();

  return section
    .split('\n')
    .map((line) => {
      const match = line.match(/^-\s+([^:]+):\s*(.+)$/);
      if (!match) {
        return null;
      }

      const value = trimCodeTicks(match[2]);
      return {
        label: match[1].trim(),
        value,
        pending: value.toLowerCase() === 'pending',
      } satisfies RoadmapProgressEntry;
    })
    .filter((entry): entry is RoadmapProgressEntry => entry !== null);
}

function parseSliceBlock(block: string): RoadmapSlice | null {
  const titleMatch = block.match(/^###\s+([A-Z0-9-]+)\s+-\s+(.+)$/m);
  if (!titleMatch) {
    return null;
  }

  return {
    id: titleMatch[1].trim(),
    title: titleMatch[2].trim(),
    status: extractValue(block, 'Status') as RoadmapSliceStatus,
    goal: extractValue(block, 'Goal'),
    candidateChangeId: extractValue(block, 'Candidate OpenSpec change id'),
    specLink: extractValue(block, 'Spec link'),
    files: extractBulletValues(block, 'Files'),
    notes: extractValue(block, 'Notes'),
    progress: extractProgress(block),
    dependency: null,
  };
}

function parseDependencyBlock(block: string): RoadmapDependency | null {
  const headingMatch = block.match(/^###\s+([A-Z0-9-]+)$/m);
  if (!headingMatch) {
    return null;
  }

  const parseListValue = (label: string) => {
    const value = extractValue(block, label);
    if (!value || value.toLowerCase() === 'none') {
      return [];
    }

    return value.split(',').map((entry) => entry.trim()).filter((entry) => entry.length > 0);
  };

  const parallelValue = extractValue(block, 'Can run in parallel').toLowerCase();

  return {
    sliceId: headingMatch[1].trim(),
    dependsOn: parseListValue('Depends on'),
    blocks: parseListValue('Blocks'),
    canRunInParallel: parallelValue === 'yes' ? true : parallelValue === 'no' ? false : null,
  };
}

function extractSubsections(section: string): string[] {
  return section
    .split(/(?=^### )/m)
    .map((block) => block.trim())
    .filter((block) => block.startsWith('### '));
}

function attachDependencies(
  slices: RoadmapSlice[],
  dependencies: RoadmapDependency[],
): RoadmapSlice[] {
  const dependencyBySliceId = new Map(dependencies.map((dependency) => [dependency.sliceId, dependency]));
  return slices.map((slice) => ({
    ...slice,
    dependency: dependencyBySliceId.get(slice.id) ?? null,
  }));
}

export async function parseRoadmap(openspecPath: string): Promise<ParseResult<Roadmap | null>> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const roadmapPath = join(openspecPath, 'roadmap.md');

  try {
    const rawContent = normalizeLineEndings(await readFile(roadmapPath, 'utf-8'));
    const slicesSection = extractSection(rawContent, 'Slices');
    const dependenciesSection = extractSection(rawContent, 'Dependencies');
    const compactedHistorySection = extractSection(rawContent, 'Compacted history');
    const postImplementationSection = extractSection(rawContent, 'Post-implementation reality check');

    const sliceBlocks = extractSubsections(slicesSection);
    const dependencyBlocks = extractSubsections(dependenciesSection);

    const slices = sliceBlocks
      .map(parseSliceBlock)
      .filter((slice): slice is RoadmapSlice => slice !== null);
    const dependencies = dependencyBlocks
      .map(parseDependencyBlock)
      .filter((dependency): dependency is RoadmapDependency => dependency !== null);

    const titleMatch = rawContent.match(/^#\s+(.+)$/m);
    const prdMatch = rawContent.match(/^PRD:\s*(.+)$/m);
    const statusModelMatch = rawContent.match(/^`([^`]+)`$/m);

    return {
      data: {
        path: roadmapPath,
        title: titleMatch?.[1]?.trim() ?? 'Roadmap',
        prd: prdMatch?.[1]?.trim() ?? '',
        statusModel: statusModelMatch?.[1]?.trim() ?? '',
        recommendedExecutionOrder: extractListItems(extractSection(rawContent, 'Recommended Execution Order')),
        compactedHistory: extractListItems(compactedHistorySection),
        postImplementationRealityCheck: extractListItems(postImplementationSection),
        slices: attachDependencies(slices, dependencies),
        dependencies,
        rawContent,
      },
      errors,
      warnings,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { data: null, errors, warnings };
    }

    errors.push(`Failed to read roadmap.md: ${error}`);
    return { data: null, errors, warnings };
  }
}

export { SECTION_HEADINGS };
