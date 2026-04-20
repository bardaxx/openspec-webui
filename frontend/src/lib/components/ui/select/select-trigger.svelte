<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import { getSelectContext } from './context';

  interface Props {
    disabled?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let { disabled = false, class: className = '', children, ...restProps }: Props = $props();
  const select = getSelectContext();

  let triggerElement = $state<HTMLElement | null>(null);

  $effect(() => {
    select.setTriggerElement(triggerElement);
  });
</script>

<button
  bind:this={triggerElement}
  {...restProps}
  type="button"
  aria-haspopup="listbox"
  aria-expanded={select.isOpen()}
  disabled={disabled}
  class={cn(
    'inline-flex items-center justify-between gap-2 h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors hover:bg-primary/50 focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  onclick={() => !disabled && select.setOpen(!select.isOpen())}
>
  {@render children?.()}
</button>
