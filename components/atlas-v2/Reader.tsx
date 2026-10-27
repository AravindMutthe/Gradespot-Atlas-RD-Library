"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { AtlasV2Chapter } from "@/lib/atlas-v2/chapters";
import styles from "./reader.module.css";

export interface RelatedResolved { slug: string; title: string; proposedDomain: string; evidence: string; detail: string; }
export interface ChapterLite { slug: string; title: string; proposedDomain: string; }

function anchorId(text: string, i: number): string {
  const s = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return s ? `sec-${s}` : `sec-${i}`;
}
type Kind = "original" | "technical" | "walkthrough" | "editorial";
function kindOf(p: string): Kind {
  if (p.startsWith("From the original page")) return "original";
  if (p.startsWith("Technical expansion")) return "technical";
  if (p.startsWith("System walkthrough")) return "walkthrough";
  return "editorial";
}
function readJson(key: string): unknown {
  try { const v = window.localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function writeJson(key: string, value: unknown): boolean {
  try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

export default function Reader({ chapter, prev, next, related, all, proposedDomain, sourceDomain, flagged }:
  { chapter: AtlasV2Chapter; prev: ChapterLite | null; next: ChapterLite | null; related: RelatedResolved[]; all: ChapterLite[]; proposedDomain: string; sourceDomain: string; flagged: boolean; }) {
  const [mode, setMode] = useState<"learn" | "reference">("learn");
  const [fontStep, setFontStep] = useState(1);
  const [lineHeight, setLineHeight] = useState<"comfortable" | "compact">("comfortable");
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [dark, setDark] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bookmarks, setBookmarks] = useState<{ slug: string; anchor: string; heading: string }[]>([]);
  const [storageFailed, setStorageFailed] = useState(false);
  const pendingAnchor = useRef<string>("");
  const handleMode = (m: "learn" | "reference") => {
    // Record the section at the top of the viewport so the mode switch can
    // return to it: section ids are stable across modes (DES-04).
    const secs = Array.from(document.querySelectorAll("section[id]"));
    let current = "";
    for (const s of secs) {
      if ((s as HTMLElement).getBoundingClientRect().top <= 120) current = s.id;
    }
    pendingAnchor.current = current;
    setMode(m);
  };

  useEffect(() => {
    const prefs = readJson("atlas-v2-reader-prefs") as Record<string, unknown> | null;
    if (prefs) {
      if (prefs.mode === "explore") setMode("learn");
      else if (prefs.mode === "research") setMode("reference");
      else if (prefs.mode === "learn" || prefs.mode === "reference") setMode(prefs.mode);
      if (typeof prefs.fontStep === "number") setFontStep(prefs.fontStep);
      if (prefs.lineHeight === "compact" || prefs.lineHeight === "comfortable") setLineHeight(prefs.lineHeight);
      if (prefs.fontFamily === "sans" || prefs.fontFamily === "serif") setFontFamily(prefs.fontFamily);
      if (typeof prefs.dark === "boolean") setDark(prefs.dark);
    }
    const bm = readJson("atlas-v2-bookmarks");
    if (Array.isArray(bm)) setBookmarks(bm.filter((b) => b && typeof b.slug === "string"));
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((h.scrollTop / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawer(false); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => {
    if (!writeJson("atlas-v2-reader-prefs", { mode, fontStep, lineHeight, fontFamily, dark })) setStorageFailed(true);
  }, [mode, fontStep, lineHeight, fontFamily, dark]);

  useEffect(() => {
    if (pendingAnchor.current) {
      const el = document.getElementById(pendingAnchor.current);
      if (el) el.scrollIntoView({ block: "start" });
      pendingAnchor.current = "";
    }
  }, [mode]);

  const toc = useMemo(() => chapter.blocks.filter((b) => b.h2).map((b, i) => ({ id: anchorId(b.h2, i), h2: b.h2 })), [chapter]);
  const toggleBookmark = (anchor: string, heading: string) => {
    const exists = bookmarks.some((b) => b.slug === chapter.slug && b.anchor === anchor);
    const nextBm = exists ? bookmarks.filter((b) => !(b.slug === chapter.slug && b.anchor === anchor))
      : [...bookmarks, { slug: chapter.slug, anchor, heading }];
    setBookmarks(nextBm);
    if (!writeJson("atlas-v2-bookmarks", nextBm)) setStorageFailed(true);
  };
  const fontSize = ["100%", "112%", "125%", "140%"][fontStep] ?? "112%";
  const wrapClass = `${styles.wrap} ${fontFamily === "sans" ? styles.wrapSans : ""} ${dark ? styles.wrapDark : ""}`;

  const renderPara = (p: string, key: number) => {
    const cls = p.includes("→") ? styles.stepflow : undefined;
    return <p key={key} className={cls}>{p}</p>;
  };
  const renderBlock = (b: AtlasV2Chapter["blocks"][number], bi: number) => {
    const id = b.h2 ? anchorId(b.h2, bi) : undefined;
    const technical = b.paras.filter((p) => kindOf(p) === "technical");
    const shown = b.paras.filter((p) => kindOf(p) !== "technical");
    const isBookmarked = id ? bookmarks.some((x) => x.slug === chapter.slug && x.anchor === id) : false;
    const tech = (keyPrefix: string) => technical.map((p, j) => renderPara(p, 1000 + j));
    return (
      <section key={bi} id={id} aria-label={b.h2 || undefined}>
        {b.h2 ? (
          <div className={styles.sectionHead}>
            <h2>{b.h2}</h2>
            {id ? <button type="button" className={`${styles.btn} ${styles.bookmarkBtn}`} onClick={() => toggleBookmark(id, b.h2)} aria-pressed={isBookmarked}>
              {isBookmarked ? "★ Bookmarked" : "☆ Bookmark section"}
            </button> : null}
          </div>
        ) : null}
        {shown.map((p, j) => renderPara(p, j))}
        {technical.length > 0 && mode === "learn" ? (
          <details key={expandAll ? "open" : "closed"} open={expandAll} className={styles.details}>
            <summary>Technical depth — {technical.length} paragraph{technical.length === 1 ? "" : "s"} (editorial expansion, not manuscript text)</summary>
            {tech("t")}
          </details>
        ) : null}
        {technical.length > 0 && mode === "reference" ? tech("r") : null}
        {b.lists.map((list, j) => (
          <ul key={j}>{list.map((item, k) => <li key={k}>{item}</li>)}</ul>
        ))}
      </section>
    );
  };
  const extraSection = (id: string, title: string, children: React.ReactNode) => mode === "learn" ? (
    <section id={id}><details key={expandAll ? "open" : "closed"} open={expandAll} className={styles.details}><summary>{title} — expand to read (also fully shown in Technical Reference mode)</summary>{children}</details></section>
  ) : (<section id={id}><h2>{title}</h2>{children}</section>);

  return (
    <div className={wrapClass}>
      <div className={styles.progress} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress"><div style={{ width: `${progress}%` }} /></div>
      <nav className={styles.topbar} aria-label="Chapter navigation">
        <button type="button" className={`${styles.btn} ${styles.drawerBtn}`} aria-expanded={drawer} aria-controls="atlas-drawer" onClick={() => setDrawer(true)}>Chapters</button>
      </nav>
      {drawer ? (<>
        <button type="button" className={styles.drawerBackdrop} aria-label="Close chapter drawer" onClick={() => setDrawer(false)} />
        <div id="atlas-drawer" className={styles.drawer} role="dialog" aria-label="All chapters">
          <button type="button" className={styles.btn} onClick={() => setDrawer(false)}>Close ✕</button>
          <h2>All 57 chapters</h2>
          {all.map((c) => <Link key={c.slug} href={`/${c.slug}`} onClick={() => setDrawer(false)}>{c.title}</Link>)}
        </div>
      </>) : null}
      {storageFailed ? <p className={styles.notice} role="status">Browser storage is unavailable, so bookmarks and font settings will last only for this visit. Reading itself is unaffected.</p> : null}
      <p className={styles.crumbs}><Link href="/">Home</Link> / <Link href="/library">Library</Link> / {chapter.title}</p>
      <div className={styles.controls} aria-label="Reader controls">
        <label htmlFor="mode">Reading mode</label>
        <select id="mode" value={mode} onChange={(e) => handleMode(e.target.value as "learn" | "reference")}>
          <option value="learn">Explore &amp; Learn — approachable, technical depth expandable</option>
          <option value="reference">Technical Reference — full technical depth</option>
        </select>
        <label htmlFor="font-size">Text size</label>
        <select id="font-size" value={fontStep} onChange={(e) => setFontStep(Number(e.target.value))}>
          <option value={0}>Small</option><option value={1}>Medium</option><option value={2}>Large</option><option value={3}>Extra large</option>
        </select>
        <label htmlFor="line-height">Spacing</label>
        <select id="line-height" value={lineHeight} onChange={(e) => setLineHeight(e.target.value as "comfortable" | "compact")}>
          <option value="comfortable">Comfortable</option><option value="compact">Compact</option>
        </select>
        <label htmlFor="font-family">Font</label>
        <select id="font-family" value={fontFamily} onChange={(e) => setFontFamily(e.target.value as "serif" | "sans")}>
          <option value="serif">Serif</option><option value="sans">Sans-serif</option>
        </select>
        <button type="button" className={styles.btn} onClick={() => setDark(!dark)} aria-pressed={dark}>{dark ? "☀ Light theme" : "🌙 Dark theme"}</button>
        {mode === "learn" ? <button type="button" className={styles.btn} onClick={() => setExpandAll(!expandAll)}>{expandAll ? "Collapse technical detail" : "Expand all technical detail"}</button> : null}
        <span className={styles.progressText} aria-live="polite">{progress}% read</span>
      </div>
      <div className={styles.layout}>
        <aside className={styles.sideCol} aria-label="Chapter navigation">
          <h2>Chapters</h2>
          {all.map((c) => <Link key={c.slug} href={`/${c.slug}`} aria-current={c.slug === chapter.slug ? "page" : undefined} style={c.slug === chapter.slug ? { fontWeight: 700 } : undefined}>{c.title}</Link>)}
        </aside>
        <article className={styles.article} style={{ fontSize, lineHeight: lineHeight === "comfortable" ? 1.75 : 1.5 }}>
          <p className={styles.meta}>Content release v1-consolidated-001 · version 1.0.0-continuing</p>
          <h1>{chapter.title}</h1>
          <p className={styles.lead}>Proposed grouping: {proposedDomain} (proposed, pending reconciliation){flagged ? " · flagged for review" : ""} · Source domain: {sourceDomain} · {chapter.paragraphCount} paragraphs · {chapter.imageCount} images · {chapter.tables.length} tables · {chapter.diagrams.length} diagrams</p>
          <p className={styles.meta}>Sources: {chapter.sources.length > 0 ? chapter.sources.join(" · ") : "Not recorded in the master (shown as missing, not guessed)."}</p>
          <div className={styles.callout}>
            <strong>How to read this chapter.</strong> Paragraphs beginning “From the original pages” paraphrase the handwritten sources. Paragraphs beginning “Technical expansion and corrections” are editorial explanation, not manuscript text. In Explore &amp; Learn mode the editorial technical paragraphs sit inside “Technical depth” disclosures — expand them any time; nothing is hidden permanently. Technical Reference mode shows everything, including sources, diagrams and original evidence, without collapsing.
          </div>
          {chapter.blocks.map(renderBlock)}
          {chapter.diagrams.length > 0 ? extraSection("diagrams", "Diagrams", chapter.diagrams.map((g, i) => (
            <figure key={i}><figcaption><strong>{g.h2 || `Diagram ${i + 1}`}</strong>{g.source ? ` — source: ${g.source}` : ""}</figcaption><pre className={styles.diagram}>{g.text}</pre></figure>
          ))) : null}
          {chapter.tables.length > 0 ? extraSection("tables", "Tables", chapter.tables.map((t, i) => (
            <figure key={i}><figcaption><strong>{t.h2 || `Table ${i + 1}`}</strong>{t.source ? ` — source: ${t.source}` : ""}</figcaption>
              <div className={styles.tableWrap}><table><tbody>{t.rows.map((row, r) => (
                <tr key={r}>{row.map((cell, c) => r === 0 ? <th key={c} scope="col">{cell}</th> : <td key={c}>{cell}</td>)}</tr>
              ))}</tbody></table></div></figure>
          ))) : null}
          <section id="original-notes">
            <h2>Original notes</h2>
            <p>Scans are shown as a gallery: the master does not record where each scan falls in the text, so no interleaving is invented. Files are linked by filename. <strong>SHA verification is not claimed</strong> — recorded master SHAs are known not to match the stored files, so no SHA is displayed as proof.</p>
            {chapter.originalNotes.length > 0 ? (
              <div className={styles.gallery}>{chapter.originalNotes.map((f) => (
                <figure key={f}><img src={`/atlas-images/${encodeURIComponent(f)}`} alt={`Original note scan ${f}`} loading="lazy" /><figcaption>{f}</figcaption></figure>
              ))}</div>
            ) : <p>No original-note scans recorded for this chapter in the master (shown as missing, not guessed).</p>}
          </section>
          <section id="bookmarks">
            <h2>Your bookmarks in this chapter</h2>
            {bookmarks.filter((b) => b.slug === chapter.slug).length > 0 ? (
              <ul>{bookmarks.filter((b) => b.slug === chapter.slug).map((b) => <li key={b.anchor}><a href={`#${b.anchor}`}>{b.heading}</a></li>)}</ul>
            ) : <p>No bookmarks yet — use “Bookmark section” beside any section heading. Bookmarks live only in this browser.</p>}
          </section>
          <section id="related">
            <h2>Related chapters</h2>
            <p>Every link below is labelled with its evidence. “Chapter-link” is the chapter’s own list; “shared-concept” means the verified concepts index lists both chapters; “same-domain” is proposed-domain grouping only, not an editorial claim.</p>
            {related.map((r) => (
              <div key={r.slug} className={styles.card}><Link href={`/${r.slug}`}>{r.title}</Link><p>{r.proposedDomain} · {r.evidence} — {r.detail}</p></div>
            ))}
          </section>
          <nav className={styles.prevNext} aria-label="Previous and next chapters">
            {prev ? <Link className={styles.btn} href={`/${prev.slug}`}>← Previous: {prev.title}</Link> : <span />}
            <Link className={styles.btn} href="/library">Library</Link>
            {next ? <Link className={styles.btn} href={`/${next.slug}`}>Next: {next.title} →</Link> : null}
          </nav>
          <footer className={styles.meta}>Aravind Systems Atlas · release v1-consolidated-001 · Recovered historical exports are partial reconstructions, not verbatim transcripts.</footer>
        </article>
        <aside className={styles.tocCol} aria-label="On this page">
          <nav className={styles.toc}>
            <h2>On this page</h2>
            {toc.map((t) => <a key={t.id} href={`#${t.id}`}>{t.h2}</a>)}
            {chapter.diagrams.length > 0 ? <a href="#diagrams">Diagrams</a> : null}
            {chapter.tables.length > 0 ? <a href="#tables">Tables</a> : null}
            <a href="#original-notes">Original notes</a>
            <a href="#related">Related chapters</a>
          </nav>
        </aside>
      </div>
    </div>
  );
}
