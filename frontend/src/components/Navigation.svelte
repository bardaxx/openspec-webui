<script lang="ts">
  import { currentRoute, navigateTo, searchQuery, specs, activeChanges, archivedChanges } from '../stores/index';
  import { search, type SearchResult } from '../lib/api';
  import CommandSettingsModal from './CommandSettingsModal.svelte';

  export let projectName: string;

  let searchResults: SearchResult[] = [];
  let showResults = false;
  let settingsOpen = false;
  let searchTimeout: ReturnType<typeof setTimeout>;

  function handleSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    searchQuery.set(query);

    clearTimeout(searchTimeout);
    if (query.length < 2) {
      searchResults = [];
      showResults = false;
      return;
    }

    searchTimeout = setTimeout(async () => {
      searchResults = await search(query);
      showResults = true;
    }, 300);
  }

  function selectResult(result: SearchResult) {
    if (result.type === 'spec') {
      navigateTo(`/specs/${result.name.replace(' (design)', '')}`);
    } else if (result.type === 'change') {
      navigateTo(`/changes/${result.name}`);
    } else {
      navigateTo('/');
    }
    showResults = false;
    searchQuery.set('');
  }

  function isActive(path: string): boolean {
    if (path === '/') {
      return $currentRoute === '/' || $currentRoute === '';
    }
    return $currentRoute.startsWith(path);
  }
</script>

<nav class="bg-gray-800 shadow-lg border-b border-gray-700">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between h-16">
      <div class="flex items-center space-x-8">
        <!-- Logo/Title -->
        <button
          class="text-xl font-bold text-blue-400 hover:text-blue-300"
          onclick={() => navigateTo('/')}
        >
          {projectName}
        </button>

        <!-- Nav Links -->
        <div class="flex space-x-4">
          <button
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors {isActive('/')
              ? 'bg-gray-700 text-blue-400'
              : 'text-gray-300 hover:bg-gray-700'}"
            onclick={() => navigateTo('/')}
          >
            Dashboard
          </button>
          <button
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors {isActive('/specs')
              ? 'bg-gray-700 text-blue-400'
              : 'text-gray-300 hover:bg-gray-700'}"
            onclick={() => navigateTo('/specs')}
          >
            Specs
            <span class="ml-1 px-1.5 py-0.5 text-xs bg-gray-600 text-gray-300 rounded-full">{$specs.length}</span>
          </button>
          <button
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors {isActive('/changes')
              ? 'bg-gray-700 text-blue-400'
              : 'text-gray-300 hover:bg-gray-700'}"
            onclick={() => navigateTo('/changes')}
          >
            Changes
            <span class="ml-1 px-1.5 py-0.5 text-xs bg-gray-600 text-gray-300 rounded-full">{$activeChanges.length}</span>
          </button>
        </div>
      </div>

      <!-- Search + Settings -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            type="text"
            placeholder="Search..."
            value={$searchQuery}
            oninput={handleSearch}
            onfocus={() => $searchQuery.length >= 2 && (showResults = true)}
            onblur={() => setTimeout(() => (showResults = false), 200)}
            class="w-64 px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {#if showResults && searchResults.length > 0}
            <div class="absolute top-full right-0 mt-1 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {#each searchResults as result}
                <button
                  class="w-full px-4 py-3 text-left hover:bg-gray-700 border-b border-gray-700 last:border-b-0"
                  onclick={() => selectResult(result)}
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-0.5 text-xs rounded {result.type === 'spec'
                        ? 'bg-green-900 text-green-300'
                        : result.type === 'change'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-gray-700 text-gray-300'}"
                    >
                      {result.type}
                    </span>
                    <span class="font-medium text-gray-100">{result.name}</span>
                  </div>
                  <p class="text-sm text-gray-400 mt-1 truncate">{result.excerpt}</p>
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <button
          type="button"
          aria-label="Open command settings"
          title="Command settings"
          class="rounded-lg border border-gray-600 bg-gray-700 p-2 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
          onclick={() => (settingsOpen = true)}
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317a1 1 0 011.35-.936l.95.383a1 1 0 001.087-.22l.707-.707a1 1 0 011.414 0l1.414 1.414a1 1 0 010 1.414l-.707.707a1 1 0 00-.22 1.087l.383.95a1 1 0 01-.936 1.35H17a1 1 0 00-1 1v1a1 1 0 00.317.734l.707.648a1 1 0 01.065 1.455l-1.2 1.2a1 1 0 01-1.455-.065l-.648-.707A1 1 0 0013 15h-1a1 1 0 00-1 1v.325a1 1 0 01-1.35.936l-.95-.383a1 1 0 00-1.087.22l-.707.707a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414l.707-.707a1 1 0 00.22-1.087l-.383-.95A1 1 0 014.317 10.5H4a1 1 0 00-1-1v-1a1 1 0 001-.999h.317a1 1 0 00.936-1.35l-.383-.95a1 1 0 01.22-1.087l.707-.707a1 1 0 011.414 0l.707.707a1 1 0 001.087.22l.95-.383z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>

<CommandSettingsModal open={settingsOpen} onClose={() => (settingsOpen = false)} />
