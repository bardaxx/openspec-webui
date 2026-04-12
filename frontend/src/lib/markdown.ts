import { marked } from 'marked';

// Configure marked for better rendering
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Render markdown to HTML
 */
export function renderMarkdown(content: string): string {
  return marked(content) as string;
}

/**
 * Highlight delta operations in markdown content
 * Wraps ADDED/MODIFIED/REMOVED sections with appropriate CSS classes
 */
export function highlightDeltas(html: string): string {
  // Add classes to section headers
  return html
    .replace(
      /<h2>ADDED\s+Requirements?<\/h2>/gi,
      '<h2 class="diff-added">ADDED Requirements</h2>'
    )
    .replace(
      /<h2>MODIFIED\s+Requirements?<\/h2>/gi,
      '<h2 class="diff-modified">MODIFIED Requirements</h2>'
    )
    .replace(
      /<h2>REMOVED\s+Requirements?<\/h2>/gi,
      '<h2 class="diff-removed">REMOVED Requirements</h2>'
    )
    .replace(
      /<h2>RENAMED\s+Requirements?<\/h2>/gi,
      '<h2 class="diff-modified">RENAMED Requirements</h2>'
    );
}
