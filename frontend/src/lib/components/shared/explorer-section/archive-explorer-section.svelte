<script lang="ts">
  import { Archive } from '@lucide/svelte';
  import type { Snippet } from 'svelte';
  import type { ChangeSummary } from '$lib/types/api';
  import { formatChangeName, formatDate } from '$lib/utils';
  import type { ExplorerSortMode } from './explorer-sort-control.svelte';
  import ExplorerSection from './explorer-section.svelte';
  import ExplorerSectionItem from './explorer-section-item.svelte';
  import * as m from '$lib/paraglide/messages.js';
  import { FIXED_LABELS } from '$lib/uiText';

  interface Props {
    changes: ChangeSummary[];
    onItemSelected?: () => void;
    headerRight?: Snippet;
    headerExtra?: Snippet;
    sortMode?: ExplorerSortMode;
  }

  let {
    changes,
    onItemSelected = () => {},
    headerRight,
    headerExtra,
    sortMode = 'date',
  }: Props = $props();

  function timestampValue(value: string | null | undefined) {
    if (!value) return 0;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  let sortedChanges = $derived.by(() => {
    return [...changes].sort((left, right) => {
      if (sortMode === 'name') {
        return formatChangeName(left.name).localeCompare(formatChangeName(right.name));
      }

      const timestampDiff = timestampValue(right.lastModified) - timestampValue(left.lastModified);
      if (timestampDiff !== 0) {
        return timestampDiff;
      }

      return formatChangeName(left.name).localeCompare(formatChangeName(right.name));
    });
  });
</script>

<ExplorerSection
  title={FIXED_LABELS.explorer.archive}
  icon={Archive}
  section="archive"
  count={changes.length}
  {headerRight}
  {headerExtra}
  emptyMessage={m.explorer_no_archived_changes()}
>
  {#each sortedChanges as change}
    {@const changePath = `/changes/${encodeURIComponent(change.name)}`}
    <ExplorerSectionItem
      path={changePath}
      section="archive"
      kind="archived-change"
      {onItemSelected}
      name={change.name}
      displayName={formatChangeName(change.name)}
      date={change.lastModified ? formatDate(change.lastModified) : null}
      specDeltaCount={change.specDeltaCount}
      taskProgress={change.taskProgress}
    />
  {/each}
</ExplorerSection>
