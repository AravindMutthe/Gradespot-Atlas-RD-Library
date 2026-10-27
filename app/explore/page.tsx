import type { Metadata } from "next";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";
import Link from "next/link";
import journeyData from "@/lib/preview3/explorer-nic-journey.json";
import chapterTitles from "@/lib/preview3/chapter-titles.json";
import NicJourney from "@/components/explorer/NicJourney";

export const metadata: Metadata = {
  title: "System Explorer: NIC packet path — Aravind Systems Atlas",
  description:
    "System Explorer: the NIC packet path end-to-end, from PCIe discovery to packet transfer, grounded in the NIC chapter.",
  alternates: { canonical: `${BASE}/explore/` },
};

const TITLES = chapterTitles as Record<string, string>;
const j = journeyData.journey as {
  id: string;
  title: string;
  chapter: { slug: string; title: string };
  chapterSection: string;
  scopeNote: string;
  nodes: {
    id: string;
    order: number;
    label: string;
    chapterText: string;
    explanation: string;
    alsoIn: { slug: string; note: string }[];
  }[];
  workedExample: { title: string; caveat: string; steps: string[] };
};
const framework = journeyData.framework as { rules: string[]; model: string };

export default function ExplorePage() {
  return (
    <>
      <p className="eyebrow">Preview 3 · WP8 · Release v1-consolidated-001</p>
      <h1>System Explorer</h1>
      <p className="lead">
        One complete end-to-end journey, built only from verified chapter
        material. The framework below it is reusable: a future journey is one
        JSON file, not new diagram code.
      </p>
      <section className="panel">
        <h2>{j.title}</h2>
        <p>
          Source chapter:{" "}
          <Link href={`/${j.chapter.slug}`}>{j.chapter.title}</Link>
          {" · "}Section: {j.chapterSection}. {j.scopeNote}
        </p>
        <NicJourney nodes={j.nodes.map((n) => ({ id: n.id, label: n.label }))} />
        <ol className="flow">
          {j.nodes.map((n) => (
            <li key={n.id} id={`node-${n.id}`} tabIndex={-1} className="step">
              <b>
                Step {n.order}: {n.label}
              </b>
              <p>
                <em>Chapter wording:</em> “{n.chapterText}”
              </p>
              <p>{n.explanation}</p>
              <p>
                Source: <Link href={`/${j.chapter.slug}`}>{j.chapter.title}</Link>
                {" · "}Section: {j.chapterSection}
              </p>
              {n.alsoIn.length > 0 && (
                <p>
                  Further reading:{" "}
                  {n.alsoIn.map((a) => (
                    <span key={a.slug}>
                      <Link href={`/${a.slug}`}>{TITLES[a.slug] ?? a.slug}</Link>
                      {" — "}
                      {a.note}{" "}
                    </span>
                  ))}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
      <section className="panel">
        <h2>{j.workedExample.title}</h2>
        <p>{j.workedExample.caveat}</p>
        <ol>
          {j.workedExample.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p>
          The chapter adds that the real stack is bidirectional and contains
          additional details such as ARP/neighbor discovery, MTU, offloads and
          retransmissions — those are not separate journey nodes here because
          the chapter&apos;s step flow does not list them as steps.
        </p>
      </section>
      <section className="panel">
        <h2>How the Explorer framework works</h2>
        <ul>
          {framework.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p>{framework.model}</p>
        <p>
          <strong>Not yet journeys:</strong> packet journeys in other chapters
          are linked as further reading above. They are not presented as
          completed Explorer journeys until a journey file is built and
          verified for them.
        </p>
      </section>
    </>
  );
}
