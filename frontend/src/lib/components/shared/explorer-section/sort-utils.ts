/**
 * Shared sorting types and comparator helpers for explorer and dashboard sections.
 */

export type ExplorerSortMode = 'date' | 'name';

/**
 * Converts a date string to a numeric timestamp. Returns 0 for null/undefined/invalid values.
 */
export function timestampValue(value: string | null | undefined): number {
  if (!value) return 0;
  const ts = new Date(value).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

/**
 * Sort comparator for items with a `lastModified` date string and a `name` string.
 *
 * - **date** mode: descending by `lastModified`, with `name` as tie-breaker (ascending).
 * - **name** mode: ascending by `name`.
 */
export function compareBySortMode<T extends { name: string; lastModified?: string | null }>(
  mode: ExplorerSortMode,
): (left: T, right: T) => number {
  return (left, right) => {
    if (mode === 'name') {
      return left.name.localeCompare(right.name);
    }

    const diff = timestampValue(right.lastModified) - timestampValue(left.lastModified);
    return diff !== 0 ? diff : left.name.localeCompare(right.name);
  };
}
