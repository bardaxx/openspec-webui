<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import { getSelectContext } from './context';

  interface Props {
    value: string;
    disabled?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let { value, disabled = false, class: className = '', children, ...restProps }: Props = $props();

  const select = getSelectContext();

  function handleClick() {
    if (disabled) {
      return;
    }

    select.setSelectedValue(value);
    select.setOpen(false);
  }
</script>

<button
  {...restProps}
  type="button"
  role="option"
  aria-selected={select.selectedValue() === value}
  disabled={disabled}
  class={cn(
    'relative flex w-full cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-primary/5 hover:text-foreground focus:bg-primary/5 disabled:pointer-events-none disabled:opacity-50',
    select.selectedValue() === value && 'bg-primary/5 text-foreground',
    className,
  )}
  onclick={handleClick}
>
  {@render children?.()}
</button>
