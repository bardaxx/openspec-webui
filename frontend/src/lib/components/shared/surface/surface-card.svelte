<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Card } from '$lib/components/ui/card';
  import { cn } from '$lib/utils';

  type Shadow = 'sm' | 'lg';

  interface Props {
    shadow?: Shadow;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  const shadowClasses: Record<Shadow, string> = {
    sm: 'shadow-sm',
    lg: 'shadow-lg',
  };

  let { shadow = 'lg', class: className = '', children, ...restProps }: Props = $props();
</script>

<Card
  {...restProps}
  data-slot="surface-card"
  class={cn('gap-0 rounded-lg border border-border bg-card py-0', shadowClasses[shadow], className)}
>
  {@render children?.()}
</Card>
