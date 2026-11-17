/**
 * Helpers for [[TODO: ...]] placeholders.
 *
 * Placeholder text is written as [[TODO: what is missing]] in content files.
 * These helpers find that text so pages can wrap it in <span class="todo">,
 * which global.css styles as a quiet dashed note.
 */

/** Matches one placeholder, e.g. "[[TODO: add outcomes]]". */
const TODO_PATTERN = /\[\[TODO[^\]]*\]\]/g;

/** Split a string into normal text and placeholder parts. */
export function splitTodo(text: string): { text: string; todo: boolean }[] {
  const parts: { text: string; todo: boolean }[] = [];
  let last = 0;
  for (const match of text.matchAll(TODO_PATTERN)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start), todo: false });
    parts.push({ text: match[0], todo: true });
    last = start + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), todo: false });
  return parts;
}

/**
 * Wrap placeholders inside a string of HTML (such as rendered Markdown).
 *
 * The pattern below walks the HTML piece by piece: each piece is either a
 * tag (`<...>`) or the text between tags. Tags are returned untouched, so
 * attributes like alt="[[TODO]]" are never changed; only visible text is.
 */
export function wrapTodoInHtml(html: string): string {
  return html.replace(/(<[^>]*>)|([^<]+)/g, (_match, tag: string | undefined, text: string) =>
    tag !== undefined ? tag : text.replace(TODO_PATTERN, '<span class="todo">$&</span>'),
  );
}
