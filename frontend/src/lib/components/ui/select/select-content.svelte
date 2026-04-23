<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import { getSelectContext } from './context';

  type Side = 'top' | 'bottom';
  type Align = 'start' | 'center' | 'end';

  interface Props {
    side?: Side;
    align?: Align;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  const sideClasses: Record<Side, string> = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
  };

  const alignClasses: Record<Align, string> = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  let { side = 'bottom', align = 'start', class: className = '', children, ...restProps }: Props = $props();
  const select = getSelectContext();

  let contentElement = $state<HTMLElement | null>(null);

  $effect(() => {
    select.setContentElement(contentElement);
  });

  function handleWindowPointerdown(event: PointerEvent) {
    if (!select.isOpen()) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    const triggerElement = select.getTriggerElement();

    if (contentElement?.contains(target) || triggerElement?.contains(target)) {
      return;
    }

    select.setOpen(false);
  }

  function handleWindowKeydown(event: KeyboardEvent) {
    if (select.isOpen() && event.key === 'Escape') {
      select.setOpen(false);
    }
  }
</script>

<svelte:window onpointerdown={handleWindowPointerdown} onkeydown={handleWindowKeydown} />

{#if select.isOpen()}
  <div
    bind:this={contentElement}
    {...restProps}
    role="listbox"
    class={cn(
      'absolute z-50 min-w-full rounded-lg border border-border bg-card p-1 text-card-foreground shadow-lg',
      sideClasses[side],
      alignClasses[align],
      className,
    )}
  >
    {@render children?.()}
  </div>
{/if}
