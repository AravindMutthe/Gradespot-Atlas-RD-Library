import type { Metadata } from "next";
import Link from "next/link";
import { ATLAS_V2_CHAPTERS } from "@/lib/atlas-v2/chapters";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  title: "Diagrams — Aravind Systems Atlas",
  description:
    "Index of chapter diagrams across the Atlas. Each entry names its canonical chapter; the full diagram text lives in the chapter.",
  alternates: { canonical: `${BASE}/diagrams/` },
};

// Diagrams index (v2.0 initial scope, Phase 1 nav convergence).
// Listing surface over APPROVED baseline content only: every diagram in
// the v1-consolidated-001 baseline, grouped by its canonical chapter. This
// page lists diagram titles and links — it does not duplicate diagram
// bodies, and it creates no standalone concept pages. Diagram text lives
// in the chapter. Counts below are computed from the baseline data at
// build time, never hand-written.
export default function DiagramsPage() {
  const withDiagrams = ATLAS_V2_CHAPTERS.filter((c) => c.diagrams.length > 0);
  const total = withDiagrams.reduce((n, c) => n + c.diagrams.length, 0);
  return (
    <>
      <p className="eyebrow">Visual knowledge</p>
      <h1>Diagrams</h1>
      <p className="lead">
        {total} diagrams across {withDiagrams.length} chapters. Each entry names its canonical
        chapter — open the chapter for the full diagram text and its source context.
      </p>
      {withDiagrams.map((c) => (
        <section key={c.slug} aria-labelledby={`diagrams-${c.slug}`}>
          <h2 id={`diagrams-${c.slug}`}>
            <Link href={`/${c.slug}/`}>{c.title}</Link>
          </h2>
          <ul>
            {c.diagrams.map((d, i) => (
              <li key={`${c.slug}-${i}`}>
                {d.h2}
                {d.source ? <span> — source: {d.source}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        Diagrams in the teaching journey are original educational redraws, not reproductions of
        handwritten notes. See the{" "}
        <Link href="/system-explorer/">System Explorer</Link> for the interactive NIC teaching
        model.
      </p>
    </>
  );
}
