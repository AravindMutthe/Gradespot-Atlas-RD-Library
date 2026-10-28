"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface IndexChapter { slug: string; title: string; sourceDomain: string; proposedDomain: string; contentType: string; headings: string[]; text: string; }
interface Hit { slug: string; title: string; sourceDomain: string; score: number; snippet: string; }

// Verified master domain labels (same five as the Reader). Results show the
// VERIFIED sourceDomain only — the proposedDomain value is never displayed
// (Phase 2, G-05: proposed groupings are never presented as decided).
const SOURCE_DOMAIN_LABELS: Record<string, string> = {
  "institutions-markets": "Institutions & Markets",
  "hardware-computing": "Hardware & Computing",
  "infrastructure-operations": "Infrastructure & Operations",
  "systems-evolution": "Systems Evolution",
  "industrial-business-networks": "Industrial & Business Networks",
};

function tokenize(q: string): string[] {
  return q.toLowerCase().split(/[^a-z0-9+]+/).filter((t) => t.length >= 2);
}
function snippetFor(text: string, tokens: string[]): string {
  const paras = text.split("\n").filter((p) => p.trim().length > 0);
  const lower = text.toLowerCase();
  const hit = paras.find((p) => tokens.some((t) => p.toLowerCase().includes(t)));
  const src = hit ?? paras[0] ?? "";
  const idx = tokens.map((t) => src.toLowerCase().indexOf(t)).filter((i) => i >= 0);
  const start = idx.length > 0 ? Math.max(0, Math.min(...idx) - 60) : 0;
  return (start > 0 ? "…" : "") + src.slice(start, start + 280) + (src.length > start + 280 ? "…" : "");
}
function highlight(text: string, tokens: string[]): React.ReactNode {
  if (tokens.length === 0) return text;
  const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) => tokens.some((t) => part.toLowerCase() === t) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>);
}

