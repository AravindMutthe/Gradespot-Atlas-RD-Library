import type { Metadata } from "next";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";
import Link from "next/link";
import pathsData from "@/lib/preview3/learning-paths.json";
import chapterTitles from "@/lib/preview3/chapter-titles.json";

export const metadata: Metadata = {
  title: "Learning Paths — Aravind Systems Atlas",
  description:
    "Five starter learning paths sequencing real chapters of the Aravind Systems Atlas only.",
  alternates: { canonical: `${BASE}/learning-paths/` },
};

type Step = { slug: string; why: string };
type Path = { id: string; title: string; focus: string; steps: Step[] };

const TITLES = chapterTitles as Record<string, string>;

export default function LearningPathsPage() {
  const paths = pathsData.paths as Path[];
  return (
    <>
      <p className="eyebrow">Release v1-consolidated-001</p>
      <h1>Choose your learning path</h1>
      <p className="lead">
        Five starter paths. Every step is a real chapter from the 57-chapter
        consolidated master — no mockup or example title has been turned into
        a chapter, and no chapter has been invented for a path.
      </p>
      <h2>Choose a path</h2>
      <div className="grid" id="chooser">
        {paths.map((p) => (
          <Link key={p.id} className="card" href={`#path-${p.id}`}>
            <h3>{p.title}</h3>
            <p>{p.focus}</p>
            <p>
              <strong>
                {p.steps.length} steps · all real chapters
              </strong>
            </p>
          </Link>
        ))}
      </div>
      {paths.map((p) => (
        <section className="panel" key={p.id} id={`path-${p.id}`}>
          <h2>{p.title}</h2>
          <p>{p.focus}</p>
          <ol>
            {p.steps.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`}>{TITLES[s.slug] ?? s.slug}</Link>
                {" — "}
                {s.why}
              </li>
            ))}
          </ol>
          <p>
            <Link href="#chooser">Back to chooser</Link>
          </p>
        </section>
      ))}
    </>
  );
}
