<script lang="ts">
  export let open = false;
  export let title = '';
  export let description: string | null = null;
  export let size: 'md' | 'lg' = 'md';
  export let onClose: () => void = () => {};

  $: maxWidthClass = size === 'lg' ? 'max-w-3xl' : 'max-w-2xl';

  function handleWindowKeydown(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" role="presentation">
    <button
      type="button"
      class="absolute inset-0 bg-gray-950/80"
      aria-label="Close dialog"
      onclick={onClose}
    ></button>

    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      class={`relative z-10 w-full ${maxWidthClass} rounded-xl border border-gray-700 bg-gray-800 shadow-2xl`}
    >
      <div class="flex items-start justify-between gap-4 border-b border-gray-700 px-6 py-4">
        <div>
          <h2 id="modal-title" class="text-lg font-semibold text-gray-100">{title}</h2>
          {#if description}
            <p class="mt-1 text-sm text-gray-400">{description}</p>
          {/if}
        </div>
        <button
          type="button"
          aria-label="Close dialog"
          title="Close"
          class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
          onclick={onClose}
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="px-6 py-5">
        <slot />
      </div>
    </div>
  </div>
{/if}
