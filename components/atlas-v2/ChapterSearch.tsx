"use client";
import { useEffect, useMemo, useState } from "react";
import type { AtlasV2Chapter } from "@/lib/atlas-v2/chapters";
import { anchorId } from "./Reader";
import styles from "./reader.module.css";

// Within-chapter search (Phase 3, G-10: chapter-page search surface). Searches
// ONLY the current chapter's blocks (headings, paragraphs, list items) and
// jumps to the matching section via the same stable sec-* anchors the Reader
// itself uses (anchorId is shared, not duplicated, so anchors cannot drift).
// The component renders nothing until after mount: without JavaScript there is
// no dead search box — the chapter content itself is server-rendered and fully
// readable. Escape clears the query. Technical paragraphs inside collapsed
// "Technical depth" disclosures are searchable by section, but the visitor
// must expand the disclosure to read them (the section heading is the jump
// target; nothing is auto-expanded). The introduction block has no section
// anchor by design (Phase 2), so its matches link to the top of the chapter.
function tokenize(q: string): string[] {
  return q.toLowerCase().split(/[^a-z0-9+]+/).filter((t) => t.length >= 2);
}
function snippet(text: string, tokens: string[]): string {
  const lower = text.toLowerCase();
  const idx = tokens.map((t) => lower.indexOf(t)).filter((i) => i >= 0);
  const start = idx.length > 0 ? Math.max(0, Math.min(...idx) - 60) : 0;
  return (start > 0 ? "…" : "") + text.slice(start, start + 280) + (text.length > start + 280 ? "…" : "");
}

export default function ChapterSearch({ chapter }: { chapter: AtlasV2Chapter }) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => { setMounted(true); }, []);
  const sections = useMemo(() => chapter.blocks.map((b, i) => ({
    id: b.h2 ? anchorId(b.h2, i) : null,
    heading: b.h2 || "Introduction",
    text: [b.h2 ?? "", ...b.paras, ...b.lists.flat()].join("\n"),
  })), [chapter]);
  const tokens = useMemo(() => tokenize(query), [query]);
  const hits = useMemo(() => {
    if (tokens.length === 0) return [];
    return sections.map((s) => {
      const lower = s.text.toLowerCase();
      let score = 0;
      for (const t of tokens) if (lower.includes(t)) score += 1;
      return { ...s, score };
    }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 20);
  }, [sections, tokens]);
  if (!mounted) return null;
  return (
    <section className={styles.card} aria-label="Search within this chapter">
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="chapter-search">Search within this chapter</label>
        <input id="chapter-search" type="search" value={query} placeholder="Search this chapter…" onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") setQuery(""); }} style={{ width: "100%", padding: "8px 10px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", marginTop: 4 }} />
        {query ? <button type="button" className={styles.btn} onClick={() => setQuery("")} style={{ marginTop: 8 }}>Clear</button> : null}
      </form>
      {tokens.length > 0 ? (
        <div aria-live="polite">
          <p>{hits.length === 0 ? "No matches in this chapter." : `${hits.length} section${hits.length === 1 ? "" : "s"} matched.`}</p>
          {hits.length === 0 ? <p>Try the <a href={`/search?q=${encodeURIComponent(query)}`}>full Atlas search</a> instead.</p> : null}
          <ul>
            {hits.map((h) => (
              <li key={h.id ?? "intro"}>
                <a href={h.id ? `#${h.id}` : "#"}>{h.heading}</a>
                <p>{snippet(h.text, tokens)}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p>Searches this chapter only. Matches jump to their section; introduction matches link to the top of the chapter (the introduction has no section anchor by design).</p>
    </section>
  );
}
