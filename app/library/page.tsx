import type { Metadata } from "next";
import Link from "next/link";
import LibraryClient, { type LibraryRow } from "@/components/atlas-v2/LibraryClient";
import { ATLAS_V2_CHAPTERS, ATLAS_V2_RELEASE } from "@/lib/atlas-v2/chapters";
import { displayTitle } from "@/lib/atlas-v2/display-title";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  title: "Library — Aravind Systems Atlas",
  description:
    "All 57 chapters of the Aravind Systems Atlas, grouped by the verified master domains. Grouping is configurable and pending reconciliation; chapter slugs never change.",
  alternates: { canonical: `${BASE}/library/` },
};

// Verified master domain labels, same rendering as the client filter.
// Order matches the client grouping map; counts are computed from the
// baseline data at build time, never hand-written.
const DOMAIN_ORDER: { key: string; label: string }[] = [
  { key: "institutions-markets", label: "Institutions & Markets" },
  { key: "hardware-computing", label: "Hardware & Computing" },
  { key: "infrastructure-operations", label: "Infrastructure & Operations" },
  { key: "systems-evolution", label: "Systems Evolution" },
  { key: "industrial-business-networks", label: "Industrial & Business Networks" },
];

export default function LibraryPage() {
  const rows: LibraryRow[] = ATLAS_V2_CHAPTERS.map((c) => ({
    slug: c.slug, title: c.title, sourceDomain: c.sourceDomain,
    sources: c.sources,
    paragraphCount: c.paragraphCount, imageCount: c.imageCount,
    tables: c.tables.length, diagrams: c.diagrams.length,
  }));
  // Server-rendered chapter list (audit-corrections 2026-10-28): the full
  // list is in the HTML with JavaScript disabled. The client filter is an
  // enhancement only — with JavaScript it replaces this list with the
  // filtered view; without JavaScript this list is the library.
  const serverList = (
    <div>
      {DOMAIN_ORDER.map(({ key, label }) => {
        const chapters = ATLAS_V2_CHAPTERS.filter((c) => c.sourceDomain === key)
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title));
        if (chapters.length === 0) return null;
        return (
          <section key={key} aria-labelledby={`library-server-${key}`}>
            <h2 id={`library-server-${key}`}>
              {label} ({chapters.length} chapters)
            </h2>
            <ul>
              {chapters.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}/`}>{displayTitle(c.title)}</Link>
                  {" — "}
                  {c.paragraphCount} paragraphs · {c.imageCount} images ·{" "}
                  {c.tables.length} tables · {c.diagrams.length} diagrams
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
  return (
    <>
      <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center" }}>
        Release {ATLAS_V2_RELEASE.contentRelease} · version {ATLAS_V2_RELEASE.version} · {ATLAS_V2_CHAPTERS.length} chapters
      </p>
      <h1 style={{ color: "var(--heading, #12243A)", textAlign: "center" }}>Library — all {ATLAS_V2_CHAPTERS.length} chapters</h1>
      {/* Server-rendered list is a sibling of the client filter (not
          children of it): children of a client component that suspends on
          useSearchParams do not reach the prerendered HTML, so the list
          must live here to be present with JavaScript disabled. The
          client hides this element on mount and renders its filtered
          view instead; without JavaScript this list is the library. */}
      <div id="library-server-list">{serverList}</div>
      <LibraryClient rows={rows} />
      <noscript>
        <p>
          The full chapter list on this page is server-rendered and complete
          without JavaScript. Filtering by title, domain, or sort order is an
          enhancement that needs JavaScript; without it, every chapter is
          listed above, grouped by verified master domain.
        </p>
      </noscript>
    </>
  );
}
