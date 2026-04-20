<script lang="ts">
  import { Command, ListChecks, Settings, Sun, Moon, Monitor } from '@lucide/svelte';
  import { Callout } from '$lib/components/shared/callout';
  import { DialogHeader as SharedDialogHeader } from '$lib/components/shared/dialog-header';
  import * as Dialog from '$lib/components/ui/dialog';
  import { t } from '$lib/i18n';
  import { LOCALE_LABELS, localeStore, type AppLocale } from '$lib/state/locale.svelte.ts';
  import * as m from '$lib/paraglide/messages.js';
  import { FIXED_LABELS, getWorkflowCommandLabel } from '$lib/uiText';
  import type { CommandFormat, WorkflowCommand } from '$lib/types/commandTypes';
  import {
    CORE_COMMANDS,
    EXPANDED_COMMANDS,
  } from '$lib/types/commandTypes';
  import {
    buildCommand,
    isExpandedCommandAvailable,
  } from '$lib/commandShortcuts';
  import { commandPreferencesStore } from '$lib/state/commandPreferences.svelte.ts';
  import { tabStore } from '$lib/state/tabs.svelte.ts';
  import { themeStore, type Theme } from '$lib/state/theme.svelte.ts';
  import { uiPreferencesStore } from '$lib/state/uiPreferences.svelte.ts';

  interface Props {
    open?: boolean;
    onClose?: () => void;
  }

  let { open = false, onClose = () => {} }: Props = $props();

  type Section = 'general' | 'workflow' | 'commands';

  let sections = $derived([
    {
      id: 'general' as const,
      label: FIXED_LABELS.settings.sections.general,
      icon: Settings
    },
    {
      id: 'workflow' as const,
      label: FIXED_LABELS.settings.sections.workflow,
      icon: Command
    },
    {
      id: 'commands' as const,
      label: FIXED_LABELS.settings.sections.commands,
      icon: ListChecks
    }
  ]);

  let activeSection = $state<Section>('general');

  function setFormat(format: CommandFormat) {
    commandPreferencesStore.setFormat(format);
  }

  function setTheme(theme: Theme) {
    themeStore.setTheme(theme);
  }

  function setLocale(locale: AppLocale) {
    void localeStore.setLocale(locale);
  }

  function togglePreviewTabs(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    uiPreferencesStore.setPreviewTabsEnabled(target.checked);

    if (!target.checked) {
      tabStore.confirmAllPreviewTabs();
    }
  }

  function toggleCommand(command: WorkflowCommand, event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    commandPreferencesStore.setCommandVisibility(command, target.checked);
  }

  $effect(() => {
    if (open) {
      activeSection = 'general';
    }
  });

  let previewWorkspaceCommand = $derived(buildCommand('propose', commandPreferencesStore.format));
  let previewChangeCommand = $derived(buildCommand('apply', commandPreferencesStore.format, 'my-change'));
  let availabilityReady = $derived(commandPreferencesStore.availability.status === 'ready');
  function getLocaleHeadingLabel() {
    return FIXED_LABELS.settings.headings.language;
  }
</script>

<Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
  <Dialog.Overlay />
  <Dialog.Content class="max-w-3xl gap-0 p-0 xl:max-w-4xl">
    <SharedDialogHeader
      icon={Settings}
      title={FIXED_LABELS.settings.title}
      description={t(m.settings_description)}
      onClose={onClose}
    />

    <div class="flex h-[60vh] min-h-0 flex-col gap-6 overflow-hidden lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside class="shrink-0 overflow-y-auto border-b border-border px-6 pb-4 pt-5 lg:min-h-0 lg:border-b-0 lg:border-r lg:px-5 lg:pb-5 lg:pt-5">
        <div class="grid auto-rows-fr grid-cols-3 gap-2 lg:grid-cols-1">
          {#each sections as section}
            {@const SectionIcon = section.icon}
          <button
            type="button"
              class={`flex h-full w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${activeSection === section.id
              ? 'border-primary bg-primary/10 text-foreground'
              : 'border-transparent bg-secondary/50 text-card-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground'}`}
            aria-current={activeSection === section.id ? 'page' : undefined}
            onclick={() => (activeSection = section.id)}
          >
            <SectionIcon class="mt-0.5 h-5 w-5 shrink-0" />
            <div class="min-w-0 flex-1">
              <div class="font-medium">{section.label}</div>
            </div>
          </button>
          {/each}
        </div>
      </aside>
      
      <div class="min-h-0 min-w-0 overflow-y-auto px-6 pb-6 pt-5 lg:pr-8">
        <!-- general tab -->
        {#if activeSection === 'general'}
          <section class="space-y-3">
            <div>
              <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{FIXED_LABELS.settings.headings.theme}</h3>
              <p class="mt-1 text-sm text-muted-foreground">{t(m.settings_theme_description)}</p>
            </div>

            <div class="grid gap-3 md:grid-cols-3">
              <label class="group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all hover:border-primary/50 {themeStore.value === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30'}">
                <input
                  type="radio"
                  name="theme"
                  class="sr-only"
                  checked={themeStore.value === 'light'}
                  onchange={() => setTheme('light')}
                />
                <div class="rounded-full bg-background p-3 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <Sun class="h-6 w-6 text-foreground" />
                </div>
                <div class="space-y-1">
                  <div class="font-medium text-foreground">{FIXED_LABELS.settings.themeOptions.light}</div>
                  <div class="text-xs text-muted-foreground">{t(m.settings_theme_light_description)}</div>
                </div>
              </label>

              <label class="group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all hover:border-primary/50 {themeStore.value === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30'}">
                <input
                  type="radio"
                  name="theme"
                  class="sr-only"
                  checked={themeStore.value === 'dark'}
                  onchange={() => setTheme('dark')}
                />
                <div class="rounded-full bg-background p-3 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <Moon class="h-6 w-6 text-foreground" />
                </div>
                <div class="space-y-1">
                  <div class="font-medium text-foreground">{FIXED_LABELS.settings.themeOptions.dark}</div>
                  <div class="text-xs text-muted-foreground">{t(m.settings_theme_dark_description)}</div>
                </div>
              </label>

              <label class="group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all hover:border-primary/50 {themeStore.value === 'system' ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30'}">
                <input
                  type="radio"
                  name="theme"
                  class="sr-only"
                  checked={themeStore.value === 'system'}
                  onchange={() => setTheme('system')}
                />
                <div class="rounded-full bg-background p-3 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <Monitor class="h-6 w-6 text-foreground" />
                </div>
                <div class="space-y-1">
                  <div class="font-medium text-foreground">{FIXED_LABELS.settings.themeOptions.system}</div>
                  <div class="text-xs text-muted-foreground">{t(m.settings_theme_system_description)}</div>
                </div>
              </label>
            </div>

            <div class="space-y-3 pt-6">
              <div>
                <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{getLocaleHeadingLabel()}</h3>
              </div>
              <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-start">
                <p class="text-sm text-muted-foreground pt-1.5">{t(m.settings_language_description)}</p>
                <select
                  class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 sm:justify-self-end"
                  value={localeStore.value}
                  aria-label={getLocaleHeadingLabel()}
                  onchange={(event) => setLocale((event.currentTarget as HTMLSelectElement).value as AppLocale)}
                >
                  {#each localeStore.supportedLocales as locale}
                    <option value={locale}>{LOCALE_LABELS[locale]}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="pt-4">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{FIXED_LABELS.settings.headings.explorer}</h3>
              <p class="mt-1 text-sm text-muted-foreground">{t(m.settings_explorer_description)}</p>
            </div>

            <label class="flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary/50 p-4 text-sm text-card-foreground">
              <div>
                <div class="font-medium text-foreground">{FIXED_LABELS.settings.enablePreviewTabs}</div>
                <div class="mt-1 text-muted-foreground">{t(m.settings_enable_preview_tabs_description)}</div>
              </div>

              <input
                type="checkbox"
                checked={uiPreferencesStore.previewTabsEnabled}
                aria-label={FIXED_LABELS.settings.enablePreviewTabs}
                onchange={togglePreviewTabs}
              />
            </label>
          </section>
        
        <!-- workflow tab -->
        {:else if activeSection === 'workflow'}
          <section class="space-y-3">
            <div>
              <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{FIXED_LABELS.settings.headings.workflow}</h3>
              <p class="mt-1 text-sm text-muted-foreground">{t(m.settings_workflow_description)}</p>
              <p class="mt-1 text-xs text-muted-foreground">
                {t(m.settings_docs_intro)}
                <a href="https://github.com/Fission-AI/OpenSpec/blob/main/docs/opsx.md" target="_blank" class="underline hover:text-foreground">{FIXED_LABELS.settings.docs.opsxReference}</a> ·
                <a href="https://github.com/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md" target="_blank" class="underline hover:text-foreground">{FIXED_LABELS.settings.docs.supportedTools}</a>
              </p>
            </div>

            <div class="grid gap-3 md:grid-cols-3">
              <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-sm text-card-foreground">
                <input
                  type="radio"
                  name="workflow"
                  class="mt-1"
                  checked={commandPreferencesStore.format === 'standard'}
                  onchange={() => setFormat('standard')}
                />
                <div>
                  <div class="font-medium text-foreground">{FIXED_LABELS.settings.workflowFormats.standard}</div>
                  <div class="mt-1 text-muted-foreground"><code class="rounded bg-background px-1.5 py-0.5 text-xs text-primary">/opsx-propose</code></div>
                </div>
              </label>

              <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-sm text-card-foreground">
                <input
                  type="radio"
                  name="workflow"
                  class="mt-1"
                  checked={commandPreferencesStore.format === 'claude-code'}
                  onchange={() => setFormat('claude-code')}
                />
                <div>
                  <div class="font-medium text-foreground">{FIXED_LABELS.settings.workflowFormats.claudeCode}</div>
                  <div class="mt-1 text-muted-foreground"><code class="rounded bg-background px-1.5 py-0.5 text-xs text-primary">/opsx:propose</code></div>
                </div>
              </label>

              <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-sm text-card-foreground">
                <input
                  type="radio"
                  name="workflow"
                  class="mt-1"
                  checked={commandPreferencesStore.format === 'skill'}
                  onchange={() => setFormat('skill')}
                />
                <div>
                  <div class="font-medium text-foreground">{FIXED_LABELS.settings.workflowFormats.skill}</div>
                  <div class="mt-1 text-muted-foreground"><code class="rounded bg-background px-1.5 py-0.5 text-xs text-primary">/openspec-propose</code></div>
                </div>
              </label>
            </div>

            <Callout variant="info">
              <div class="space-y-1 text-sm">
                <div>
                  {FIXED_LABELS.settings.workspaceCommand}: <code class="rounded bg-background px-1.5 py-0.5 text-xs text-primary">{previewWorkspaceCommand}</code>
                </div>
                <div>
                  {FIXED_LABELS.settings.changeCommand}: <code class="rounded bg-background px-1.5 py-0.5 text-xs text-primary">{previewChangeCommand}</code>
                </div>
              </div>
            </Callout>
          </section>
        
        <!-- commands tab -->
        {:else if activeSection === 'commands'}
          <section class="space-y-3">
            <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{FIXED_LABELS.settings.headings.commands}</h3>
                <p class="mt-1 text-sm text-muted-foreground">{t(m.settings_commands_description)}</p>
                <p class="mt-1 text-xs text-muted-foreground">
                  {t(m.settings_docs_intro)}
                  <a href="https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md" target="_blank" class="underline hover:text-foreground">{FIXED_LABELS.settings.docs.commands}</a> ·
                  <a href="https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md" target="_blank" class="underline hover:text-foreground">{FIXED_LABELS.settings.docs.workflows}</a>
                </p>
              </div>

              <div class="text-right text-sm text-muted-foreground">
                {#if commandPreferencesStore.availabilityLoading}
                  <div>{t(m.settings_commands_checking)}</div>
                {:else if availabilityReady}
                  <div>{t(m.settings_commands_profile, { profile: commandPreferencesStore.availability.profile || t(m.settings_profile_unknown) })}</div>
                {:else}
                  <div class="text-warning">{t(m.settings_commands_unavailable)}</div>
                {/if}
              </div>
            </div>

            <div class="space-y-2">
              <div>
                <h4 class="text-sm font-semibold text-foreground">{FIXED_LABELS.settings.headings.coreCommands}</h4>
                <p class="mt-1 text-sm text-muted-foreground">{t(m.settings_core_commands_description)}</p>
              </div>

              <div class="divide-y divide-border overflow-hidden rounded-lg border border-border bg-secondary/50">
                {#each CORE_COMMANDS as command}
                  <label class="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <div>
                      <div class="font-medium text-foreground">{getWorkflowCommandLabel(command)}</div>
                      <div class="mt-1 text-xs text-muted-foreground">
                        {t(m.settings_core_commands_always_available)}
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={commandPreferencesStore.commandVisibility[command]}
                      onchange={(event) => toggleCommand(command, event)}
                    />
                  </label>
                {/each}
              </div>
            </div>

            {#if !availabilityReady}
              <Callout variant="warning">
                {t(m.settings_expanded_commands_disabled)}
                {#if commandPreferencesStore.availability.error}
                  <div class="mt-1 text-xs text-warning">{commandPreferencesStore.availability.error}</div>
                {/if}
              </Callout>
            {/if}

            <div class="space-y-2">
              <div>
                <h4 class="text-sm font-semibold text-foreground">{FIXED_LABELS.settings.headings.expandedCommands}</h4>
                <p class="mt-1 text-sm text-muted-foreground">{t(m.settings_expanded_commands_description)}</p>
              </div>

              <div class="divide-y divide-border overflow-hidden rounded-lg border border-border bg-secondary/50">
                {#each EXPANDED_COMMANDS as command}
                  {@const isAvailable = isExpandedCommandAvailable(command, commandPreferencesStore.availability)}
                  <label class="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <div>
                      <div class="font-medium text-foreground">{getWorkflowCommandLabel(command)}</div>
                      <div class="mt-1 text-xs text-muted-foreground">
                        {#if availabilityReady}
                          {#if isAvailable}
                            {t(m.settings_expanded_available)}
                          {:else}
                            {t(m.settings_expanded_unavailable)}
                          {/if}
                        {:else}
                          {t(m.settings_expanded_waiting)}
                        {/if}
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={commandPreferencesStore.commandVisibility[command]}
                      disabled={!availabilityReady || !isAvailable || commandPreferencesStore.availabilityLoading}
                      onchange={(event) => toggleCommand(command, event)}
                    />
                  </label>
                {/each}
              </div>
            </div>
          </section>
        {/if}
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
