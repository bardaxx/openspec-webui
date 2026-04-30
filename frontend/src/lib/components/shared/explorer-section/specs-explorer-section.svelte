<script lang="ts">
  import { FileText } from '@lucide/svelte';
  import type { Snippet } from 'svelte';
  import type { SpecSummary } from '$lib/types/api';
  import { formatDate } from '$lib/utils';
  import type { ExplorerSortMode } from './explorer-sort-control.svelte';
  import ExplorerSection from './explorer-section.svelte';
  import ExplorerSectionItem from './explorer-section-item.svelte';
  import * as m from '$lib/paraglide/messages.js';
  import { FIXED_LABELS } from '$lib/uiText';

  interface Props {
    specs: SpecSummary[];
    onItemSelected?: () => void;
    headerRight?: Snippet;
    headerExtra?: Snippet;
    sortMode?: ExplorerSortMode;
  }

  let {
    specs,
    onItemSelected = () => {},
    headerRight,
    headerExtra,
    sortMode = 'name',
  }: Props = $props();

  function timestampValue(value: string | null | undefined) {
    if (!value) return 0;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  let sortedSpecs = $derived.by(() => {
    return [...specs].sort((left, right) => {
      if (sortMode === 'date') {
        const timestampDiff = timestampValue(right.lastModified) - timestampValue(left.lastModified);
        if (timestampDiff !== 0) {
          return timestampDiff;
        }
      }

      return left.name.localeCompare(right.name);
    });
  });
</script>

<ExplorerSection
  title={FIXED_LABELS.explorer.specs}
  icon={FileText}
  section="specs"
  count={specs.length}
  {headerRight}
  {headerExtra}
  emptyMessage={m.explorer_no_specs_found()}
>
  {#each sortedSpecs as spec}
    {@const specPath = `/specs/${encodeURIComponent(spec.name)}`}
    <ExplorerSectionItem
      path={specPath}
      section="specs"
      kind="spec"
      class="items-center"
      {onItemSelected}
      name={spec.name}
      date={spec.lastModified ? formatDate(spec.lastModified) : null}
    />
  {/each}
</ExplorerSection>
