<script lang="ts">
  import { suggestionStore } from '../stores/suggestions';
  import { generatePrompt } from '../lib/promptGenerator';
  import { addToast } from '../stores/index';
  import type { Change } from '../lib/api';

  export let changeName: string;
  export let change: Change | null;

  let showPromptModal = false;
  let generatedPrompt = '';

  $: suggestions = $suggestionStore.suggestions;

  function truncateText(text: string, maxLength: number = 60): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  function handleEdit(suggestion: typeof suggestions[0]) {
    // Find the block element and simulate clicking it
    const block = document.querySelector(`[data-block-id="${suggestion.blockId}"]`);
    if (block) {
      const rect = block.getBoundingClientRect();
      suggestionStore.selectBlock(suggestion.blockId, {
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8,
      });
      // Scroll block into view
      block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function handleRemove(id: string) {
    suggestionStore.removeSuggestion(id);
  }

  function handleGeneratePrompt() {
    if (!change) return;
    generatedPrompt = generatePrompt(changeName, change, suggestions);
    showPromptModal = true;
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      addToast('Instructions copied to clipboard!', 'success');
      showPromptModal = false;
    } catch {
      addToast('Failed to copy prompt', 'error');
    }
  }

  function handleCloseModal() {
    showPromptModal = false;
  }

  function handleExit() {
    suggestionStore.exitSuggestionMode();
  }
</script>

<!-- Side panel -->
<div class="fixed top-0 right-0 h-full w-96 bg-surface border-l border-border shadow-xl z-40 flex flex-col">
  <!-- Header -->
  <div class="flex items-center justify-between p-4 border-b border-border">
    <h2 class="text-lg font-semibold text-on-bg">Suggestions</h2>
    <button
      onclick={handleExit}
      class="p-1 hover:bg-surface rounded transition-colors"
      title="Exit suggestion mode"
    >
      <svg class="w-5 h-5 text-on-surface-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <!-- Instructions -->
  <div class="border-b border-border bg-info-bg px-4 py-3">
    <p class="text-sm text-info">
      Click on any text block in the proposal to add a suggestion.
    </p>
  </div>

  <!-- Suggestions list -->
  <div class="flex-1 overflow-y-auto p-4 space-y-3">
    {#if suggestions.length === 0}
      <div class="text-center text-on-surface-muted py-8">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <p>No suggestions yet</p>
        <p class="text-xs mt-1">Click on a text block to add one</p>
      </div>
    {:else}
      {#each suggestions as suggestion, index}
        <div class="bg-surface-alt/50 rounded-lg p-3 border border-border">
          <div class="flex items-start justify-between mb-2">
            <span class="text-xs font-medium text-on-surface-muted">Suggestion {index + 1}</span>
            <div class="flex gap-1">
              <button
                onclick={() => handleEdit(suggestion)}
                class="p-1 hover:bg-surface rounded text-on-surface-muted hover:text-on-surface transition-colors"
                title="Edit suggestion"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onclick={() => handleRemove(suggestion.id)}
                class="rounded p-1 text-on-surface-muted transition-colors hover:bg-surface hover:text-danger"
                title="Remove suggestion"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div class="text-xs text-on-surface-muted mb-1">Original:</div>
          <div class="text-sm text-on-surface-muted bg-surface rounded p-2 mb-2 line-clamp-2">
            {truncateText(suggestion.originalText, 80)}
          </div>
          <div class="text-xs text-on-surface-muted mb-1">Suggested:</div>
          <div class="text-sm text-on-surface bg-surface rounded p-2 line-clamp-3">
            {truncateText(suggestion.suggestedChange, 120)}
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Footer -->
  <div class="p-4 border-t border-border">
      <button
        onclick={handleGeneratePrompt}
      disabled={suggestions.length === 0}
      class="w-full py-2.5 bg-brand text-on-brand rounded-lg font-medium
             hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors flex items-center justify-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
      </svg>
      Generate Instructions
    </button>
    <p class="text-xs text-on-surface-muted text-center mt-2">
      {suggestions.length} suggestion{suggestions.length === 1 ? '' : 's'}
    </p>
  </div>
</div>

<!-- Prompt Modal -->
{#if showPromptModal}
  <div class="fixed inset-0 bg-overlay z-50 flex items-center justify-center p-4">
    <div class="bg-surface rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
      <!-- Modal header -->
      <div class="flex items-center justify-between p-4 border-b border-border">
        <h3 class="text-lg font-semibold text-on-bg">Generated Instructions</h3>
        <button
          onclick={handleCloseModal}
          class="p-1 hover:bg-surface rounded transition-colors"
          title="Close modal"
        >
          <svg class="w-5 h-5 text-on-surface-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal content -->
      <div class="flex-1 overflow-y-auto p-4">
        <pre class="text-sm text-on-surface whitespace-pre-wrap bg-surface-alt rounded-lg p-4 font-mono">{generatedPrompt}</pre>
      </div>

      <!-- Modal footer -->
      <div class="flex justify-end gap-3 p-4 border-t border-border">
        <button
          onclick={handleCloseModal}
          class="px-4 py-2 text-on-surface-muted hover:text-on-surface transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={handleCopyPrompt}
          class="px-4 py-2 bg-brand text-on-brand rounded-lg font-medium
                 hover:bg-brand-hover transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy to Clipboard
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .line-clamp-2 {
    line-clamp: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    line-clamp: 3;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
