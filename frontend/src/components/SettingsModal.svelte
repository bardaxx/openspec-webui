<script lang="ts">
  import { Command, ListChecks, Settings } from '@lucide/svelte';
  import { Callout } from '$lib/components/ui/callout';
  import { DialogHeader as SharedDialogHeader } from '$lib/components/ui/dialog-header';
  import * as Dialog from '$lib/components/ui/dialog';
  import type { CommandFormat, WorkflowCommand } from '../lib/commandTypes';
  import {
    CORE_COMMANDS,
    CORE_COMMAND_LABELS,
    EXPANDED_COMMANDS,
    EXPANDED_COMMAND_LABELS,
  } from '../lib/commandTypes';
  import {
    buildCommand,
    isExpandedCommandAvailable,
  } from '../lib/commandShortcuts';
  import { commandPreferencesStore } from '../stores/commandPreferences.svelte.ts';
  import { tabStore } from '../stores/tabs.svelte.ts';
  import { themeStore, type Theme } from '../stores/theme.svelte.ts';
  import { uiPreferencesStore } from '../stores/uiPreferences.svelte.ts';

  interface Props {
    open?: boolean;
    onClose?: () => void;
  }

  let { open = false, onClose = () => {} }: Props = $props();

  type Section = 'general' | 'workflow' | 'commands';

  const sections: Array<{
    id: Section;
    label: string;
    icon: typeof Settings;
  }> = [
    {
      id: 'general',
      label: 'General',
      icon: Settings
    },
    {
      id: 'workflow',
      label: 'Workflow',
      icon: Command
    },
    {
      id: 'commands',
      label: 'Commands',
      icon: ListChecks
    }
  ];

  let activeSection = $state<Section>('general');

  function setFormat(format: CommandFormat) {
    commandPreferencesStore.setFormat(format);
  }

  function setTheme(theme: Theme) {
    themeStore.setTheme(theme);
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
</script>

<Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
  <Dialog.Overlay />
  <Dialog.Content class="max-w-3xl gap-0 p-0 xl:max-w-4xl">
    <SharedDialogHeader
      icon={Settings}
      title="Settings"
      description="Theme and command preferences"
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
        {#if activeSection === 'general'}
          <section class="space-y-3">
            <div>
              <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Theme</h3>
              <p class="mt-1 text-sm text-muted-foreground">Choose the color theme for the interface.</p>
            </div>

            <div class="grid gap-3 md:grid-cols-3">
              <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-sm text-card-foreground">
                <input
                  type="radio"
                  name="theme"
                  class="mt-1"
                  checked={themeStore.value === 'light'}
                  onchange={() => setTheme('light')}
                />
                <div>
                  <div class="font-medium text-foreground">Light</div>
                  <div class="mt-1 text-muted-foreground">Light background with dark text.</div>
                </div>
              </label>

              <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-sm text-card-foreground">
                <input
                  type="radio"
                  name="theme"
                  class="mt-1"
                  checked={themeStore.value === 'dark'}
                  onchange={() => setTheme('dark')}
                />
                <div>
                  <div class="font-medium text-foreground">Dark</div>
                  <div class="mt-1 text-muted-foreground">Dark background with light text.</div>
                </div>
              </label>

              <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-sm text-card-foreground">
                <input
                  type="radio"
                  name="theme"
                  class="mt-1"
                  checked={themeStore.value === 'system'}
                  onchange={() => setTheme('system')}
                />
                <div>
                  <div class="font-medium text-foreground">System</div>
                  <div class="mt-1 text-muted-foreground">Follow your operating system setting.</div>
                </div>
              </label>
            </div>

            <div class="pt-4">
              <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Explorer</h3>
              <p class="mt-1 text-sm text-muted-foreground">Control whether single-click in the Explorer opens a reusable preview tab or a normal confirmed tab.</p>
            </div>

            <label class="flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary/50 p-4 text-sm text-card-foreground">
              <div>
                <div class="font-medium text-foreground">Enable preview tabs</div>
                <div class="mt-1 text-muted-foreground">On by default. When enabled, single-click reuses one preview tab. Use Ctrl+Click or the item context menu to open a regular tab.</div>
              </div>

              <input
                type="checkbox"
                checked={uiPreferencesStore.previewTabsEnabled}
                aria-label="Enable preview tabs"
                onchange={togglePreviewTabs}
              />
            </label>
          </section>
        {:else if activeSection === 'workflow'}
          <section class="space-y-3">
            <div>
              <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Workflow</h3>
              <p class="mt-1 text-sm text-muted-foreground">Choose how copied OpenSpec workflow text should be formatted for your coding tool.</p>
              <p class="mt-1 text-xs text-muted-foreground">
                See OpenSpec docs:
                <a href="https://github.com/Fission-AI/OpenSpec/blob/main/docs/opsx.md" target="_blank" class="underline hover:text-foreground">OPSX Reference</a> ·
                <a href="https://github.com/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md" target="_blank" class="underline hover:text-foreground">Supported Tools</a>
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
                  <div class="font-medium text-foreground">Standard</div>
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
                  <div class="font-medium text-foreground">Claude Code</div>
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
                  <div class="font-medium text-foreground">Skill</div>
                  <div class="mt-1 text-muted-foreground"><code class="rounded bg-background px-1.5 py-0.5 text-xs text-primary">/openspec-propose</code></div>
                </div>
              </label>
            </div>

            <Callout variant="info">
              <div class="space-y-1 text-sm">
                <div>
                  Workspace: <code class="rounded bg-background px-1.5 py-0.5 text-xs text-primary">{previewWorkspaceCommand}</code>
                </div>
                <div>
                  Change: <code class="rounded bg-background px-1.5 py-0.5 text-xs text-primary">{previewChangeCommand}</code>
                </div>
              </div>
            </Callout>
          </section>
        {:else if activeSection === 'commands'}
          <section class="space-y-3">
            <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Commands</h3>
                <p class="mt-1 text-sm text-muted-foreground">Toggle which workflow shortcuts should appear in workspace and change command rows.</p>
                <p class="mt-1 text-xs text-muted-foreground">
                  See OpenSpec docs:
                  <a href="https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md" target="_blank" class="underline hover:text-foreground">Commands</a> ·
                  <a href="https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md" target="_blank" class="underline hover:text-foreground">Workflows</a>
                </p>
              </div>

              <div class="text-right text-sm text-muted-foreground">
                {#if commandPreferencesStore.availabilityLoading}
                  <div>Checking local OpenSpec workflows...</div>
                {:else if availabilityReady}
                  <div>Local profile: <span class="font-medium text-card-foreground">{commandPreferencesStore.availability.profile || 'unknown'}</span></div>
                {:else}
                  <div class="text-warning">Workflow availability unavailable</div>
                {/if}
              </div>
            </div>

            <div class="space-y-2">
              <div>
                <h4 class="text-sm font-semibold text-foreground">Core Commands</h4>
                <p class="mt-1 text-sm text-muted-foreground">Always available. Visibility only affects contexts where each command normally appears.</p>
              </div>

              <div class="divide-y divide-border overflow-hidden rounded-lg border border-border bg-secondary/50">
                {#each CORE_COMMANDS as command}
                  <label class="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <div>
                      <div class="font-medium text-foreground">{CORE_COMMAND_LABELS[command]}</div>
                      <div class="mt-1 text-xs text-muted-foreground">
                        Always available from the WebUI.
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
                Expanded command availability could not be loaded from the local OpenSpec CLI, so these controls are disabled.
                {#if commandPreferencesStore.availability.error}
                  <div class="mt-1 text-xs text-warning">{commandPreferencesStore.availability.error}</div>
                {/if}
              </Callout>
            {/if}

            <div class="space-y-2">
              <div>
                <h4 class="text-sm font-semibold text-foreground">Expanded Commands</h4>
                <p class="mt-1 text-sm text-muted-foreground">These commands depend on local OpenSpec workflow availability.</p>
              </div>

              <div class="divide-y divide-border overflow-hidden rounded-lg border border-border bg-secondary/50">
                {#each EXPANDED_COMMANDS as command}
                  {@const isAvailable = isExpandedCommandAvailable(command, commandPreferencesStore.availability)}
                  <label class="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <div>
                      <div class="font-medium text-foreground">{EXPANDED_COMMAND_LABELS[command]}</div>
                      <div class="mt-1 text-xs text-muted-foreground">
                        {#if availabilityReady}
                          {#if isAvailable}
                            Available from the local OpenSpec workflows.
                          {:else}
                            Not available from the local OpenSpec workflows.
                          {/if}
                        {:else}
                          Waiting for workflow availability.
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
