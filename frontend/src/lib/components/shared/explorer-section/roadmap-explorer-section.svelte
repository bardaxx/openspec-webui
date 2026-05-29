<script lang="ts">
  import { Archive, Map as MapIcon, PlayCircle } from '@lucide/svelte';
  import { Badge } from '$lib/components/ui/badge';
  import * as ScrollArea from '$lib/components/ui/scroll-area';
  import { project } from '$lib/state/appData.svelte.ts';
  import { tabStore } from '$lib/state/tabs.svelte.ts';
  import { uiPreferencesStore } from '$lib/state/uiPreferences.svelte.ts';
  import type { RoadmapSlice } from '$lib/types/api';
  import { FIXED_LABELS } from '$lib/uiText';
  import type { BadgeVariant } from '$lib/visualSemantics';
  import ExplorerListItemButton from './explorer-list-item-button.svelte';
  import ExplorerSection from './explorer-section.svelte';

  interface Props {
    onItemSelected?: () => void;
  }

  interface TimelineSlice {
    slice: RoadmapSlice;
    executionOrder: number | null;
  }

  const NEXT_SLICE_STATUSES = new Set(['Ready', 'Spec Proposed', 'Applying', 'Blocked']);

  let { onItemSelected = () => {} }: Props = $props();

  let recommendedOpen = $state(true);
  let pipelineOpen = $state(true);
  let archivedOpen = $state(false);

  let roadmap = $derived(project.value?.roadmap ?? null);
  let viewerState = $derived(
    tabStore.getViewerState<{ searchNavigation?: { matchLocation?: { roadmapSliceId?: string } } }>('roadmap:home'),
  );
  let selectedSliceId = $derived(viewerState?.searchNavigation?.matchLocation?.roadmapSliceId ?? null);

  function sliceIdFromRecommendedEntry(entry: string): string | null {
    const match = entry.match(/^([A-Za-z]+\d+)/i);
    return match?.[1]?.toUpperCase() ?? null;
  }

  function compareTimelineSlices(left: TimelineSlice, right: TimelineSlice): number {
    if (left.executionOrder != null && right.executionOrder != null) {
      return left.executionOrder - right.executionOrder;
    }

    if (left.executionOrder != null) {
      return -1;
    }

    if (right.executionOrder != null) {
      return 1;
    }

    return left.slice.id.localeCompare(right.slice.id);
  }

  function pickRecommendedNext(active: TimelineSlice[]): TimelineSlice | null {
    const ready = active.filter(({ slice }) => slice.status === 'Ready');
    if (ready.length > 0) {
      return ready[0];
    }

    for (const status of ['Applying', 'Spec Proposed', 'Blocked'] as const) {
      const match = active.find(({ slice }) => slice.status === status);
      if (match) {
        return match;
      }
    }

    return active.find(({ slice }) => NEXT_SLICE_STATUSES.has(slice.status)) ?? active[0] ?? null;
  }

  let timeline = $derived.by(() => {
    const slices = roadmap?.slices ?? [];
    const orderMap = new Map<string, number>();

    for (const [index, entry] of (roadmap?.recommendedExecutionOrder ?? []).entries()) {
      const sliceId = sliceIdFromRecommendedEntry(entry);
      if (sliceId) {
        orderMap.set(sliceId, index);
      }
    }

    const sorted = [...slices]
      .map((slice) => ({
        slice,
        executionOrder: orderMap.get(slice.id.toUpperCase()) ?? null,
      }))
      .sort(compareTimelineSlices);

    const archived = sorted.filter(({ slice }) => slice.status === 'Archived');
    const active = sorted.filter(({ slice }) => slice.status !== 'Archived');
    const recommendedNext = pickRecommendedNext(active);
    const recommendedId = recommendedNext?.slice.id ?? null;
    const pipeline = active.filter(({ slice }) => slice.id !== recommendedId);

    return {
      recommendedNext,
      pipeline,
      archived,
    };
  });

  function statusVariant(status: string): BadgeVariant {
    switch (status) {
      case 'Applied':
      case 'Archived':
        return 'success';
      case 'Applying':
      case 'Spec Proposed':
        return 'info';
      case 'Blocked':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  function openSlice(slice: RoadmapSlice, event: MouseEvent) {
    const currentViewerState = tabStore.getViewerState<Record<string, unknown>>('roadmap:home') ?? {};

    tabStore.setViewerState('roadmap:home', {
      ...currentViewerState,
      searchNavigation: {
        requestKey: Date.now(),
        matchLocation: { roadmapSliceId: slice.id },
      },
    });

    if (!uiPreferencesStore.previewTabsEnabled || event.ctrlKey) {
      tabStore.openConfirmed('/roadmap');
    } else {
      tabStore.openPreview('/roadmap');
    }

    onItemSelected();
  }
</script>

{#snippet timelineSliceRow(item: TimelineSlice, highlighted = false, muted = false, last = false)}
  <ExplorerListItemButton
    items={[]}
    kind="roadmap"
    name={item.slice.id}
    displayName={item.slice.title}
    active={tabStore.activeTab?.path === '/roadmap' && selectedSliceId === item.slice.id}
    class={`${highlighted ? 'border-l-2 border-l-info bg-info-bg/25' : ''} ${muted ? 'opacity-80' : ''} ${last ? 'border-b-0' : ''}`}
    onclick={(event) => openSlice(item.slice, event)}
  >
    <div class="flex min-w-0 flex-wrap items-center gap-1.5">
      <Badge variant="outline" class="shrink-0 font-mono text-[10px]">{item.slice.id}</Badge>
      <Badge variant={statusVariant(item.slice.status)} class="shrink-0">{item.slice.status}</Badge>
      {#if item.executionOrder != null}
        <span class="text-[11px] text-muted-foreground">#{item.executionOrder + 1}</span>
      {/if}
    </div>
  </ExplorerListItemButton>
{/snippet}

<div class="flex min-h-0 flex-1 flex-col">
  <div class="shrink-0 border-b border-border bg-card px-3 py-3">
    <div class="flex min-w-0 items-center gap-2">
      <MapIcon class="h-4 w-4 shrink-0 text-info" />
      <div class="min-w-0 flex-1 truncate text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {FIXED_LABELS.common.roadmap}
      </div>
      {#if (roadmap?.slices.length ?? 0) > 0}
        <Badge variant="secondary">{roadmap?.slices.length}</Badge>
      {/if}
    </div>
  </div>

  <ScrollArea.Root class="min-h-0 flex-1" viewportClass="h-full">
    {#if (roadmap?.slices.length ?? 0) === 0}
      <div class="border-b border-dashed border-border/50 bg-secondary/10 px-3 py-6 text-center text-sm text-muted-foreground">
        {FIXED_LABELS.viewer.roadmap.noSlices}
      </div>
    {:else}
      <div class="divide-y divide-border/70">
        {#if timeline.recommendedNext}
          <ExplorerSection
            title={FIXED_LABELS.viewer.roadmap.recommendedNext}
            icon={PlayCircle}
            count={1}
            open={recommendedOpen}
            onToggle={() => {
              recommendedOpen = !recommendedOpen;
            }}
          >
            {@render timelineSliceRow(timeline.recommendedNext, true, false, true)}
          </ExplorerSection>
        {/if}

        {#if timeline.pipeline.length > 0}
          <ExplorerSection
            title={FIXED_LABELS.viewer.roadmap.pipeline}
            icon={MapIcon}
            count={timeline.pipeline.length}
            open={pipelineOpen}
            onToggle={() => {
              pipelineOpen = !pipelineOpen;
            }}
          >
            {#each timeline.pipeline as item, index}
              {@render timelineSliceRow(item, false, false, index === timeline.pipeline.length - 1)}
            {/each}
          </ExplorerSection>
        {/if}

        {#if timeline.archived.length > 0}
          <ExplorerSection
            title={FIXED_LABELS.viewer.roadmap.timelineArchived}
            icon={Archive}
            count={timeline.archived.length}
            open={archivedOpen}
            onToggle={() => {
              archivedOpen = !archivedOpen;
            }}
          >
            {#each timeline.archived as item, index}
              {@render timelineSliceRow(item, false, true, index === timeline.archived.length - 1)}
            {/each}
          </ExplorerSection>
        {/if}
      </div>
    {/if}
  </ScrollArea.Root>
</div>
