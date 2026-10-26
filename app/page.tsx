import Link from "next/link";
import { V1_SECTIONS, V1_META } from "@/components/atlas-v1-data";

function blurb(sec: (typeof V1_SECTIONS)[number]): string {
  for (const b of sec.blocks) {
    if (b.paras.length > 0) return b.paras[0].slice(0, 170);
    for (const s of b.subs) {
      if (s.paras.length > 0) return s.paras[0].slice(0, 170);
    }
  }
  return "";
}

export default function Home() {
  const intro = V1_SECTIONS[0];
  return (
    <>
      <p className="eyebrow">Hybrid edition · editorial reading + engineering diagrams</p>
      <h1>From human communication to interconnected digital systems.</h1>
      <p className="lead">
        85 bundled handwritten source images · 15 editorial chapters ·
        offline-first technical knowledge atlas — now as its own website,
        in the V1 design, not inside the portfolio.
      </p>
      <div className="hero">
        <h2 style={{ marginTop: 0 }}>🧭 Two connected learning paths</h2>
        <p>Read as a story, inspect as an engineer.</p>
        <p>
          <b>Historical &amp; founder path:</b> communication needs →
          standards and governance → global supply chains → industrial
          adoption → leadership and business models.
        </p>
        <p>
          <b>Career &amp; systems path:</b> silicon and NICs → Linux kernel
          and network stack → cloud infrastructure → operational scheduling
          and reliability.
        </p>
        <div className="atlas-tabs">
          <Link href={`/${V1_SECTIONS[1].slug}`}>📜 Begin the history</Link>
          <Link href={`/${V1_SECTIONS[3].slug}`}>⚙️ Inspect a technical system</Link>
          <Link href="/source-photographs">📚 Browse every original scan</Link>
        </div>
      </div>
      <div className="panel verify">
        <span className="tag">Honesty note — from the V1 manifest itself</span>
        <p>
          V1 states it is <b>not</b> a certification that every prior
          conversation was recovered verbatim or every historical correction
          audited. The Research Edition adds: research validation remains in
          progress. Those qualifiers stay attached here.
        </p>
      </div>
      <div className="panel enhance">
        <span className="tag">🔬 Research &amp; Strategy Edition</span>
        <p>
          The same 29 sections with a different introduction: architecture of
          power, markets &amp; technology; different systems, recurring
          problems; power is not a metaphor for a CPU; research pathways.
          Read it on the introduction page.
        </p>
        <p>
          <Link className="btn" href="/from-human-communication-to-interconnected-digital-systems#research-edition">
            Read the research introduction →
          </Link>
        </p>
      </div>
      <h2>Choose a chapter</h2>
      <div className="grid">
        {V1_SECTIONS.map((sec, i) => (
          <Link key={sec.slug} href={`/${sec.slug}`} className="card">
            <span className="tag">
              Section {String(i + 1).padStart(2, "0")} · {sec.imgs} original images
            </span>
            <h3 style={{ marginTop: 8 }}>{sec.title}</h3>
            <p>{blurb(sec)}</p>
          </Link>
        ))}
      </div>
      <div className="orig-banner">
        Original images: the source books embed {V1_META.embeddedImages}{" "}
        original images. They are not copied into this site&apos;s repository;
        the original 110&nbsp;MB HTML files remain the source of truth in the
        Atlas archive.
      </div>
      <footer>
        Aravind Systems Knowledge Atlas V1 · {V1_META.sections} sections ·{" "}
        Hybrid &amp; Research Editions · Built with Next.js
      </footer>
    </>
  );
}
