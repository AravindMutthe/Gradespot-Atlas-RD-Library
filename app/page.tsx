import type { Metadata } from "next";
import Link from "next/link";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  alternates: { canonical: `${BASE}/` },
};
import { ATLAS_V2_CHAPTERS, ATLAS_V2_RELEASE } from "@/lib/atlas-v2/chapters";

// Homepage per the DECIDED hero lockup (DES-02 §7.2, DES-03 §3):
// compact brand in the header (see layout); H1 is the Atlas name only;
// positioning line directly beneath as real HTML text (not a second H1);
// supporting sentence is DRAFT copy and is labelled as such.
const DISCOVERY: { href: string; title: string; text: string }[] = [
  {
    href: "/explore",
    title: "Explore by Topic",
    text: "Concepts and curated collections across the library.",
  },
  {
    href: "/explore",
    title: "Explore by Industry",
    text: "Technology connected with real-world sectors, inside Explore.",
  },
  {
    href: "/library",
    title: "Technical Library",
    text: "The canonical chapter collection, grouped and filterable.",
  },
  {
    href: "/learning-paths",
    title: "Learning Paths",
    text: "Structured cross-domain journeys through real chapters.",
  },
];

export default function Home() {
  return (
    <>
      <p className="eyebrow">Cross-industry technology and economic knowledge</p>
      <h1 className="hero-h1">Aravind Systems Atlas</h1>
      <p className="positioning">
        Professional Cross-Industry Technology and Economic Knowledge Hub.
      </p>
      <p className="description">
        Explore how computing systems, infrastructure, businesses and industries connect across the
        global digital economy.
        <span className="draft-note">Draft wording</span>
      </p>
      <div className="hero-actions">
        <Link className="btn" href="/explore">
          Explore Knowledge
        </Link>
        <Link className="btn-secondary" href="/library">
          Browse Library
        </Link>
      </div>
      <h2>Discover the Atlas</h2>
      <div className="grid">
        {DISCOVERY.map((d) => (
          <Link key={d.title} href={d.href} className="card">
            <h3>{d.title}</h3>
            <p>{d.text}</p>
          </Link>
        ))}
      </div>
      <div className="panel verify">
        <span className="tag">Honesty note</span>
        <p>
          {ATLAS_V2_CHAPTERS.length} chapters · release {ATLAS_V2_RELEASE.contentRelease} ·
          version {ATLAS_V2_RELEASE.version}. Recovered historical exports are partial
          reconstructions, not verbatim transcripts. Nothing here is presented as a certification
          that every prior conversation was recovered verbatim.
        </p>
      </div>
    </>
  );
}
