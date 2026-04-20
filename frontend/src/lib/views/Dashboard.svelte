<script lang="ts">
  import { tick } from 'svelte';
  import { Archive, ArrowRight, Bookmark, ChevronDown, ChevronRight, LayoutDashboard, Calendar, CheckSquare, FileText, FolderPen, History, SquarePen } from '@lucide/svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Callout } from '$lib/components/shared/callout';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import { EmptyState } from '$lib/components/shared/empty-state';
  import { IconBox } from '$lib/components/shared/icon-box';
  import { ItemContextMenu } from '$lib/components/shared/item-context-menu';
  import { createItemContextMenuItems, type ItemContextMenuKind } from '$lib/itemContextMenu';
  import { activeChanges, archivedChanges, project, specs, stats } from '$lib/state/appData.svelte.ts';
  import { commandPreferencesStore } from '$lib/state/commandPreferences.svelte.ts';
  import { getChangeCommands, getWorkspaceCommands } from '$lib/commandShortcuts';
  import { getPlanningContextNotice } from '$lib/projectPlanningContext';
  import { t } from '$lib/i18n';
  import * as m from '$lib/paraglide/messages.js';
  import { localeStore } from '$lib/state/locale.svelte.ts';
  import { layoutStore } from '$lib/state/layout.svelte.ts';
  import { tabStore } from '$lib/state/tabs.svelte.ts';
  import MarkdownRenderer from '$lib/components/shared/MarkdownRenderer.svelte';
  import { Progress } from '$lib/components/ui/progress';
  import CommandShortcutBar from '$lib/components/shared/CommandShortcutBar.svelte';
  import { formatChangeName, formatDate } from '$lib/utils';
  import { FIXED_LABELS, getChangeTaskCountLabel, getSpecDeltaCountLabel, getWorkflowSchemaFallbackLabel } from '$lib/uiText';

  type TimestampedChange = {
    name: string;
    isArchived?: boolean;
    archivedDate: string | null;
    lastModified?: string | null;
    specDeltaCount: number;
    hasProposal?: boolean;
    hasDesign?: boolean;
    taskProgress: {
      done: number;
      total: number;
      percentage: number;
    };
  };

  type TimestampedSpec = {
    name: string;
    lastModified?: string | null;
  };

  type RecentActivityItem = {
    id: string;
    kind: ItemContextMenuKind;
    name: string;
    title: string;
    date: string | null;
    timestamp: number;
    specDeltaCount?: number;
    taskProgress?: { done: number; total: number };
    open: () => void;
  };

  const formatDashboardDate = formatDate;
  let legacyProjectDocOpen = $state(false);

  function commandPreferencesSnapshot() {
    return {
      format: commandPreferencesStore.format,
      commandVisibility: commandPreferencesStore.commandVisibility,
      availability: commandPreferencesStore.availability,
    };
  }

  let workspaceCommands = $derived(getWorkspaceCommands(activeChanges.value, commandPreferencesSnapshot()));

  function timestampValue(value: string | null | undefined) {
    if (!value) {
      return 0;
    }

    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  function changeUpdatedAt(change: TimestampedChange) {
    return change.lastModified ?? null;
  }

  function changeArchivedOrUpdatedAt(change: TimestampedChange) {
    return change.archivedDate ?? change.lastModified ?? null;
  }

  function specUpdatedAt(spec: TimestampedSpec) {
    return spec.lastModified ?? null;
  }

  let overallTaskProgress = $derived.by(() => {
    if (stats.value?.overallTaskProgress) {
      return stats.value.overallTaskProgress;
    }

    const allChanges = [...activeChanges.value, ...archivedChanges.value];
    const done = allChanges.reduce((sum, change) => sum + change.taskProgress.done, 0);
    const total = allChanges.reduce((sum, change) => sum + change.taskProgress.total, 0);
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    return { done, total, percentage };
  });

  let recentActivity = $derived.by((): RecentActivityItem[] => {
    const activeItems = activeChanges.value
      .filter((change) => timestampValue(changeUpdatedAt(change)) > 0)
      .map((change) => ({
        id: `active:${change.name}`,
        kind: 'active-change' as const,
        name: change.name,
        title: change.name,
        date: changeUpdatedAt(change),
        timestamp: timestampValue(changeUpdatedAt(change)),
        specDeltaCount: change.specDeltaCount,
        taskProgress: { done: change.taskProgress.done, total: change.taskProgress.total },
        open: () => openActiveChange(change.name),
      }));

    const archivedItems = archivedChanges.value
      .filter((change) => timestampValue(changeArchivedOrUpdatedAt(change)) > 0)
      .map((change) => ({
        id: `archived:${change.name}`,
        kind: 'archived-change' as const,
        name: change.name,
        title: formatChangeName(change.name),
        date: changeArchivedOrUpdatedAt(change),
        timestamp: timestampValue(changeArchivedOrUpdatedAt(change)),
        specDeltaCount: change.specDeltaCount,
        taskProgress: { done: change.taskProgress.done, total: change.taskProgress.total },
        open: () => openArchivedChange(change.name),
      }));

    const specItems = specs.value
      .filter((spec) => timestampValue(specUpdatedAt(spec)) > 0)
      .map((spec) => ({
        id: `spec:${spec.name}`,
        kind: 'spec' as const,
        name: spec.name,
        title: spec.name,
        date: specUpdatedAt(spec),
        timestamp: timestampValue(specUpdatedAt(spec)),
        open: () => openSpec(spec.name),
      }));

    return [...activeItems, ...archivedItems, ...specItems]
      .sort((left, right) => right.timestamp - left.timestamp)
      .slice(0, 12);
  });

  function openActiveChange(name: string) {
    layoutStore.focusSection('active-changes');
    tabStore.open(`/changes/${encodeURIComponent(name)}`);
  }

  function openArchivedChange(name: string) {
    layoutStore.focusSection('archive');
    tabStore.open(`/changes/${encodeURIComponent(name)}`);
  }

  function openSpec(name: string) {
    layoutStore.focusSection('specs');
    tabStore.open(`/specs/${encodeURIComponent(name)}`);
  }

  function searchForSpec(specName: string) {
    layoutStore.openOverlay('search', { initialQuery: specName });
  }

  function openHomeSurface() {
    layoutStore.setActivityPreset('home');
  }

  function focusSpecsSection() {
    layoutStore.setActivityPreset('specs');
  }

  function focusArchiveSection() {
    layoutStore.setActivityPreset('archive');
  }

  async function openDocumentation() {
    await tick();
    document.getElementById('project-documentation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function changeCommandsFor(change: TimestampedChange) {
    const changeContext = {
      isArchived: change.isArchived ?? false,
      taskProgress: change.taskProgress,
    } as Parameters<typeof getChangeCommands>[0];

    return getChangeCommands(changeContext, commandPreferencesSnapshot());
  }

  let planningContext = $derived(project.value?.planningContext ?? null);
  let legacyProjectDoc = $derived(project.value?.legacyProjectDoc ?? null);
  let migrationState = $derived(project.value?.migrationState ?? 'config-only');
  let hasArtifactRules = $derived((planningContext?.artifactRules.length ?? 0) > 0);
  let planningContextNotice = $derived(getPlanningContextNotice({ migrationState }, localeStore.version));

  function getProjectSelectorAriaLabel() {
    return FIXED_LABELS.dashboard.openProjectSelector;
  }

</script>

<svelte:head>
  <title>{project.value?.name ?? FIXED_LABELS.appName} • {FIXED_LABELS.appName}</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <div class="flex items-start justify-between gap-4">
      <h1 class="flex items-center gap-2 text-2xl font-bold text-foreground">
        <IconBox icon={LayoutDashboard} variant="info" />
        {project.value?.name ?? FIXED_LABELS.appName}
        <Button
          variant="ghost"
          size="icon"
          class="ml-auto size-7 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={getProjectSelectorAriaLabel()}
          onclick={() => layoutStore.openOverlay('project-selector')}
        >
          <FolderPen class="h-4 w-4" />
        </Button>
      </h1>
    </div>

    <div>
      {#if project.value?.description}
        <p class="mt-1 text-muted-foreground">{project.value.description}</p>
      {/if}
    </div>
  </div>

  <!-- Summary Cards -->
  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <button
      type="button"
      class="rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      onclick={openHomeSurface}
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-sm font-medium text-muted-foreground">{FIXED_LABELS.dashboard.activeChanges}</div>
          <div class="mt-2 text-3xl font-semibold text-foreground">{stats.value?.activeChanges ?? activeChanges.value.length}</div>
          <div class="mt-1 text-sm text-muted-foreground">{t(m.dashboard_active_changes_summary)}</div>
        </div>
        <IconBox icon={SquarePen} variant="info" />
      </div>
    </button>

    <button
      type="button"
      class="rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      onclick={focusArchiveSection}
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-sm font-medium text-muted-foreground">{FIXED_LABELS.common.archive}</div>
          <div class="mt-2 text-3xl font-semibold text-foreground">{stats.value?.archivedChanges ?? archivedChanges.value.length}</div>
          <div class="mt-1 text-sm text-muted-foreground">{t(m.dashboard_archive_summary)}</div>
        </div>
        <IconBox icon={Archive} variant="muted" />
      </div>
    </button>

    <button
      type="button"
      class="rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      onclick={focusSpecsSection}
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-sm font-medium text-muted-foreground">{FIXED_LABELS.common.specs}</div>
          <div class="mt-2 text-3xl font-semibold text-foreground">{stats.value?.totalSpecs ?? specs.value.length}</div>
          <div class="mt-1 text-sm text-muted-foreground">{t(m.dashboard_specs_summary)}</div>
        </div>
        <IconBox icon={FileText} variant="success" />
      </div>
    </button>

    <button
      type="button"
      class="rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      onclick={openHomeSurface}
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <div class="text-sm font-medium text-muted-foreground">{FIXED_LABELS.dashboard.tasks}</div>
          <div class="mt-2 flex items-end gap-2">
            <span class="text-3xl font-semibold text-foreground">{overallTaskProgress.percentage}%</span>
            <span class="pb-1 text-sm text-muted-foreground">{overallTaskProgress.done}/{overallTaskProgress.total}</span>
          </div>
          <div class="mt-3"><Progress value={overallTaskProgress.percentage} /></div>
        </div>
        <IconBox icon={CheckSquare} variant="warning" />
      </div>
    </button>
  </div>

  <!-- Active Changes -->
  <div class="rounded-lg border border-border bg-card shadow-lg">
    <div class="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-4">
      <div>
        <h2 class="flex items-center gap-2 text-lg font-semibold text-foreground">
          <SquarePen class="h-5 w-5 text-muted-foreground" />
          {FIXED_LABELS.dashboard.activeChanges}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">{t(m.dashboard_active_changes_description)}</p>
      </div>

      {#if workspaceCommands.length > 0}
        <div class="flex max-w-full justify-end lg:max-w-lg">
          <CommandShortcutBar commands={workspaceCommands} />
        </div>
      {/if}
    </div>

    {#if activeChanges.value.length === 0}
      <div class="p-4">
        <EmptyState message={t(m.dashboard_no_active_changes)} icon={SquarePen} />
      </div>
    {:else}
      <div class="flex flex-col gap-2 p-4">
        {#each activeChanges.value as change}
          {@const changeCommands = changeCommandsFor(change)}
          <ItemContextMenu
            items={createItemContextMenuItems({
              kind: 'active-change',
              name: change.name,
              onOpenInNewTab: () => openActiveChange(change.name),
            })}
          >
            <div class="rounded-xl border border-border/70 bg-background/70 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary/40 hover:shadow-md">
              <button
                type="button"
                class="group w-full px-4 py-3 text-left"
                onclick={() => openActiveChange(change.name)}
              >
                <div class="flex items-start gap-3">
                  <div class="flex min-w-0 flex-1 items-center gap-3">
                    <IconBox icon={SquarePen} size="sm" variant="info" />
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <div class="truncate font-medium text-foreground">{change.name}</div>
                        {#if change.hasProposal}
                          <Badge variant="outline">{FIXED_LABELS.dashboard.proposal}</Badge>
                        {/if}
                        {#if change.hasDesign}
                          <Badge variant="outline">{FIXED_LABELS.common.design}</Badge>
                        {/if}
                      </div>
                      <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                        {#if changeUpdatedAt(change)}
                          <span class="flex items-center gap-1"><Calendar class="h-3.5 w-3.5" />{formatDashboardDate(changeUpdatedAt(change))}</span>
                        {/if}
                        <span class="flex items-center gap-1"><FileText class="h-3.5 w-3.5" />{getSpecDeltaCountLabel(change.specDeltaCount)}</span>
                        <span class="flex items-center gap-1"><CheckSquare class="h-3.5 w-3.5" />{getChangeTaskCountLabel(change.taskProgress.done, change.taskProgress.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex min-w-45 shrink-0 items-center gap-3">
                    <div class="min-w-0 flex-1 lg:w-36 lg:flex-none">
                      <div class="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{FIXED_LABELS.common.progress}</span>
                        <span>{change.taskProgress.percentage}%</span>
                      </div>
                      <Progress value={change.taskProgress.percentage} />
                    </div>
                    <ArrowRight class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </div>
              </button>

              {#if changeCommands.length > 0}
                <div class="border-t border-border/60 px-5 py-3">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{FIXED_LABELS.common.nextStep}</div>
                    <div class="flex max-w-full sm:justify-end">
                      <CommandShortcutBar commands={changeCommands} changeName={change.name} />
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </ItemContextMenu>
        {/each}
      </div>
    {/if}
  </div>

  {#if recentActivity.length > 0}
    <div class="rounded-lg border border-border bg-card shadow-sm">
      <div class="border-b border-border px-5 py-4">
        <h2 class="flex items-center gap-2 text-base font-semibold text-foreground">
          <History class="h-5 w-5 text-muted-foreground" />
          {FIXED_LABELS.dashboard.recentActivity}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">{t(m.dashboard_recent_activity_description)}</p>
      </div>
      <div class="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {#each recentActivity as item}
          <ItemContextMenu
            items={createItemContextMenuItems(
              item.kind === 'spec'
                ? {
                    kind: 'spec',
                    name: item.name,
                    onOpenInNewTab: item.open,
                    onSearchRelatedChanges: () => searchForSpec(item.name),
                  }
                : {
                    kind: item.kind,
                    name: item.name,
                    onOpenInNewTab: item.open,
                  },
            )}
          >
            <button
              type="button"
              class="group flex items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary/40 hover:shadow-md"
              onclick={item.open}
            >
              <IconBox
                icon={item.kind === 'spec' ? FileText : item.kind === 'archived-change' ? Archive : SquarePen}
                size="sm"
                variant={item.kind === 'spec' ? 'success' : item.kind === 'archived-change' ? 'muted' : 'info'}
              />
              <div class="min-w-0 flex-1">
                <div class="truncate font-medium text-foreground" title={item.title}>{item.title}</div>
                <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {#if item.date}
                    <span class="flex items-center gap-1"><Calendar class="h-3 w-3" />{formatDashboardDate(item.date)}</span>
                  {/if}
                  {#if item.specDeltaCount != null}
                    <span class="flex items-center gap-1"><FileText class="h-3 w-3" />{item.specDeltaCount}</span>
                  {/if}
                  {#if item.taskProgress}
                    <span class="flex items-center gap-1"><CheckSquare class="h-3 w-3" />{item.taskProgress.done}/{item.taskProgress.total}</span>
                  {/if}
                </div>
              </div>
              <ArrowRight class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </button>
          </ItemContextMenu>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Planning Context -->
  {#if planningContext}
    <div id="project-documentation" class="rounded-lg border border-border bg-card shadow-lg">
      <div class="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-4">
        <h2 class="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Bookmark class="h-5 w-5 text-muted-foreground" />
          {FIXED_LABELS.dashboard.planningContext}
        </h2>
        <Button variant="ghost" size="sm" onclick={openDocumentation}>
          <Bookmark class="h-4 w-4" />
          {FIXED_LABELS.dashboard.focusSection}
        </Button>
      </div>
      <div class="space-y-6 px-6 py-4">
        <div class="space-y-2">
          <p class="text-sm text-muted-foreground">
            {t(m.dashboard_planning_uses, { path: planningContext.source.path })}
          </p>

          {#if planningContextNotice.variant === 'warning'}
            <Callout variant={planningContextNotice.variant}>
              <p class="font-medium">{planningContextNotice.title}</p>
              <p class="mt-1 text-sm">
                {t(m.dashboard_migration_needed_description)}
              </p>
            </Callout>
          {:else if planningContextNotice.variant === 'info'}
            <Callout variant={planningContextNotice.variant}>
              <p>{t(m.dashboard_legacy_present_description)}</p>
            </Callout>
          {/if}
        </div>

        <section class="space-y-3">
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{FIXED_LABELS.dashboard.aiContext}</h3>
            <p class="mt-1 text-sm text-muted-foreground">{t(m.dashboard_ai_context_description)}</p>
          </div>

          {#if planningContext.aiContext}
            <div class="rounded-lg border border-border/70 bg-background/70 px-4 py-4">
              <MarkdownRenderer content={planningContext.aiContext} />
            </div>
          {:else}
            <div class="rounded-lg border border-dashed border-border/80 bg-background/40 px-4 py-4 text-sm text-muted-foreground">
              {t(m.dashboard_no_ai_context)}
            </div>
          {/if}
        </section>

        <section class="space-y-3">
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{FIXED_LABELS.dashboard.artifactRules}</h3>
            <p class="mt-1 text-sm text-muted-foreground">{t(m.dashboard_artifact_rules_description)}</p>
          </div>

          {#if hasArtifactRules}
            <div class="space-y-3">
              {#each planningContext.artifactRules as ruleSection}
                <div class="rounded-lg border border-border/70 bg-background/70 p-4">
                  <div class="flex items-center gap-2">
                    <Badge variant="outline">{ruleSection.artifactId}</Badge>
                    <span class="text-sm font-medium text-foreground">{ruleSection.title}</span>
                  </div>

                  <div class="mt-3 space-y-3">
                    {#each ruleSection.items as item}
                      <div>
                        <div class="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{item.label}</div>
                        <div class="mt-1 rounded-md bg-secondary/50 px-3 py-2 text-sm whitespace-pre-wrap text-foreground">{item.value}</div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="rounded-lg border border-dashed border-border/80 bg-background/40 px-4 py-4 text-sm text-muted-foreground">
              {t(m.dashboard_no_artifact_rules)}
            </div>
          {/if}
        </section>

        <section class="space-y-3">
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{FIXED_LABELS.dashboard.workflowSchema}</h3>
            <p class="mt-1 text-sm text-muted-foreground">{t(m.dashboard_workflow_schema_description)}</p>
          </div>

          <div class="rounded-lg border border-border/70 bg-background/70 px-4 py-3">
            <span class="font-medium text-foreground">{planningContext.workflowSchema || getWorkflowSchemaFallbackLabel()}</span>
          </div>
        </section>

        {#if legacyProjectDoc}
          <section class="space-y-3">
            <Collapsible.Root
              open={legacyProjectDocOpen}
              onOpenChange={(open) => {
                legacyProjectDocOpen = open;
              }}
              class="overflow-hidden rounded-lg border border-border/70 bg-background/70"
            >
              <div class="border-b border-border/70 px-4 py-3">
                <Collapsible.Trigger class="flex w-full items-center justify-between px-0 py-0 text-left">
                  <span class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-foreground">{FIXED_LABELS.dashboard.legacyProjectDoc}</span>
                    <Badge variant="outline">{FIXED_LABELS.dashboard.badges.legacy}</Badge>
                  </span>
                  {#if legacyProjectDocOpen}
                    <ChevronDown class="h-4 w-4 text-muted-foreground" />
                  {:else}
                    <ChevronRight class="h-4 w-4 text-muted-foreground" />
                  {/if}
                </Collapsible.Trigger>
              </div>

              <Collapsible.Content>
                <div class="space-y-3 px-4 py-4">
                  <p class="text-sm text-muted-foreground">
                    {t(m.dashboard_legacy_doc_description)}
                  </p>
                  <MarkdownRenderer content={legacyProjectDoc.content} />
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          </section>
        {/if}
      </div>
    </div>
  {/if}
</div>
