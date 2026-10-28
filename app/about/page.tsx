import type { Metadata } from "next";
import Link from "next/link";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  title: "About — Aravind Systems Atlas",
  description:
    "About the Aravind Systems Atlas: purpose, methodology, release information and what this research edition is not.",
  alternates: { canonical: `${BASE}/about/` },
};

export default function AboutPage() {
  return (
    <>
      <p className="eyebrow">Release v1-consolidated-001</p>
      <h1>About the Atlas</h1>
      <p className="positioning">
        Professional Cross-Industry Technology and Economic Knowledge Hub.
      </p>
      <p className="lead">
        A research library built from one person&apos;s handwritten systems
        notes, preserved first and explained second.
      </p>
      <section className="panel">
        <h2>What it is</h2>
        <p>
          The Aravind Systems Atlas is a 57-chapter research library covering
          computing and hardware, networks and infrastructure, institutions
          and markets, systems evolution, and industrial and business
          networks. Its source is a set of handwritten notebook pages, plus
          editorial synthesis that organizes those notes into readable
          chapters. Chapter text is preserved and verified against the
          consolidated master (57 of 57 chapters in the latest migration
          check). Original-note images are referenced by each chapter but
          are not yet published in this build — the original-note assets
          step is still pending, so note galleries currently resolve to no
          image files.
        </p>
      </section>
      <section className="panel">
        <h2>What it is not</h2>
        <ul>
          <li>
            Not a certified history and not a textbook: transcription
            verification is still in progress, and paraphrases are never
            presented as verbatim quotations.
          </li>
          <li>
            Not a second copy of anything else: this standalone site is the
            canonical full library. The portfolio, if it links here at all,
            links in as a curated gateway — it does not duplicate chapters.
          </li>
          <li>
            Not an AI tutor and not a labs product: there is no AI in the
            navigation, and Labs is labelled “planned” only until a real lab
            exists.
          </li>
        </ul>
      </section>
      <section className="panel">
        <h2>Methodology</h2>
        <p>
          Preservation first: chapter text is preserved exactly and verified;
          explanation second: redraws, syntheses and corrections are labelled
          as added material, never silently merged into the original wording.
          Consolidation: the 57 chapters reconcile a research-edition baseline
          (733 paragraphs kept) with industry-evolution material (283
          paragraphs added), dropping 14 duplicate paragraphs (release
          manifest v1-consolidated-001). One inventory discrepancy remains
          explicitly unresolved: the consolidated chapter data totals 1,040
          paragraphs against the release accounting of 733 + 283 = 1,016.
          Neither figure is silently chosen; the migration preserves the
          chapter data exactly. The full rules for sources live in the
          Sources section, which is gated and not published in initial v2.0
          scope.
        </p>
      </section>
      <section className="panel">
        <h2>Timelines — status note</h2>
        <p>
          Timelines are represented in the design system only in this edition.
          A full interactive timeline is a later batch. No timeline page is
          advertised here as completed.
        </p>
      </section>
      <section className="panel">
        <h2>Release</h2>
        <p>
          Release <code>v1-consolidated-001</code> · Version{" "}
          <code>1.0.0-continuing</code> · Status: research-edition · 57
          chapters · 136 unique original-note images · 22 diagrams · 48
          tables · Content SHA-256 <code>970489efd3899d29</code>. Manifest:{" "}
          <Link href="/release.json">/release.json</Link>.
        </p>
        <p>
          Start reading: <Link href="/learning-paths">Choose your learning path</Link>
          {" · "}
          <Link href="/system-explorer">System Explorer</Link>
          {" · "}
          Sources (gated)
        </p>
      </section>
    </>
  );
}
