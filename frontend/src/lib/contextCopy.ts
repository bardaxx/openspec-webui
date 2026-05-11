import * as m from './paraglide/messages.js';
import { FIXED_LABELS } from './uiText';

export const EMPTY_SELECTION_MESSAGE = 'No text selected';

export type CopySelectionResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export function buildCopySelectionResult(selection: string | null | undefined): CopySelectionResult {
  const text = selection ?? '';
  if (!text) {
    return { ok: false, error: m.common_no_text_selected() };
  }

  return { ok: true, text };
}

export function buildQuotedCopySelectionResult(options: {
  sourceName: string;
  contextLabel: string;
  selection: string | null | undefined;
}): CopySelectionResult {
  const selectionResult = buildCopySelectionResult(options.selection);
  if (!selectionResult.ok) {
    return selectionResult;
  }

  const quotedLines = selectionResult.text
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');

  return {
    ok: true,
    text: `> [${options.sourceName}] ${options.contextLabel}\n${quotedLines}`,
  };
}

export function getChangeViewerContextLabel(options: {
  activeFileName?: string | null;
  deltaCapability?: string | null;
}): string {
  return options.deltaCapability ?? options.activeFileName ?? '';
}

export function getSpecViewerContextLabel(): string {
  return FIXED_LABELS.viewer.specification;
}

/**
 * Validate and normalize a text selection for use as a search keyword.
 *
 * Rules:
 * - Trim outer whitespace.
 * - Must be 2–80 characters long after trimming.
 * - Must not contain \n, \r, or \t (single-line only).
 */
export function validateSearchKeyword(raw: string | null | undefined): { valid: boolean; keyword: string } {
  const keyword = (raw ?? '').trim();

  if (keyword.length < 2 || keyword.length > 80) {
    return { valid: false, keyword };
  }

  if (keyword.includes('\n') || keyword.includes('\r') || keyword.includes('\t')) {
    return { valid: false, keyword };
  }

  return { valid: true, keyword };
}