function SearchInner() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [index, setIndex] = useState<IndexChapter[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/atlas-v2/search-index.json").then((r) => { if (!r.ok) throw new Error(`Index fetch failed (${r.status})`); return r.json(); })
      .then((d) => { if (!cancelled) setIndex(d.chapters); })
      .catch((e) => { if (!cancelled) setError(String(e.message ?? e)); });
    return () => { cancelled = true; };
  }, []);
  const tokens = useMemo(() => tokenize(query), [query]);
  // Content-type filtering (Phase 3, G-10 / MATRIX-032). The index carries a
  // contentType field on every entry (today all 57 are "chapter"). A ?type=
  // parameter filters to that type ONLY when the type exists in the loaded
  // index; an unknown type is ignored rather than yielding a false empty
  // result. The filter UI below renders only when the index contains more
  // than one distinct type — today it does not render, and no second type is
  // invented to make it appear.
  const types = useMemo(() => new Set((index ?? []).map((c) => c.contentType)), [index]);
  const typeParam = params.get("type");
  const activeType = typeParam && types.has(typeParam) ? typeParam : null;
  const hits = useMemo<Hit[]>(() => {
    if (!index || tokens.length === 0) return [];
    const pool = activeType ? index.filter((c) => c.contentType === activeType) : index;
    const scored: Hit[] = [];
    for (const c of pool) {
      let score = 0;
      const title = c.title.toLowerCase();
      const heads = c.headings.join(" ").toLowerCase();
      const body = c.text.toLowerCase();
      for (const t of tokens) {
        if (title.includes(t)) score += 10;
        if (heads.includes(t)) score += 5;
        const occ = body.split(t).length - 1;
        if (occ > 0) score += Math.min(10, occ);
      }
      if (score > 0) scored.push({ slug: c.slug, title: c.title, sourceDomain: c.sourceDomain, score, snippet: snippetFor(c.text, tokens) });
    }
    return scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 50);
  }, [index, tokens, activeType]);
  // Arrow-key navigation (Phase 3, G-10): ArrowDown/ArrowUp move focus between
  // result links. Tab order is unchanged — arrow keys are an addition, and
  // focus remains visibly indicated by the global :focus-visible rule.
  const onResultsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const links = Array.from(listRef.current?.querySelectorAll("a") ?? []);
    const idx = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === "ArrowDown" ? idx + 1 : idx - 1;
    if (next >= 0 && next < links.length) links[next].focus();
    else if (links.length > 0 && idx === -1) links[0].focus();
  };
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <p><Link href="/">Home</Link> / <Link href="/library">Library</Link> / Search</p>
      <p>Build-time full-text search over verified titles, headings and body content (57 chapters, release v1-consolidated-002). No external service, no vector database.</p>
      <form action="/search" method="get" role="search" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label htmlFor="search-q" style={{ position: "absolute", left: "-9999px" }}>Search query</label>
        <input ref={inputRef} id="search-q" name="q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try: memory, NIC packet, Linux kernel, market integration…" autoFocus
          onKeyDown={(e) => { if (e.key === "Escape") setQuery(""); }}
          style={{ flex: "1 1 280px", padding: "10px 12px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: "1rem" }} />
        <button type="submit" style={{ padding: "10px 18px", borderRadius: 12, border: "1px solid var(--line)", background: "#1E3A56", color: "#fff", cursor: "pointer" }}>Search</button>
        {query ? <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} style={{ padding: "10px 18px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", cursor: "pointer" }}>Clear</button> : null}
      </form>
      <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>This results page has its own shareable URL: <code>/search?q=…</code> — the query stays in the address bar. Press “/” anywhere to jump to the header search box; ArrowDown/ArrowUp move between results; Escape clears the query.</p>
      {index && types.size > 1 ? (
        <p>Content type: {Array.from(types).map((t) => (
          <span key={t} style={{ marginRight: 8 }}>{activeType === t ? <strong>{t}</strong> : <Link href={`/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(t)}`}>{t}</Link>}</span>
        ))} <Link href={`/search?q=${encodeURIComponent(query)}`}>All types</Link></p>
      ) : null}
      {error ? <p role="alert" style={{ border: "1px solid var(--warn-line)", background: "var(--warn-bg)", color: "var(--warn-ink)", borderRadius: 12, padding: "12px 14px" }}>Search is unavailable right now: the index could not be loaded ({error}). Try reloading the page; the library and chapter pages still work.</p> : null}
      {!error && tokens.length === 0 ? <p>Enter a query above. Example queries: <Link href="/search?q=memory">memory</Link>, <Link href="/search?q=NIC%20packet">NIC packet</Link>, <Link href="/search?q=Linux%20kernel">Linux kernel</Link>, <Link href="/search?q=market%20integration">market integration</Link>.</p> : null}
      {!error && index && tokens.length > 0 ? (
        <div aria-live="polite">
          <p>{hits.length === 0 ? "No chapters matched." : `${hits.length} chapter${hits.length === 1 ? "" : "s"} matched.`}</p>
          {hits.length === 0 ? <p>Try a broader term (for example “network” instead of a specific product name), or browse the <Link href="/library">library by domain</Link>.</p> : null}
          <ol ref={listRef} onKeyDown={onResultsKeyDown} style={{ padding: 0, listStyle: "none" }}>
            {hits.map((h) => (
              <li key={h.slug} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "14px", margin: "10px 0", background: "var(--surface)", color: "var(--ink)" }}>
                <h2 style={{ margin: "0 0 4px", fontSize: "1.05rem" }}><Link href={`/${h.slug}`} style={{ color: "var(--blue)", overflowWrap: "anywhere" }}>{highlight(h.title, tokens)}</Link></h2>
                <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "var(--muted)" }}>{SOURCE_DOMAIN_LABELS[h.sourceDomain] ?? h.sourceDomain} · verified master domain</p>
                <p style={{ margin: "4px 0" }}>{highlight(h.snippet, tokens)}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {!error && !index ? <p>Loading the search index…</p> : null}
    </div>
  );
}

export default function SearchClient() {
  return (<Suspense fallback={<p style={{ padding: 16 }}>Loading search…</p>}><SearchInner /></Suspense>);
}
