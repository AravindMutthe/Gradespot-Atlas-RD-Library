import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { V1_SECTIONS, type V1Block } from "@/components/atlas-v1-data";
// Atlas V2 (Preview 2, WP3–WP5): the 57 consolidated chapters take precedence
// on their verbatim slugs; any slug not in the V2 set falls back to V1 below.
import { ATLAS_V2_BY_SLUG, ATLAS_V2_CHAPTERS } from "@/lib/atlas-v2/chapters";
import { ATLAS_V2_DOMAIN_MAP } from "@/lib/atlas-v2/domains";
import { ATLAS_V2_RELATED } from "@/lib/atlas-v2/related";
import Reader, { type ChapterLite, type RelatedResolved } from "@/components/atlas-v2/Reader";
import { displayTitle } from "@/lib/atlas-v2/display-title";

export function generateStaticParams() {
  const slugs = new Set<string>([...ATLAS_V2_CHAPTERS.map((c) => c.slug), ...V1_SECTIONS.map((s) => s.slug)]);
  return [...slugs].map((slug) => ({ slug }));
}

// Editorial description written for the Step 1 reader chapter only. The
// remaining 56 chapters still use auto-sliced first-paragraph descriptions
// (a known DES-03 gap: descriptions must be editorial, not auto-sliced).
const NIC_EDITORIAL_DESCRIPTION =
  "How a network interface card moves from silicon to a working device: PCIe discovery, driver binding, kernel interfaces, packet transfer and practical troubleshooting.";
const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v2 = ATLAS_V2_BY_SLUG[slug];
  if (v2) {
    const first = v2.blocks.flatMap((b) => b.paras)[0] ?? "";
    return {
      title: `${displayTitle(v2.title)} — Aravind Systems Atlas`,
      description: slug === "from-silicon-to-a-working-nic" ? NIC_EDITORIAL_DESCRIPTION : first.slice(0, 160),
      alternates: { canonical: `${BASE}/${slug}/` },
    };
  }
  const sec = V1_SECTIONS.find((s) => s.slug === slug);
  // Step 2 (DES-03 section 5 mandatory correction): V1 fallback slugs now
  // carry a canonical URL. Canonical metadata only: a static export
  // provides no functioning HTTP redirects, and none is claimed or
  // implemented — a fallback slug is served directly at its own URL, never
  // redirected. Measured 2026-10-27, all 30 V1 slugs coincide with canonical
  // chapter slugs, so for every emitted route the v2 branch above governs
  // and this branch is unreachable; it exists so any future V1-only slug
  // still gets a canonical instead of none.
  return { title: sec ? `${sec.title} — Systems Knowledge Atlas V1` : "Systems Knowledge Atlas V1", alternates: { canonical: `${BASE}/${slug}/` } };
}

function anchorId(text: string, i: number): string {
  const s = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return s ? `s-${s}` : `s-${i}`;
}

function renderBlocks(blocks: V1Block[]) {
  return blocks.map((b, i) => (
    <section key={i} id={b.h2 ? anchorId(b.h2, i) : undefined}>
      {b.h2 ? <h2>{b.h2}</h2> : null}
      {b.paras.map((p, j) => (
        <p key={j}>{p}</p>
      ))}
      {b.lists.map((list, j) => (
        <ul key={j}>
          {list.map((item, k) => (
            <li key={k}>{item}</li>
          ))}
        </ul>
      ))}
      {b.subs.map((s, j) => (
        <div key={j}>
          <h3>{s.h3}</h3>
          {s.paras.map((p, k) => (
            <p key={k}>{p}</p>
          ))}
          {s.lists.map((list, k) => (
            <ul key={k}>
              {list.map((item, m) => (
                <li key={m}>{item}</li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </section>
  ));
}

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v2 = ATLAS_V2_BY_SLUG[slug];
  if (v2) {
    const vi = ATLAS_V2_CHAPTERS.findIndex((c) => c.slug === slug);
    const domainOf = Object.fromEntries(ATLAS_V2_DOMAIN_MAP.map((m) => [m.slug, m]));
    const all: ChapterLite[] = ATLAS_V2_CHAPTERS.map((c) => ({ slug: c.slug, title: c.title, proposedDomain: domainOf[c.slug]?.proposedDomain ?? "Not recorded" }));
    const related: RelatedResolved[] = (ATLAS_V2_RELATED[slug] ?? []).map((r) => ({
      slug: r.slug, title: ATLAS_V2_BY_SLUG[r.slug]?.title ?? r.slug,
      proposedDomain: domainOf[r.slug]?.proposedDomain ?? "Not recorded",
      sourceDomain: ATLAS_V2_BY_SLUG[r.slug]?.sourceDomain ?? "Not recorded",
      evidence: r.evidence, detail: r.detail,
    }));
    const prev = vi > 0 ? all[vi - 1] : null;
    const next = vi < all.length - 1 ? all[vi + 1] : null;
    const map = domainOf[slug];
    return <Reader chapter={v2} prev={prev} next={next} related={related} all={all} proposedDomain={map?.proposedDomain ?? "Not recorded"} sourceDomain={v2.sourceDomain} flagged={map?.flagged ?? false} />;
  }
  const idx = V1_SECTIONS.findIndex((s) => s.slug === slug);
  if (idx < 0) notFound();
  const sec = V1_SECTIONS[idx];
  const prev = idx > 0 ? V1_SECTIONS[idx - 1] : null;
  const next = idx < V1_SECTIONS.length - 1 ? V1_SECTIONS[idx + 1] : null;
  const nav = sec.blocks.filter((b) => b.h2).map((b) => b.h2);
  return (
    <>
      <p className="eyebrow">
        Atlas V1 · Section {String(idx + 1).padStart(2, "0")} of {V1_SECTIONS.length} · Hybrid Edition
      </p>
      <h1>{sec.title}</h1>
      <p className="lead">
        {sec.imgs} original images embedded in the source book for this
        section · Text presented verbatim from the source HTML; interactive
        taps from the original become section navigation here.
      </p>
      {nav.length > 1 ? (
        <div className="atlas-tabs" style={{ margin: "16px 0" }}>
          {nav.map((h, i) => (
            <a key={i} href={`#${anchorId(h, i)}`}>{h}</a>
          ))}
        </div>
      ) : null}
      {renderBlocks(sec.blocks)}
      {sec.researchVariant ? (
        <div id="research-edition" className="panel enhance">
          <span className="tag">Research &amp; Strategy Edition — variant introduction</span>
          <p>
            The Research Edition replaces this introduction with its own
            framing — architecture of power, markets &amp; technology;
            different systems, recurring problems; power is not a metaphor
            for a CPU; research pathways. Its text follows verbatim.
          </p>
          {renderBlocks(sec.researchVariant)}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
        {prev ? <Link className="btn" href={`/${prev.slug}`}>← {prev.title}</Link> : null}
        {next ? <Link className="btn" href={`/${next.slug}`}>{next.title} →</Link> : null}
        <Link className="btn" href="/">🏠 Overview</Link>
      </div>
      <footer>
        Systems Knowledge Atlas V1 · Section {idx + 1} of {V1_SECTIONS.length}
      </footer>
    </>
  );
}
