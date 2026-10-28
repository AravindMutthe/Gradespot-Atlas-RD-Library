import type { Metadata } from "next";
import Link from "next/link";
import { ATLAS_V2_CHAPTERS } from "@/lib/atlas-v2/chapters";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  title: "Timelines — Aravind Systems Atlas",
  description:
    "Timeline discipline and historical reading across the Atlas: documented dates only, undated material labelled undated, never dated by inference.",
  alternates: { canonical: `${BASE}/timelines/` },
};

// Timelines index (v2.0 initial scope, Phase 1 nav convergence).
// This surface lists contextual evidence over APPROVED baseline content
// only. Timeline discipline, stated plainly: an entry carries a date only
// when an owner-approved dated source states it; undated material is
// labelled undated and is never dated by inference from the journey
// sequence, from chapter order, or from topic plausibility. The journey's
// teaching order is a conceptual teaching order, not a historical timeline,
// and must never be read as one.
//
// Current state (honest, not a gap filled by invention): NO dated timeline
// entries are published in initial v2.0 scope, because no dated source has
// been approved for publication as a timeline entry. The historical
// reading below is therefore presented in chapter order, not as a dated
// sequence. Private notebook dates are NOT published here: the private
// review authorized transcription, not publication, and no notebook-derived
// date or association enters any public surface until the owner approves it.
export default function TimelinesPage() {
  const history = ATLAS_V2_CHAPTERS.filter((c) => c.sourceDomain === "systems-evolution");
  return (
    <>
      <p className="eyebrow">Contextual evidence</p>
      <h1>Timelines</h1>
      <p className="lead">
        Timelines in the Atlas show contextual evidence with documented dates only. Anything
        without an approved dated source is labelled undated — never dated by inference from
        the journey sequence, from chapter order, or from topic plausibility.
      </p>
      <div className="panel verify">
        <span className="tag">Current state</span>
        <p>
          No dated timeline entries are published in initial v2.0 scope. Dated entries require
          owner-approved dated sources; until such sources are approved, historical material is
          presented below in chapter order, not as a dated sequence. The journey&apos;s teaching
          order is a conceptual order, not a historical timeline.
        </p>
      </div>
      <h2>Historical reading — Systems Evolution chapters</h2>
      <p>
        The chapters below carry the collection&apos;s era-spanning historical material, grouped
        by their verified master domain (Systems Evolution). They are listed in chapter order,
        not chronological order — no date is claimed for any of them here.
      </p>
      <div className="grid">
        {history.map((c) => (
          <Link key={c.slug} href={`/${c.slug}/`} className="card">
            <h3>{c.title}</h3>
            <p>
              {c.paragraphCount} paragraphs · {c.tables.length} tables · {c.diagrams.length}{" "}
              diagrams
            </p>
          </Link>
        ))}
      </div>
      <p>
        Prefer a guided path into this material?{" "}
        <Link href="/#beat-01">Begin the journey at Origins — Signals and communication</Link>.
      </p>
    </>
  );
}
