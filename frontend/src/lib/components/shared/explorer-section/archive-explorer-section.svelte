<script lang="ts">
  import { Archive } from '@lucide/svelte';
  import type { ChangeSummary } from '$lib/types/api';
  import { formatChangeName } from '$lib/utils';
  import ExplorerSection from './explorer-section.svelte';
  import ExplorerSectionItem from './explorer-section-item.svelte';

  interface Props {
    changes: ChangeSummary[];
    onItemSelected?: () => void;
  }

  let {
    changes,
    onItemSelected = () => {},
  }: Props = $props();
</script>

<ExplorerSection
  title="Archive"
  icon={Archive}
  section="archive"
  count={changes.length}
  emptyMessage="No archived changes"
>
  {#each changes as change}
    {@const changePath = `/changes/${encodeURIComponent(change.name)}`}
    <ExplorerSectionItem
      path={changePath}
      section="archive"
      kind="archived-change"
      {onItemSelected}
      name={change.name}
      displayName={formatChangeName(change.name)}
      date={change.archivedDate}
      specDeltaCount={change.specDeltaCount}
      taskProgress={change.taskProgress}
    />
  {/each}
</ExplorerSection>
