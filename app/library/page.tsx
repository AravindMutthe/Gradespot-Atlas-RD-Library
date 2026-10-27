import type { Metadata } from "next";
import LibraryClient, { type LibraryRow } from "@/components/atlas-v2/LibraryClient";
import { ATLAS_V2_CHAPTERS, ATLAS_V2_RELEASE } from "@/lib/atlas-v2/chapters";
import { ATLAS_V2_DOMAINS, ATLAS_V2_DOMAIN_MAP } from "@/lib/atlas-v2/domains";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  title: "Library — Aravind Systems Atlas",
  description:
    "All 57 chapters of the Aravind Systems Atlas, grouped by a configurable domain projection. Domain is grouping and filtering only; chapter slugs never change.",
  alternates: { canonical: `${BASE}/library/` },
};

export default function LibraryPage() {
  const domainOf = Object.fromEntries(ATLAS_V2_DOMAIN_MAP.map((m) => [m.slug, m]));
  const rows: LibraryRow[] = ATLAS_V2_CHAPTERS.map((c) => ({
    slug: c.slug, title: c.title, sourceDomain: c.sourceDomain,
    proposedDomain: domainOf[c.slug]?.proposedDomain ?? "Not recorded",
    flagged: domainOf[c.slug]?.flagged ?? false, sources: c.sources,
    paragraphCount: c.paragraphCount, imageCount: c.imageCount,
    tables: c.tables.length, diagrams: c.diagrams.length,
  }));
  return (
    <>
      <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.85rem", color: "#475569", textAlign: "center" }}>
        Release {ATLAS_V2_RELEASE.contentRelease} · version {ATLAS_V2_RELEASE.version} · {ATLAS_V2_CHAPTERS.length} chapters
      </p>
      <LibraryClient rows={rows} domains={ATLAS_V2_DOMAINS} />
    </>
  );
}
