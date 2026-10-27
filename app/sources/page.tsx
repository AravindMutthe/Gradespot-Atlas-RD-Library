import type { Metadata } from "next";
import Link from "next/link";
import sourcesData from "@/lib/preview3/sources.json";

export const metadata: Metadata = {
  title: "Sources — Aravind Systems Atlas",
  description:
    "Sources for the Aravind Systems Atlas: original notebook scans, provenance labels, release manifest and research limitations.",
};

type Note = {
  file: string;
  caption: string;
  chapter: string;
  chapterTitle: string;
  sha256: string;
};
type Release = Record<string, string | number>;
const data = sourcesData as {
  release: Release;
  sampleNotes: Note[];
  provenanceLabels: { label: string; meaning: string }[];
  limitations: string[];
  shaHonesty: string;
};

export default function SourcesPage() {
  const rel = data.release;
  return (
    <>
      <p className="eyebrow">Preview 3 · WP7 · Release v1-consolidated-001</p>
      <h1>Sources</h1>
      <p className="lead">
        Original notebook scans, provenance labels, the release manifest and
        the limits of this research edition — in one place.
      </p>
      <section className="panel">
        <h2>Original notebook scans viewer</h2>
        <p>
          Seven sampled scans are shown here from the two chapters behind the
          System Explorer journey. The full set is 136 unique original-note
          images; every chapter page embeds its own scans, and the{" "}
          <Link href="/source-photographs">Source photographs chapter</Link>{" "}
          collects them. Images load lazily.
        </p>
        {data.sampleNotes.map((n) => (
          <figure key={n.file}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/assets/original-notes/${n.file}`}
              alt={n.caption}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              {n.caption} · Chapter:{" "}
              <Link href={`/${n.chapter}`}>{n.chapterTitle}</Link> · File:{" "}
              <code>{n.file}</code> · Recorded SHA-256:{" "}
              <code>{n.sha256.slice(0, 16)}…</code> (full value in the content
              manifest; see honesty note below).
            </figcaption>
          </figure>
        ))}
      </section>
      <section className="panel">
        <h2>Provenance and editorial-synthesis labels</h2>
        <ul>
          {data.provenanceLabels.map((x) => (
            <li key={x.label}>
              <strong>{x.label}.</strong> {x.meaning}
            </li>
          ))}
        </ul>
      </section>
      <section className="panel verify">
        <h2>SHA honesty note — read before citing a hash</h2>
        <p>{data.shaHonesty}</p>
      </section>
      <section className="panel">
        <h2>Release manifest (must match the master)</h2>
        <table>
          <tbody>
            {Object.entries(rel).map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>
                  <code>{String(v)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          The manifest file itself is served unchanged at{" "}
          <Link href="/release.json">/release.json</Link>.
        </p>
      </section>
      <section className="panel">
        <h2>Research limitations and verification status</h2>
        <ul>
          {data.limitations.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p>
          Private material is excluded by count only in this site. Nothing
          private is displayed merely because it exists in the archive.
        </p>
      </section>
    </>
  );
}
