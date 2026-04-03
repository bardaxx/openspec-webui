<script lang="ts">
  import type { ExpandedCommand, AiTool } from '../lib/commandTypes';
  import { EXPANDED_COMMANDS, EXPANDED_COMMAND_LABELS } from '../lib/commandTypes';
  import { buildCommand, isExpandedCommandAvailable } from '../lib/commandShortcuts';
  import Modal from './Modal.svelte';
  import { commandPreferencesStore } from '../stores/commandPreferences';

  export let open = false;
  export let onClose: () => void = () => {};

  function setAiTool(aiTool: AiTool) {
    commandPreferencesStore.setAiTool(aiTool);
  }

  function toggleCommand(command: ExpandedCommand, event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    commandPreferencesStore.setExpandedVisibility(command, target.checked);
  }

  $: previewCommand = buildCommand('propose', $commandPreferencesStore.aiTool);
  $: availabilityReady = $commandPreferencesStore.availability.status === 'ready';
</script>

<Modal
  {open}
  title="Command Settings"
  description="Choose the OpenSpec command syntax and which expanded commands can appear in the UI."
  size="lg"
  {onClose}
>
  <div class="space-y-6">
    <section class="space-y-3">
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-400">AI Tool</h3>
        <p class="mt-1 text-sm text-gray-400">The selected tool controls whether copied commands use `/opsx-*` or `/opsx:*` syntax.</p>
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-4 text-sm text-gray-200">
          <input
            type="radio"
            name="ai-tool"
            class="mt-1"
            checked={$commandPreferencesStore.aiTool === 'default'}
            onchange={() => setAiTool('default')}
          />
          <div>
            <div class="font-medium text-gray-100">Default</div>
            <div class="mt-1 text-gray-400">Uses workspace-friendly commands like <code class="rounded bg-gray-950 px-1.5 py-0.5 text-xs text-blue-300">/opsx-propose</code>.</div>
          </div>
        </label>

        <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-700 bg-gray-900/50 p-4 text-sm text-gray-200">
          <input
            type="radio"
            name="ai-tool"
            class="mt-1"
            checked={$commandPreferencesStore.aiTool === 'claude-code'}
            onchange={() => setAiTool('claude-code')}
          />
          <div>
            <div class="font-medium text-gray-100">Claude Code</div>
            <div class="mt-1 text-gray-400">Uses Claude-style commands like <code class="rounded bg-gray-950 px-1.5 py-0.5 text-xs text-blue-300">/opsx:propose</code>.</div>
          </div>
        </label>
      </div>

      <div class="rounded-lg border border-blue-900/60 bg-blue-950/30 px-4 py-3 text-sm text-blue-200">
        Preview: <code class="rounded bg-gray-950 px-1.5 py-0.5 text-xs text-blue-300">{previewCommand}</code>
      </div>
    </section>

    <section class="space-y-3">
      <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-400">Expanded Commands</h3>
          <p class="mt-1 text-sm text-gray-400">Core commands (`propose`, `explore`, `apply`, `archive`) are always shown when their page context applies.</p>
        </div>

        <div class="text-right text-sm text-gray-400">
          {#if $commandPreferencesStore.availabilityLoading}
            <div>Checking local OpenSpec workflows...</div>
          {:else if availabilityReady}
            <div>Local profile: <span class="font-medium text-gray-200">{$commandPreferencesStore.availability.profile || 'unknown'}</span></div>
          {:else}
            <div class="text-amber-300">Workflow availability unavailable</div>
          {/if}
        </div>
      </div>

      {#if !availabilityReady}
        <div class="rounded-lg border border-amber-800/70 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          Expanded command availability could not be loaded from the local OpenSpec CLI, so these controls are disabled.
          {#if $commandPreferencesStore.availability.error}
            <div class="mt-1 text-xs text-amber-300/90">{$commandPreferencesStore.availability.error}</div>
          {/if}
        </div>
      {/if}

      <div class="divide-y divide-gray-700 overflow-hidden rounded-lg border border-gray-700 bg-gray-900/50">
        {#each EXPANDED_COMMANDS as command}
          {@const isAvailable = isExpandedCommandAvailable(command, $commandPreferencesStore.availability)}
          <label class="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <div>
              <div class="font-medium text-gray-100">{EXPANDED_COMMAND_LABELS[command]}</div>
              <div class="mt-1 text-xs text-gray-400">
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
              checked={$commandPreferencesStore.expandedVisibility[command]}
              disabled={!availabilityReady || !isAvailable || $commandPreferencesStore.availabilityLoading}
              onchange={(event) => toggleCommand(command, event)}
            />
          </label>
        {/each}
      </div>
    </section>

    <div class="flex justify-end">
      <button
        type="button"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        onclick={onClose}
      >
        Done
      </button>
    </div>
  </div>
</Modal>
