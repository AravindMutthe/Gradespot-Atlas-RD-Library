import type { Metadata } from "next";
import LibraryClient, { type LibraryRow } from "@/components/atlas-v2/LibraryClient";
import { ATLAS_V2_CHAPTERS, ATLAS_V2_RELEASE } from "@/lib/atlas-v2/chapters";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  title: "Library — Aravind Systems Atlas",
  description:
    "All 57 chapters of the Aravind Systems Atlas, grouped by the verified master domains. Grouping is configurable and pending reconciliation; chapter slugs never change.",
  alternates: { canonical: `${BASE}/library/` },
};

export default function LibraryPage() {
  const rows: LibraryRow[] = ATLAS_V2_CHAPTERS.map((c) => ({
    slug: c.slug, title: c.title, sourceDomain: c.sourceDomain,
    sources: c.sources,
    paragraphCount: c.paragraphCount, imageCount: c.imageCount,
    tables: c.tables.length, diagrams: c.diagrams.length,
  }));
  return (
    <>
      <p style={{ fontSize: "0.85rem", color: "var(--muted)", textAlign: "center" }}>
        Release {ATLAS_V2_RELEASE.contentRelease} · version {ATLAS_V2_RELEASE.version} · {ATLAS_V2_CHAPTERS.length} chapters
      </p>
      <LibraryClient rows={rows} />
    </>
  );
}
