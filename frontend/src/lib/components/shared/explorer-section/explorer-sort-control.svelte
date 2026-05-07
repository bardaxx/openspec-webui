<script lang="ts">
  import { ArrowUpAZ, Calendar } from '@lucide/svelte';
  import { cn } from '$lib/utils';
  import { FIXED_LABELS } from '$lib/uiText';
  import type { ExplorerSortMode } from './sort-utils';

  interface Props {
    value: ExplorerSortMode;
    onValueChange: (value: ExplorerSortMode) => void;
    ariaLabel?: string;
  }

  let {
    value,
    onValueChange,
    ariaLabel = FIXED_LABELS.explorer.sortBy,
  }: Props = $props();

  function toggle() {
    onValueChange(value === 'date' ? 'name' : 'date');
  }
</script>

<button
  class={cn(
    'flex h-6 w-6 items-center justify-center rounded-md border border-border/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'
  )}
  onclick={toggle}
  title={value === 'date' ? FIXED_LABELS.common.date : FIXED_LABELS.common.name}
  aria-label={ariaLabel}
>
  {#if value === 'date'}
    <Calendar class="h-3.5 w-3.5" />
  {:else}
    <ArrowUpAZ class="h-3.5 w-3.5" />
  {/if}
</button>
