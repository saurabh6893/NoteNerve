// backend/services/pdfSearchService.js

function normalize(text) {
  return (text || '').toLowerCase();
}

function tokenize(query) {
  return normalize(query)
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
}

function firstHitIndex(haystack, tokens) {
  let idx = Infinity;
  const hay = normalize(haystack);
  for (const t of tokens) {
    const p = hay.indexOf(t);
    if (p !== -1 && p < idx) idx = p;
  }
  return idx === Infinity ? -1 : idx;
}

function scorePage(text, tokens) {
  if (!text) return { hits: 0, firstIdx: -1 };
  const hay = normalize(text);
  let hits = 0;
  for (const t of tokens) {
    if (hay.includes(t)) hits += 1;
  }
  const firstIdx = firstHitIndex(text, tokens);
  return { hits, firstIdx };
}

function buildSnippet(text, firstIdx, radius = 120) {
  if (firstIdx < 0 || !text) {
    return (text || '').slice(0, 200);
  }
  const start = Math.max(0, firstIdx - radius);
  const end = Math.min(text.length, firstIdx + radius);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  return `${prefix}${text.slice(start, end)}${suffix}`;
}

function findRelevantPages(query, pageTexts, topK = 3) {
  const tokens = tokenize(query);
  if (!tokens.length || !Array.isArray(pageTexts) || pageTexts.length === 0) {
    return [];
  }

  const scored = pageTexts.map((text, i) => {
    const { hits, firstIdx } = scorePage(text, tokens);
    return { i, hits, firstIdx, text };
  });

  scored.sort((a, b) => {
    if (b.hits !== a.hits) return b.hits - a.hits;
    if (a.firstIdx === -1 && b.firstIdx === -1) return a.i - b.i;
    if (a.firstIdx === -1) return 1;
    if (b.firstIdx === -1) return -1;
    if (a.firstIdx !== b.firstIdx) return a.firstIdx - b.firstIdx;
    return a.i - b.i;
  });

  const results = [];
  for (const s of scored) {
    if (s.hits <= 0) break;
    results.push({
      page: s.i + 1,
      snippet: buildSnippet(s.text, s.firstIdx),
    });
    if (results.length >= topK) break;
  }

  return results;
}

module.exports = { findRelevantPages };
