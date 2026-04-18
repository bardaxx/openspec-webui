<script lang="ts">
  import { renderMarkdown, highlightDeltas } from '$lib/markdown';

  interface Props {
    content: string;
    highlightDiff?: boolean;
  }

  let { content, highlightDiff = false }: Props = $props();

  let baseHtml = $derived(renderMarkdown(content));
  let html = $derived(highlightDiff ? highlightDeltas(baseHtml) : baseHtml);
</script>

<div class="markdown-body prose max-w-none">
  {@html html}
</div>
