<script lang="ts">
  import { specs, navigateTo } from '../stores/index';
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-on-bg">Specifications</h1>
    <p class="text-on-surface-muted mt-1">Current truth - what IS built</p>
  </div>

  <div class="bg-surface rounded-lg shadow-lg border border-border">
    <div class="divide-y divide-border">
      {#if $specs.length === 0}
        <div class="px-6 py-8 text-center text-on-surface-muted">
          No specifications found
        </div>
      {:else}
        {#each $specs as spec}
          <button
            class="w-full px-6 py-4 hover:bg-surface/50 text-left flex items-center justify-between"
            onclick={() => navigateTo(`/specs/${spec.name}`)}
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-success-bg">
                <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-on-bg">{spec.name}</div>
                <div class="text-sm text-on-surface-muted">
                  {spec.hasDesign ? 'spec + design' : 'spec only'}
                </div>
              </div>
            </div>
            <svg class="w-5 h-5 text-on-surface-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {/each}
      {/if}
    </div>
  </div>
</div>
