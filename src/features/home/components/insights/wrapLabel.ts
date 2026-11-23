export const DEFAULT_LINE_CHARS = 10;
export const MAX_LABEL_LINES = 3;
export const LABEL_LINE_HEIGHT = 14;

/**
 * Greedy word wrap into at most MAX_LABEL_LINES lines of `max` characters. A word longer than a
 * line is broken, and whatever still does not fit ends with "…" (the full text is in the tooltip).
 */
export function wrapLabel(text: string, max: number): string[] {
  const lines: string[] = [];
  let current = "";
  const push = (line: string) => lines.push(line);

  for (const word of text.split(" ")) {
    let w = word;
    while (w.length > max) {
      if (current) {
        push(current);
        current = "";
      }
      push(w.slice(0, max));
      w = w.slice(max);
    }
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length <= max) current = candidate;
    else {
      push(current);
      current = w;
    }
  }
  if (current) push(current);

  if (lines.length <= MAX_LABEL_LINES) return lines;
  const kept = lines.slice(0, MAX_LABEL_LINES);
  const last = kept[MAX_LABEL_LINES - 1];
  kept[MAX_LABEL_LINES - 1] = `${last.slice(0, Math.max(1, max - 1))}…`;
  return kept;
}
