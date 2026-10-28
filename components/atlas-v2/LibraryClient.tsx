"use client";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { displayTitle } from "@/lib/atlas-v2/display-title";

export interface LibraryRow { slug: string; title: string; sourceDomain: string; sources: string[]; paragraphCount: number; imageCount: number; tables: number; diagrams: number; }

// Verified master domains from release v1-consolidated-001. Labels below are
// display renderings of those keys. This is the ONLY grouping the Library
// applies (Phase 2, G-05): the proposed seven-domain set is NOT applied.
// Grouping copy states plainly that the grouping is configurable and pending
// reconciliation — the build commits to neither five nor seven as a final
// taxonomy. The proposed-domain mapping file (lib/atlas-v2/domains.ts) is
// left unreferenced by the Library after this change; it is retained, not
// deleted, for Phase 6 disposition.
const SOURCE_DOMAIN_LABELS: Record<string, string> = {
  "institutions-markets": "Institutions & Markets",
  "hardware-computing": "Hardware & Computing",
  "infrastructure-operations": "Infrastructure & Operations",
  "systems-evolution": "Systems Evolution",
  "industrial-business-networks": "Industrial & Business Networks",
};

function LibraryInner({ rows }: { rows: LibraryRow[] }) {
  const params = useSearchParams();
  const groupOf = (r: LibraryRow) => SOURCE_DOMAIN_LABELS[r.sourceDomain] ?? r.sourceDomain;
  const groupList = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) set.add(groupOf(r));
    return [...set].sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);
  const initialDomain = params.get("domain") ?? "All";
  const [domain, setDomain] = useState(initialDomain && groupList.includes(initialDomain) ? initialDomain : "All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"title" | "paragraphs" | "images">("title");
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(groupOf(r), (m.get(groupOf(r)) ?? 0) + 1);
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => (domain === "All" || groupOf(r) === domain) && (q === "" || r.title.toLowerCase().includes(q) || r.slug.includes(q)));
    list = [...list].sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : sort === "paragraphs" ? b.paragraphCount - a.paragraphCount : b.imageCount - a.imageCount);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, domain, query, sort]);
  return (
    <div style={{ fontFamily: "Inter,system-ui,sans-serif", maxWidth: 1100, margin: "0 auto", padding: "16px" }}>
      <p><Link href="/">Home</Link> / Library</p>
      <h1 style={{ color: "var(--heading, #12243A)" }}>Library — all {rows.length} chapters</h1>
      <p style={{ border: "1px solid var(--teal)", background: "var(--surface)", color: "var(--ink)", borderRadius: 12, padding: "10px 14px" }}>
        <strong>Grouping: configurable / pending reconciliation.</strong> Chapters are grouped here
        by the verified master domains from release v1-consolidated-001. This grouping is a
        presentation choice, not a final taxonomy — a seven-domain proposal exists but is NOT
        applied until taxonomy reconciliation is approved. Domain is grouping and filtering
        only; every chapter URL (its slug) is unchanged and no domain-prefixed routes exist.
      </p>
      <form role="search" onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "end", margin: "16px 0" }}>
        <label style={{ flex: "1 1 260px" }}>Filter by title or slug<br /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. memory, NIC, market" style={{ width: "100%", padding: "8px 10px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }} /></label>
        <label>Domain<br /><select value={domain} onChange={(e) => setDomain(e.target.value)} style={{ padding: "8px", borderRadius: 12, background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--line)" }}>
          <option value="All">All domains ({rows.length})</option>
          {groupList.map((d) => <option key={d} value={d}>{d} ({counts.get(d) ?? 0})</option>)}
        </select></label>
        <label>Sort<br /><select value={sort} onChange={(e) => setSort(e.target.value as "title" | "paragraphs" | "images")} style={{ padding: "8px", borderRadius: 12, background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--line)" }}>
          <option value="title">Title A–Z</option><option value="paragraphs">Most paragraphs</option><option value="images">Most images</option>
        </select></label>
        <Link href={`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`} style={{ padding: "8px 14px", border: "1px solid var(--line)", borderRadius: 12, color: "var(--blue)" }}>Full-text search →</Link>
      </form>
      <p aria-live="polite">{filtered.length} of {rows.length} chapters shown.</p>
      {filtered.length === 0 ? <p>No chapters match that filter. Clear the title filter or choose another domain.</p> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map((r) => (
          <article key={r.slug} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "14px", background: "var(--surface)" }}>
            <h2 style={{ fontSize: "1.05rem", margin: "0 0 6px" }}><Link href={`/${r.slug}`} style={{ color: "var(--blue)", overflowWrap: "anywhere" }}>{displayTitle(r.title)}</Link></h2>
            <p style={{ margin: "4px 0", fontSize: "0.9rem" }}>{groupOf(r)}</p>
            <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "var(--muted)" }}>Source domain: {r.sourceDomain} · {r.paragraphCount} paragraphs · {r.imageCount} images · {r.tables} tables · {r.diagrams} diagrams</p>
            <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "var(--muted)" }}>Sources: {r.sources.length > 0 ? r.sources.join(" · ") : "Not recorded (shown as missing, not guessed)."}</p>
          </article>
        ))}
      </div>
      <footer style={{ marginTop: 28, fontSize: "0.85rem", color: "var(--muted)" }}>Release v1-consolidated-001 · version 1.0.0-continuing · content SHA 970489efd3899d29 · {rows.length} chapters · 136 images. Cross-domain discovery: every chapter page carries labelled related-chapter links, or a Browse entry where none are recorded; no chapter content is duplicated in the library.</footer>
    </div>
  );
}

export default function LibraryClient({ rows }: { rows: LibraryRow[] }) {
  return (<Suspense fallback={<p style={{ padding: 16 }}>Loading library…</p>}><LibraryInner rows={rows} /></Suspense>);
}
