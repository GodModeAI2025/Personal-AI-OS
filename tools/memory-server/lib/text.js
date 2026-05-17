export function tokenize(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/[a-z0-9äöüß_-]{2,}/g) || [];
}

export function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let index = 0;
  while ((index = haystack.indexOf(needle, index)) !== -1) {
    count += 1;
    index += needle.length;
  }
  return count;
}

export function truncateMiddle(text, maxChars) {
  if (text.length <= maxChars) return text;
  const half = Math.floor((maxChars - 15) / 2);
  return `${text.slice(0, half)}\n[...]\n${text.slice(-half)}`;
}

export function compactWhitespace(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

export function snippet(text, terms, maxChars = 420) {
  const normalized = String(text || "");
  const lower = normalized.toLowerCase();
  const firstHit = terms
    .map((term) => lower.indexOf(term.toLowerCase()))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (firstHit === undefined) {
    return compactWhitespace(normalized).slice(0, maxChars);
  }

  const start = Math.max(0, firstHit - Math.floor(maxChars / 3));
  const end = Math.min(normalized.length, start + maxChars);
  const prefix = start > 0 ? "... " : "";
  const suffix = end < normalized.length ? " ..." : "";
  return `${prefix}${compactWhitespace(normalized.slice(start, end))}${suffix}`;
}
