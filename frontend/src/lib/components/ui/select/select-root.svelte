<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import { setSelectContext } from './context';

  interface Props {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    value = undefined,
    defaultValue: initialValue = '',
    onValueChange = () => {},
    open = undefined,
    defaultOpen: initialOpen = false,
    onOpenChange = () => {},
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  let internalSelectedValue = $state('');
  let internalOpen = $state(false);
  let triggerElement = $state<HTMLElement | null>(null);
  let contentElement = $state<HTMLElement | null>(null);

  $effect(() => {
    if (value === undefined) {
      internalSelectedValue = initialValue;
    }
  });

  $effect(() => {
    if (open === undefined) {
      internalOpen = initialOpen;
    }
  });

  function selectedValue() {
    return value ?? internalSelectedValue;
  }

  function setSelectedValue(nextValue: string) {
    if (value === undefined) {
      internalSelectedValue = nextValue;
    }

    onValueChange(nextValue);
  }

  function isOpen() {
    return open ?? internalOpen;
  }

  function setOpen(nextOpen: boolean) {
    if (open === undefined) {
      internalOpen = nextOpen;
    }

    onOpenChange(nextOpen);
  }

  setSelectContext({
    isOpen,
    setOpen,
    selectedValue,
    setSelectedValue,
    getTriggerElement: () => triggerElement,
    setTriggerElement: (element) => {
      triggerElement = element;
    },
    getContentElement: () => contentElement,
    setContentElement: (element) => {
      contentElement = element;
    },
  });
</script>

<div {...restProps} class={cn('relative inline-flex', className)}>
  {@render children?.()}
</div>
