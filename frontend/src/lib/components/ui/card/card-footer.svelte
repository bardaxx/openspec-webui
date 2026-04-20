<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';

  interface Props {
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let { class: className = '', children, ...restProps }: Props = $props();
</script>

<div
  {...restProps}
  data-slot="card-footer"
  class={cn('flex items-center px-6 [.border-t]:pt-6', className)}
>
  {@render children?.()}
</div>
