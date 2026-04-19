<script lang="ts">
  import { FileText } from '@lucide/svelte';
  import type { SpecSummary } from '$lib/types/api';
  import { Badge } from '$lib/components/ui/badge';
  import { formatDate } from '$lib/utils';
  import ExplorerSection from './explorer-section.svelte';
  import ExplorerSectionItem from './explorer-section-item.svelte';

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
  title="Specs"
  icon={FileText}
  section="specs"
  count={specs.length}
  emptyMessage="No specs found"
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
    >
      {#if spec.hasDesign}
        <Badge variant="outline" class="text-[10px] font-medium">Design</Badge>
      {/if}
    </ExplorerSectionItem>
  {/each}
</ExplorerSection>
