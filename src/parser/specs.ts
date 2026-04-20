import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import type { Spec, ParseResult } from '../shared/types.js';

/**
 * Parse all specs from the specs/ directory
 */
export async function parseSpecs(openspecPath: string): Promise<ParseResult<Spec[]>> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const specs: Spec[] = [];

  const specsPath = join(openspecPath, 'specs');

  try {
    const entries = await readdir(specsPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const capabilityPath = join(specsPath, entry.name);
        const spec = await parseCapability(entry.name, capabilityPath);

        if (spec.data) {
          specs.push(spec.data);
        }
        errors.push(...spec.errors);
        warnings.push(...spec.warnings);
      }
    }

    // Sort specs alphabetically
    specs.sort((a, b) => a.name.localeCompare(b.name));

    return { data: specs, errors, warnings };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      warnings.push('specs/ directory not found');
      return { data: [], errors, warnings };
    }
    errors.push(`Failed to read specs directory: ${error}`);
    return { data: null, errors, warnings };
  }
}

/**
 * Parse a single capability directory
 */
async function parseCapability(
  name: string,
  capabilityPath: string
): Promise<ParseResult<Spec>> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const specPath = join(capabilityPath, 'spec.md');
  let specContent = '';

  try {
    specContent = await readFile(specPath, 'utf-8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      warnings.push(`${name}: spec.md not found`);
    } else {
      errors.push(`${name}: Failed to read spec.md: ${error}`);
    }
  }

  // Get the modification time from spec.md
  let lastModified: string | null = null;
  try {
    const specStat = await stat(specPath);
    lastModified = specStat.mtime.toISOString();
  } catch {
    // spec.md doesn't exist
  }

  return {
    data: {
      name,
      path: capabilityPath,
      specContent,
      lastModified,
    },
    errors,
    warnings,
  };
}

/**
 * Parse a single spec by name
 */
export async function parseSpec(
  openspecPath: string,
  specName: string
): Promise<ParseResult<Spec>> {
  const capabilityPath = join(openspecPath, 'specs', specName);

  try {
    const stats = await stat(capabilityPath);
    if (!stats.isDirectory()) {
      return {
        data: null,
        errors: [`${specName} is not a directory`],
        warnings: [],
      };
    }
  } catch (error) {
    return {
      data: null,
      errors: [`Spec ${specName} not found`],
      warnings: [],
    };
  }

  return parseCapability(specName, capabilityPath);
}
