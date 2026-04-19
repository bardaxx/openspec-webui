<script lang="ts">
  import { ChevronDown, ChevronRight } from '@lucide/svelte';
  import type { Component, Snippet } from 'svelte';
  import { Badge } from '$lib/components/ui/badge';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import { EmptyState } from '$lib/components/shared/empty-state';
  import { layoutStore, type ExplorerSection } from '$lib/state/layout.svelte.ts';
  import { cn } from '$lib/utils';

  type IconComponent = Component<{ class?: string }>;

  interface Props {
    title: string;
    count: number;
    section?: ExplorerSection;
    open?: boolean;
    focused?: boolean;
    onToggle?: () => void;
    icon?: IconComponent;
    headerExtra?: Snippet;
    emptyMessage?: string;
    emptyIcon?: IconComponent;
    children?: Snippet;
    class?: string;
    [key: string]: unknown;
  }

  let {
    title,
    count,
    section = undefined,
    open: openProp = undefined,
    focused: focusedProp = undefined,
    onToggle: onToggleProp = undefined,
    icon = undefined,
    headerExtra,
    emptyMessage = undefined,
    emptyIcon = undefined,
    children,
    class: className = '',
    ...restProps
  }: Props = $props();

  const resolvedEmptyIcon = $derived(emptyIcon ?? icon);

  const open = $derived(
    section
      ? !layoutStore.sectionCollapsed[section]
      : (openProp ?? true)
  );

  const focused = $derived(
    section
      ? layoutStore.focusedSection === section
      : (focusedProp ?? false)
  );

  function handleToggle(nextOpen?: boolean) {
    if (onToggleProp) {
      onToggleProp();
      return;
    }

    if (!section) return;

    const shouldOpen = nextOpen ?? layoutStore.sectionCollapsed[section];

    if (shouldOpen) {
      layoutStore.focusSection(section);
      return;
    }

    layoutStore.setSectionCollapsed(section, true);
  }
</script>

<Collapsible.Root
  {...restProps}
  {open}
  onOpenChange={handleToggle}
  class={cn('overflow-hidden rounded-lg border border-border/70 bg-card', focused && 'ring-1 ring-ring/40', className)}
>
  <div class="border-b border-border/70 bg-secondary/40 px-3 py-2 transition-colors hover:bg-secondary/70">
    <Collapsible.Trigger class="flex w-full items-center justify-between px-1 py-1 text-left">
      <span class="flex min-w-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {#if icon}
          {@const Icon = icon}
          <Icon class="h-3.5 w-3.5 shrink-0" />
        {/if}

        <span class="truncate">{title}</span>
      </span>

      <span class="flex items-center gap-2">
        <Badge variant="secondary" class="min-w-5 justify-center px-2 py-0.5 text-[11px] font-medium">
          {count}
        </Badge>

        {#if open}
          <ChevronDown class="h-4 w-4 text-muted-foreground" />
        {:else}
          <ChevronRight class="h-4 w-4 text-muted-foreground" />
        {/if}
      </span>
    </Collapsible.Trigger>

    {#if headerExtra && open}
      <div class="mt-2">
        {@render headerExtra()}
      </div>
    {/if}
  </div>

  <Collapsible.Content class="bg-card">
    {#if count === 0 && emptyMessage}
      <EmptyState message={emptyMessage} icon={resolvedEmptyIcon} class="px-3 py-6" />
    {:else}
      {@render children?.()}
    {/if}
  </Collapsible.Content>
</Collapsible.Root>
