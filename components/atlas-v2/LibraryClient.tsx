"use client";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface LibraryRow { slug: string; title: string; sourceDomain: string; proposedDomain: string; flagged: boolean; sources: string[]; paragraphCount: number; imageCount: number; tables: number; diagrams: number; }

function LibraryInner({ rows, domains }: { rows: LibraryRow[]; domains: string[] }) {
  const params = useSearchParams();
  const initialDomain = params.get("domain") ?? "All";
  const [domain, setDomain] = useState(initialDomain && domains.includes(initialDomain) ? initialDomain : "All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"title" | "paragraphs" | "images">("title");
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.proposedDomain, (m.get(r.proposedDomain) ?? 0) + 1);
    return m;
  }, [rows]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => (domain === "All" || r.proposedDomain === domain) && (q === "" || r.title.toLowerCase().includes(q) || r.slug.includes(q)));
    list = [...list].sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : sort === "paragraphs" ? b.paragraphCount - a.paragraphCount : b.imageCount - a.imageCount);
    return list;
  }, [rows, domain, query, sort]);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 1100, margin: "0 auto", padding: "16px" }}>
      <p><Link href="/">Home</Link> / Library</p>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#10233f" }}>Library — all 57 chapters</h1>
      <p style={{ border: "1px solid #b45309", background: "#fef3c7", color: "#78350f", borderRadius: 8, padding: "10px 14px" }}>
        <strong>Proposed grouping, pending owner approval.</strong> The seven domains below are a proposal — migration is NOT final until the owner approves. Domain is grouping/filtering only; every chapter URL (its slug) is unchanged and no domain-prefixed routes exist.
      </p>
      <form role="search" onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "end", margin: "16px 0" }}>
        <label style={{ flex: "1 1 260px" }}>Filter by title or slug<br /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. memory, NIC, market" style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #94a3b8" }} /></label>
        <label>Domain<br /><select value={domain} onChange={(e) => setDomain(e.target.value)} style={{ padding: "8px", borderRadius: 6 }}>
          <option value="All">All domains ({rows.length})</option>
          {domains.map((d) => <option key={d} value={d}>{d} ({counts.get(d) ?? 0})</option>)}
        </select></label>
        <label>Sort<br /><select value={sort} onChange={(e) => setSort(e.target.value as "title" | "paragraphs" | "images")} style={{ padding: "8px", borderRadius: 6 }}>
          <option value="title">Title A–Z</option><option value="paragraphs">Most paragraphs</option><option value="images">Most images</option>
        </select></label>
        <Link href={`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`} style={{ padding: "8px 14px", border: "1px solid #94a3b8", borderRadius: 8, color: "#1d4ed8" }}>Full-text search →</Link>
      </form>
      <p aria-live="polite">{filtered.length} of {rows.length} chapters shown.</p>
      {filtered.length === 0 ? <p>No chapters match that filter. Clear the title filter or choose another domain.</p> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map((r) => (
          <article key={r.slug} style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: "14px", background: "#fff" }}>
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 6px" }}><Link href={`/${r.slug}`} style={{ color: "#1d4ed8", overflowWrap: "anywhere" }}>{r.title}</Link></h2>
            <p style={{ margin: "4px 0", fontSize: "0.9rem" }}>{r.proposedDomain}{r.flagged ? " · flagged for review" : ""}</p>
            <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#475569" }}>Source domain: {r.sourceDomain} · {r.paragraphCount} paragraphs · {r.imageCount} images · {r.tables} tables · {r.diagrams} diagrams</p>
            <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#475569" }}>Sources: {r.sources.length > 0 ? r.sources.join(" · ") : "Not recorded (shown as missing, not guessed)."}</p>
          </article>
        ))}
      </div>
      <footer style={{ marginTop: 28, fontSize: "0.85rem", color: "#475569" }}>Release v1-consolidated-001 · version 1.0.0-continuing · content SHA 970489efd3899d29 · 57 chapters · 136 images. Cross-domain discovery: every chapter page carries labelled related-chapter links; no chapter content is duplicated in the library.</footer>
    </div>
  );
}

export default function LibraryClient({ rows, domains }: { rows: LibraryRow[]; domains: string[] }) {
  return (<Suspense fallback={<p style={{ padding: 16 }}>Loading library…</p>}><LibraryInner rows={rows} domains={domains} /></Suspense>);
}
