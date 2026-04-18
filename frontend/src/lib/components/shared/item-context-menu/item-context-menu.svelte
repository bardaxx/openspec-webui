<script lang="ts">
  import type { Snippet } from 'svelte';
  import * as ContextMenu from '$lib/components/ui/context-menu';
  import type { MenuItem } from './types';

  interface Props {
    items: MenuItem[];
    children?: Snippet;
  }

  let { items, children }: Props = $props();
</script>

<ContextMenu.Root>
  {@render children?.()}

  <ContextMenu.Content>
    {#each items as item (item.label)}
      <ContextMenu.Item onSelect={item.onSelect}>
        {#if item.icon}
          {@const Icon = item.icon}
          <Icon class="h-4 w-4" />
        {/if}

        {item.label}
      </ContextMenu.Item>
    {/each}
  </ContextMenu.Content>
</ContextMenu.Root>
