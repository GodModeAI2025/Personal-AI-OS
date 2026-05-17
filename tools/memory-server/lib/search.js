import { compactWhitespace, countOccurrences, snippet, tokenize } from "./text.js";

export function searchIndex(index, query, options = {}) {
  const limit = Number(options.limit || 8);
  const terms = [...new Set(tokenize(query))];
  const phrase = compactWhitespace(query).toLowerCase();
  if (terms.length === 0 && !phrase) return [];

  const scored = [];

  for (const chunk of index.chunks || []) {
    const title = String(chunk.title || "").toLowerCase();
    const heading = String(chunk.heading || "").toLowerCase();
    const text = String(chunk.text || "").toLowerCase();
    const tokenSet = new Set(chunk.tokens || []);
    let score = 0;

    if (phrase && text.includes(phrase)) score += 30;
    if (phrase && heading.includes(phrase)) score += 18;
    if (phrase && title.includes(phrase)) score += 18;

    for (const term of terms) {
      if (tokenSet.has(term)) score += 2;
      if (title.includes(term)) score += 6;
      if (heading.includes(term)) score += 5;
      score += Math.min(8, countOccurrences(text, term));
    }

    const coverage = terms.filter((term) => tokenSet.has(term) || text.includes(term)).length;
    score += coverage * coverage;

    if (score <= 0) continue;

    scored.push({
      score,
      id: chunk.id,
      path: chunk.path,
      title: chunk.title,
      heading: chunk.heading,
      lineStart: chunk.lineStart,
      lineEnd: chunk.lineEnd,
      modifiedAt: chunk.modifiedAt,
      snippet: snippet(chunk.text, terms),
      text: options.includeText ? chunk.text : undefined
    });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .slice(0, limit);
}

export function formatSearchResults(results) {
  if (results.length === 0) return "Keine Treffer.";

  return results
    .map((result, index) => {
      const heading = result.heading ? ` > ${result.heading}` : "";
      return [
        `${index + 1}. ${result.path}:${result.lineStart}${heading}`,
        `   Score: ${result.score}`,
        `   ${result.snippet}`
      ].join("\n");
    })
    .join("\n\n");
}
