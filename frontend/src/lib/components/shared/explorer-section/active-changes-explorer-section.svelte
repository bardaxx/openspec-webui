<script lang="ts">
  import { SquarePen } from '@lucide/svelte';
  import type { Snippet } from 'svelte';
  import type { ChangeSummary } from '$lib/types/api';
  import { formatDate } from '$lib/utils';
  import ExplorerSection from './explorer-section.svelte';
  import ExplorerSectionItem from './explorer-section-item.svelte';

  interface Props {
    changes: ChangeSummary[];
    onItemSelected?: () => void;
    headerExtra?: Snippet;
  }

  let {
    changes,
    onItemSelected = () => {},
    headerExtra,
  }: Props = $props();
</script>

<ExplorerSection
  title="Active Changes"
  icon={SquarePen}
  section="active-changes"
  count={changes.length}
  {headerExtra}
  emptyMessage="No active changes"
>
  {#each changes as change}
    {@const changePath = `/changes/${encodeURIComponent(change.name)}`}
    <ExplorerSectionItem
      path={changePath}
      section="active-changes"
      kind="active-change"
      {onItemSelected}
      name={change.name}
      date={change.lastModified ? formatDate(change.lastModified) : null}
      specDeltaCount={change.specDeltaCount}
      taskProgress={change.taskProgress}
      showProgress
    />
  {/each}
</ExplorerSection>
