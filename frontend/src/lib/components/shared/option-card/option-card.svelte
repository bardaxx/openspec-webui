<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import { cn } from '$lib/utils';
  import { Card } from '$lib/components/ui/card';

  interface Props {
    icon: Component<{ class?: string }>;
    label: string;
    selected: boolean;
    name: string;
    value: string;
    description?: Snippet;
    class?: string;
    onchange?: (event: Event) => void;
    [key: string]: unknown;
  }

  let {
    icon: Icon,
    label,
    selected,
    name,
    value,
    description,
    class: className = '',
    onchange,
    ...restProps
  }: Props = $props();
</script>

<Card
  {...restProps}
  data-slot="option-card"
  class={cn(
    'group relative cursor-pointer flex-col items-center gap-3 p-4 text-center transition-all hover:border-primary/50 border-2',
    selected ? 'border-primary bg-primary/5' : 'border-border bg-card',
    className,
  )}
>
  <label>
    <input type="radio" {name} {value} class="sr-only" checked={selected} {onchange} />
    <div
      class="rounded-full bg-background p-3 shadow-sm transition-transform duration-300 group-hover:scale-110"
    >
      <Icon class="h-6 w-6 text-foreground" />
    </div>
    <div class="space-y-1">
      <div class="font-medium text-foreground">{label}</div>
      {#if description}
        <div class="text-xs text-muted-foreground">
          {@render description()}
        </div>
      {/if}
    </div>
  </label>
</Card>
