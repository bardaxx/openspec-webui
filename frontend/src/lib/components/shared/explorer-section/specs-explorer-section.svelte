<script lang="ts">
  import { FileText } from '@lucide/svelte';
  import type { SpecSummary } from '$lib/types/api';
  import { formatDate } from '$lib/utils';
  import ExplorerSection from './explorer-section.svelte';
  import ExplorerSectionItem from './explorer-section-item.svelte';
  import * as m from '$lib/paraglide/messages.js';
  import { FIXED_LABELS } from '$lib/uiText';

  interface Props {
    specs: SpecSummary[];
    onItemSelected?: () => void;
  }

  let {
    specs,
    onItemSelected = () => {},
  }: Props = $props();
</script>

<ExplorerSection
  title={FIXED_LABELS.explorer.specs}
  icon={FileText}
  section="specs"
  count={specs.length}
  emptyMessage={m.explorer_no_specs_found()}
>
  {#each specs as spec}
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
