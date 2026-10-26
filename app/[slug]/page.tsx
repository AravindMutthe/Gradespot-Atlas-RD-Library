import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { V1_SECTIONS, type V1Block } from "@/components/atlas-v1-data";

export function generateStaticParams() {
  return V1_SECTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sec = V1_SECTIONS.find((s) => s.slug === slug);
  return { title: sec ? `${sec.title} — Systems Knowledge Atlas V1` : "Systems Knowledge Atlas V1" };
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
