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
  data-slot="card-title"
  class={cn('leading-none font-semibold', className)}
>
  {@render children?.()}
</div>
