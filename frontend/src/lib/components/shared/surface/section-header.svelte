<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  interface Props {
    compact?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let { compact = false, class: className = '', children, ...restProps }: Props = $props();
</script>

<div
  {...restProps}
  data-slot="section-header"
  class={cn('border-b border-border py-4', compact ? 'px-5' : 'px-6', className)}
>
  {@render children?.()}
</div>
