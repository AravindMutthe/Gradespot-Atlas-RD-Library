"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface IndexChapter { slug: string; title: string; sourceDomain: string; proposedDomain: string; headings: string[]; text: string; }
interface Hit { slug: string; title: string; proposedDomain: string; score: number; snippet: string; }

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
  useEffect(() => {
    let cancelled = false;
    fetch("/atlas-v2/search-index.json").then((r) => { if (!r.ok) throw new Error(`Index fetch failed (${r.status})`); return r.json(); })
      .then((d) => { if (!cancelled) setIndex(d.chapters); })
      .catch((e) => { if (!cancelled) setError(String(e.message ?? e)); });
    return () => { cancelled = true; };
  }, []);
  const tokens = useMemo(() => tokenize(query), [query]);
  const hits = useMemo<Hit[]>(() => {
    if (!index || tokens.length === 0) return [];
    const scored: Hit[] = [];
    for (const c of index) {
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
      if (score > 0) scored.push({ slug: c.slug, title: c.title, proposedDomain: c.proposedDomain, score, snippet: snippetFor(c.text, tokens) });
    }
    return scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 50);
  }, [index, tokens]);
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <p><Link href="/">Home</Link> / <Link href="/library">Library</Link> / Search</p>
      <h1 style={{ fontFamily: "\"Source Serif 4\", Georgia, serif", color: "var(--heading)" }}>Search the Atlas</h1>
      <p>Build-time full-text search over verified titles, headings and body content (57 chapters, release v1-consolidated-001). No external service, no vector database.</p>
      <form action="/search" method="get" role="search" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label htmlFor="search-q" style={{ position: "absolute", left: "-9999px" }}>Search query</label>
        <input id="search-q" name="q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try: memory, NIC packet, Linux kernel, market integration…" autoFocus
          style={{ flex: "1 1 280px", padding: "10px 12px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: "1rem" }} />
        <button type="submit" style={{ padding: "10px 18px", borderRadius: 12, border: "1px solid var(--line)", background: "#1E3A56", color: "#fff", cursor: "pointer" }}>Search</button>
      </form>
      <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>This results page has its own shareable URL: <code>/search?q=…</code> — the query stays in the address bar.</p>
      {error ? <p role="alert" style={{ border: "1px solid var(--warn-line)", background: "var(--warn-bg)", color: "var(--warn-ink)", borderRadius: 12, padding: "12px 14px" }}>Search is unavailable right now: the index could not be loaded ({error}). Try reloading the page; the library and chapter pages still work.</p> : null}
      {!error && tokens.length === 0 ? <p>Enter a query above. Example queries: <Link href="/search?q=memory">memory</Link>, <Link href="/search?q=NIC%20packet">NIC packet</Link>, <Link href="/search?q=Linux%20kernel">Linux kernel</Link>, <Link href="/search?q=market%20integration">market integration</Link>.</p> : null}
      {!error && index && tokens.length > 0 ? (
        <div aria-live="polite">
          <p>{hits.length === 0 ? "No chapters matched." : `${hits.length} chapter${hits.length === 1 ? "" : "s"} matched.`}</p>
          {hits.length === 0 ? <p>Try a broader term (for example “network” instead of a specific product name), or browse the <Link href="/library">library by domain</Link>.</p> : null}
          <ol style={{ padding: 0, listStyle: "none" }}>
            {hits.map((h) => (
              <li key={h.slug} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "14px", margin: "10px 0", background: "var(--surface)", color: "var(--ink)" }}>
                <h2 style={{ margin: "0 0 4px", fontSize: "1.05rem" }}><Link href={`/${h.slug}`} style={{ color: "var(--blue)", overflowWrap: "anywhere" }}>{highlight(h.title, tokens)}</Link></h2>
                <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "var(--muted)" }}>{h.proposedDomain}</p>
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
