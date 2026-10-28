import type { Metadata } from "next";
import Link from "next/link";
import { ATLAS_V2_CHAPTERS, ATLAS_V2_RELEASE } from "@/lib/atlas-v2/chapters";
import { ATLAS_V2_RELATED } from "@/lib/atlas-v2/related";
import { displayTitle } from "@/lib/atlas-v2/display-title";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  alternates: { canonical: `${BASE}/` },
};

// Journey-first homepage (proposal §1.1, blueprint §4.2 Composition A,
// D-01 delegated decision). Structure: decided lockup → journey rail →
// research introduction → featured NIC story in full (beat 02) → six
// teaching beats in sequence, each with integrated evidence → compact
// three-panel research desk → wider Library invitation → archive status.
// The journey is ONE curated pathway through a much larger collection,
// never the entire Atlas. Beat order is a CONCEPTUAL teaching order, not
// a historical timeline, and nothing here implies these technologies
// appeared in this sequence. Any beat is skippable or jumpable; the full
// 57-chapter Library is enterable at any point. NO progress bars,
// checkmarks, or completion indicators exist anywhere on this page: none
// of those features exist in initial scope. Beat diagrams are ORIGINAL
// educational redraws, never borrowed illustrations, never claimed as
// verbatim transcriptions of handwritten notes.

type Beat = { stage: string; slug: string; heading: string };
const BEATS: Beat[] = [
  { stage: "Origins", slug: "telegraph-telephone-and-electrical-networks", heading: "Signals and communication" },
  { stage: "Hardware", slug: "from-silicon-to-a-working-nic", heading: "Silicon and network interfaces" },
  { stage: "Networks", slug: "packet-switching-lans-and-internetworking", heading: "Frames, packets and switching" },
  { stage: "Systems", slug: "operating-systems-kernels-and-hypervisors", heading: "Operating systems and infrastructure" },
  { stage: "Systems", slug: "virtualization-cloud-and-software-defined-enterprise", heading: "Cloud and distributed systems" },
  { stage: "Impact", slug: "ai-infrastructure-power-and-the-digital-economy", heading: "Industry and AI infrastructure" },
];

// Journey rail stages (five stages across six beats; Systems covers beats
// 04 and 05, so the Systems rail link lands on beat 04 and beat 05 follows).
const RAIL: { stage: string; anchor: string }[] = [
  { stage: "Origins", anchor: "#beat-01" },
  { stage: "Hardware", anchor: "#beat-02" },
  { stage: "Networks", anchor: "#beat-03" },
  { stage: "Systems", anchor: "#beat-04" },
  { stage: "Impact", anchor: "#beat-06" },
];

type Chapter = (typeof ATLAS_V2_CHAPTERS)[number];

function chapterFor(slug: string): Chapter {
  const c = ATLAS_V2_CHAPTERS.find((x) => x.slug === slug);
  if (!c) throw new Error(`Journey beat chapter missing from baseline: ${slug}`);
  return c;
}

function firstParagraph(c: Chapter): string | null {
  for (const b of c.blocks) for (const p of b.paras) if (p.trim()) return p;
  return null;
}

// VERIFIED related links only: evidence "chapter-link" means the chapter's
// own list names the chapter. Derived relations (shared-concept,
// same-domain) are NOT shown here; Phase 2 labels them "discovery
// suggestions" in the Reader. At most two per beat, never invented.
function verifiedRelated(slug: string): { slug: string; title: string }[] {
  return (ATLAS_V2_RELATED[slug] ?? [])
    .filter((r) => r.evidence === "chapter-link")
    .map((r) => ATLAS_V2_CHAPTERS.find((c) => c.slug === r.slug))
    .filter((c): c is Chapter => c !== undefined)
    .slice(0, 2)
    .map((c) => ({ slug: c.slug, title: displayTitle(c.title) }));
}

// Original flow diagram: labelled boxes joined by arrows. One row per
// lane; each lane carries a caption. Text equivalents are the six diagram
// layers printed beneath every diagram (accessible without the SVG).
function FlowDiagram({ lanes, label }: { lanes: { caption: string; steps: string[] }[]; label: string }) {
  const boxW = 132;
  const gap = 26;
  const height = lanes.length * 74;
  return (
    <svg
      className="flow-diagram"
      viewBox={`0 0 640 ${height}`}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <desc>{lanes.map((l) => `${l.caption}: ${l.steps.join(" → ")}`).join(". ")}</desc>
      {lanes.map((lane, li) =>
        lane.steps.map((step, si) => {
          const x = 10 + si * (boxW + gap);
          const y = li * 74 + 8;
          const cx = x + boxW;
          const cy = y + 24;
          return (
            <g key={`${li}-${si}`}>
              <rect x={x} y={y} width={boxW} height={48} rx={12} />
              <text x={x + boxW / 2} y={y + 28} textAnchor="middle">
                {step}
              </text>
              {si < lane.steps.length - 1 ? (
                <g>
                  <line x1={cx + 2} y1={cy} x2={cx + gap - 4} y2={cy} />
                  <polygon points={`${cx + gap - 4},${cy} ${cx + gap - 12},${cy - 5} ${cx + gap - 12},${cy + 5}`} />
                </g>
              ) : null}
            </g>
          );
        }),
      )}
      {lanes.map((lane, li) => (
        <text key={`cap-${li}`} x={10} y={li * 74 + 68} className="lane-caption">
          {lane.caption}
        </text>
      ))}
    </svg>
  );
}

type Layers = { question: string; mechanism: string; sequence: string; example: string; limits: string };
const LAYERS: Record<string, { flow: { caption: string; steps: string[] }[]; layers: Layers }> = {
  "telegraph-telephone-and-electrical-networks": {
    flow: [{ caption: "Message path", steps: ["Compose", "Encode", "Transmit", "Decode"] }],
    layers: {
      question: "How did messages travel before the internet?",
      mechanism:
        "Electrical signals carried messages along wires: a sender encoded a message into signals, the wire carried them, and a receiver decoded them back into words.",
      sequence: "Compose → encode into signals → transmit along the line → receive → decode.",
      example:
        "A telegram: words become electrical pulses at one office and words again at the other.",
      limits:
        "This beat teaches the idea of signal communication, not the history of any single network. Early networks differed widely in signaling, switching, and reach.",
    },
  },
  "from-silicon-to-a-working-nic": {
    flow: [
      { caption: "Setup — happens once", steps: ["Discover", "Bind driver", "Configure"] },
      { caption: "Runtime — per packet", steps: ["Send", "Receive"] },
    ],
    layers: {
      question: "How does a computer join a network?",
      mechanism:
        "A network interface connects the machine to the medium. Setup — device discovery, driver binding, interface configuration — happens once; the runtime data path then moves packets per request. Setup and runtime are distinct steps, never merged.",
      sequence: "Discover the device → bind a driver → configure the interface → send and receive packets.",
      example:
        "Loading a web page over HTTPS: the request travels as packets through the interface, with TCP/TLS — or, for HTTP/3, QUIC over UDP.",
      limits:
        "DNS is not performed by the NIC. Steps mix init-time with per-request steps, and this beat keeps them labelled as such.",
    },
  },
  "packet-switching-lans-and-internetworking": {
    flow: [{ caption: "Packet journey", steps: ["Split", "Address", "Forward", "Reassemble"] }],
    layers: {
      question: "How do messages share a network?",
      mechanism:
        "Messages are split into packets that travel independently across switches and routers and are reassembled at the destination.",
      sequence: "Split → address each packet → forward hop by hop → reassemble in order.",
      example:
        "A file download: its packets may take different paths and still arrive as one file.",
      limits:
        "Packet diagrams are teaching sequences. Real forwarding depends on protocols, addressing, and congestion, none of which a single diagram fixes.",
    },
  },
  "operating-systems-kernels-and-hypervisors": {
    flow: [{ caption: "Request path", steps: ["Request", "System call", "Kernel", "Hardware"] }],
    layers: {
      question: "What stands between programs and hardware?",
      mechanism:
        "The operating system kernel mediates: programs request services through system calls, and the kernel schedules processes, manages memory, and talks to drivers.",
      sequence: "Program requests → system call → kernel decides → driver and hardware act → result returns.",
      example:
        "A web server receiving a request: the application runs in user space while sockets, the network stack, and the driver involve the kernel.",
      limits:
        "Boundaries vary: some drivers run in user space, and firmware and hypervisors have their own responsibilities. The OS does not literally manage everything.",
    },
  },
  "virtualization-cloud-and-software-defined-enterprise": {
    flow: [{ caption: "Sharing one host", steps: ["Host", "Hypervisor", "Workloads", "Services"] }],
    layers: {
      question: "How do many systems share few machines?",
      mechanism:
        "Virtualization inserts a layer between physical hardware and workloads: a hypervisor or container runtime shares hosts among isolated virtual machines or containers.",
      sequence: "Physical host → virtualization layer → isolated workloads → services.",
      example:
        "One host running several services, each isolated from the others, scaled by adding more workloads.",
      limits:
        "Isolation is a design property, not a guarantee. Performance, failure, and security behavior depend on the concrete platform.",
    },
  },
  "ai-infrastructure-power-and-the-digital-economy": {
    flow: [{ caption: "From facility to service", steps: ["Power", "Compute", "Models", "Services"] }],
    layers: {
      question: "What does AI infrastructure run on?",
      mechanism:
        "AI workloads run on large-scale infrastructure: power, cooling, accelerators, networks, and storage, operated as an industrial system with economic costs.",
      sequence: "Power and facilities → compute and networks → models and data → products and services.",
      example:
        "Training and serving a model consumes facility capacity as well as compute — the economics follow the infrastructure, not only the algorithm.",
      limits:
        "No figures are given here. This beat makes no claim about prices, capacity, energy use, or market size.",
    },
  },
};

function BeatDiagram({ slug }: { slug: string }) {
  const d = LAYERS[slug];
  if (!d) throw new Error(`Journey beat diagram missing: ${slug}`);
  return (
    <figure className="beat-diagram">
      <FlowDiagram lanes={d.flow} label={`Teaching diagram: ${d.layers.question}`} />
      <figcaption>
        <dl className="diagram-layers">
          <div><dt>Question</dt><dd>{d.layers.question}</dd></div>
          <div><dt>Mechanism</dt><dd>{d.layers.mechanism}</dd></div>
          <div><dt>Sequence</dt><dd>{d.layers.sequence}</dd></div>
          <div><dt>Worked example</dt><dd>{d.layers.example}</dd></div>
          <div><dt>Limits</dt><dd>{d.layers.limits}</dd></div>
        </dl>
      </figcaption>
    </figure>
  );
}

function SourceContext({ chapter }: { chapter: Chapter }) {
  return (
    <p className="source-context">
      Source context: canonical chapter{" "}
      <Link href={`/${chapter.slug}/`}>{displayTitle(chapter.title)}</Link> (/{chapter.slug}/).
      Beat-to-chapter association is a teaching selection; paragraph-level source mapping for
      this beat is not verified and not claimed.
    </p>
  );
}

function ChapterBody({ chapter }: { chapter: Chapter }) {
  return (
    <>
      {chapter.blocks.map((b, i) => (
        <div key={i}>
          {b.h2 ? <h3>{b.h2}</h3> : null}
          {b.paras.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
          {b.lists.map((list, k) => (
            <ul key={k}>
              {list.map((item, m) => (
                <li key={m}>{item}</li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </>
  );
}

export default function Home() {
  const beatChapters = BEATS.map((b) => chapterFor(b.slug));
  const nic = chapterFor("from-silicon-to-a-working-nic");
  const totalDiagrams = ATLAS_V2_CHAPTERS.reduce((n, c) => n + c.diagrams.length, 0);
  const chaptersWithDiagrams = ATLAS_V2_CHAPTERS.filter((c) => c.diagrams.length > 0).length;
  const historyChapters = ATLAS_V2_CHAPTERS.filter((c) => c.sourceDomain === "systems-evolution").length;
  const totalTables = ATLAS_V2_CHAPTERS.reduce((n, c) => n + c.tables.length, 0);

  return (
    <>
      {/* Decided hero lockup (blueprint §4.1, proposal §1.1): H1 is the Atlas
          name only; the positioning line directly beneath is the decided
          positioning string as real HTML text, never baked into an image;
          the supporting sentence is DRAFT copy and is labelled as such. */}
      <p className="eyebrow">Cross-industry technology and economic knowledge</p>
      <h1 className="hero-h1">Aravind Systems Atlas</h1>
      <p className="positioning">
        Aravind Systems Atlas — Professional Cross-Industry Technology and Economic Knowledge Hub
      </p>
      <p className="description">
        Explore how computing systems, infrastructure, businesses and industries connect across the
        global digital economy.
        <span className="draft-note">Draft wording</span>
      </p>
      <div className="hero-actions">
        <Link className="btn" href="#journey">
          Explore Knowledge
        </Link>
        <Link className="btn-secondary" href="/library">
          Browse Library
        </Link>
      </div>

      {/* Discovery section (topic, industry, economy, learning paths): the
          four dimensions are discovery dimensions, not four routes. Cards
          link to the four real discovery surfaces; the Library card states
          plainly that topics, industries, and the economy are explored
          through the Library's grouping. No card links to a removed route. */}
      <h2>Discover the Atlas</h2>
      <div className="grid">
        <Link href="/library" className="card">
          <h3>Browse the Library</h3>
          <p>Topics, industries, and the economy — explored through the Library&apos;s grouping.</p>
        </Link>
        <Link href="/learning-paths" className="card">
          <h3>Follow a learning path</h3>
          <p>Structured cross-domain journeys through real chapters.</p>
        </Link>
        <Link href="/system-explorer" className="card">
          <h3>Trace a system</h3>
          <p>The System Explorer: setup, request, and troubleshooting views.</p>
        </Link>
        <Link href="/diagrams" className="card">
          <h3>Study the diagrams</h3>
          <p>Visual knowledge across the collection, chapter by chapter.</p>
        </Link>
      </div>

      {/* Journey rail: the LOCAL learning navigator (not the global menu).
          Five stages across six beats; Systems lands on beat 04 and beat 05
          follows. Active section is highlighted via :target (no client JS). */}
      <nav className="journey-rail" aria-label="Journey" id="journey">
        {RAIL.map((r) => (
          <a key={r.stage} href={r.anchor}>
            {r.stage}
          </a>
        ))}
      </nav>

      <section aria-labelledby="journey-intro-title">
        <h2 id="journey-intro-title">The journey</h2>
        <p className="lead">
          One curated pathway through a much larger collection. The six beats below follow a
          conceptual teaching order — not a historical timeline, and not the order in which these
          technologies appeared. Any beat is skippable or jumpable, and the full{" "}
          {ATLAS_V2_CHAPTERS.length}-chapter Library is open at any point. Each beat names its
          canonical chapter outside any disclosure; evidence links shown are verified links only
          (named by the chapter&apos;s own list), at most two per beat.
        </p>
      </section>

      {BEATS.map((beat, i) => {
        const chapter = beatChapters[i];
        const featured = beat.slug === "from-silicon-to-a-working-nic";
        const excerpt = featured ? null : firstParagraph(chapter);
        const related = verifiedRelated(beat.slug);
        return (
          <section
            className="beat"
            id={`beat-0${i + 1}`}
            aria-labelledby={`beat-0${i + 1}-title`}
            key={beat.slug}
          >
            <p className="eyebrow">
              Beat 0{i + 1} · {beat.stage}
            </p>
            <h2 id={`beat-0${i + 1}-title`}>{beat.heading}</h2>
            <p className="beat-chapter">
              Canonical chapter:{" "}
              <Link href={`/${chapter.slug}/`}>{displayTitle(chapter.title)}</Link> (/
              {chapter.slug}/)
            </p>
            <BeatDiagram slug={beat.slug} />
            {featured ? (
              <>
                <h3>The chapter in full</h3>
                <p>
                  The featured study below reproduces the beat-02 chapter body in full, by design
                  (proposal §1.1: the lead study, not a teaser card). The chapter&apos;s canonical
                  page remains its home.
                </p>
                <ChapterBody chapter={nic} />
              </>
            ) : excerpt ? (
              <p className="beat-excerpt">
                <span className="tag">Excerpt from the chapter — </span>
                {excerpt}
              </p>
            ) : null}
            {related.length > 0 ? (
              <div className="beat-related">
                <span className="tag">Verified related — </span>
                {related.map((r, ri) => (
                  <span key={r.slug}>
                    {ri > 0 ? " · " : ""}
                    <Link href={`/${r.slug}/`}>{r.title}</Link>
                  </span>
                ))}
              </div>
            ) : null}
            <details className="beat-research">
              <summary>Research notes</summary>
              <p>
                Chapter sources: {chapter.sources.join("; ")} · {chapter.paragraphCount} paragraphs
                · {chapter.tables.length} tables · {chapter.diagrams.length} diagrams · release{" "}
                {ATLAS_V2_RELEASE.contentRelease}.
              </p>
              <SourceContext chapter={chapter} />
            </details>
            <p>
              <Link href={`/${chapter.slug}/`}>
                Read this chapter on its canonical page →
              </Link>
            </p>
          </section>
        );
      })}

      {/* Compact three-panel research desk: the desk SUPPORTS the journey;
          it is not a second homepage stacked beneath it. */}
      <section aria-labelledby="desk-title">
        <h2 id="desk-title">Research desk</h2>
        <div className="desk-grid">
          <div className="panel">
            <h3>Timelines — contextual evidence</h3>
            <p>
              Timelines show contextual evidence with documented dates only. No dated timeline
              entries are published in initial v2.0 scope — dated entries require owner-approved
              dated sources. Historical material is presented in chapter order, not as a dated
              sequence.
            </p>
            <p>
              <Link href="/timelines">Timelines index</Link> · {historyChapters} Systems Evolution
              chapters in chapter order.
            </p>
          </div>
          <div className="panel">
            <h3>Visual knowledge — diagram companion</h3>
            <p>
              Diagrams explain mechanisms and reference their canonical chapters; they are not a
              decorative gallery. Diagram text lives in the chapter.
            </p>
            <p>
              <Link href="/diagrams">Diagrams index</Link> · {totalDiagrams} diagrams across{" "}
              {chaptersWithDiagrams} chapters.
            </p>
          </div>
          <div className="panel">
            <h3>Notes previews — archive status</h3>
            <p>
              Original notes are referenced, not yet published here. No note images are reproduced
              in this build, and no held material appears in any form.
            </p>
            <p>
              <a href="#archive-status">Archive status below</a> · {ATLAS_V2_CHAPTERS.length}{" "}
              chapters, release {ATLAS_V2_RELEASE.contentRelease}.
            </p>
          </div>
        </div>
        <p>
          Your workspace — section bookmarks and reading progress, saved only in this
          browser, no account needed: <Link href="/workspace">Open your workspace</Link>.
        </p>
      </section>

      <section aria-labelledby="library-invite-title">
        <h2 id="library-invite-title">Wider Library</h2>
        <p className="lead">
          The journey is one pathway. The full collection — all {ATLAS_V2_CHAPTERS.length}{" "}
          chapters, {totalDiagrams} diagrams, {totalTables} tables — is open from here.
        </p>
        <div className="hero-actions">
          <Link className="btn" href="/library">
            Browse Library
          </Link>
          <Link className="btn-secondary" href="/learning-paths">
            Learning Paths
          </Link>
          <Link className="btn-secondary" href="/system-explorer">
            System Explorer
          </Link>
        </div>
      </section>

      <section className="archive-status" id="archive-status" aria-labelledby="archive-status-title">
        <h2 id="archive-status-title">Archive status</h2>
        <p>
          {ATLAS_V2_CHAPTERS.length} chapters · release {ATLAS_V2_RELEASE.contentRelease} · version{" "}
          {ATLAS_V2_RELEASE.version} · 136 unique images · {totalDiagrams} diagrams · {totalTables}{" "}
          tables.
        </p>
        <p>
          Original notes are referenced, not yet published here: no scans are reproduced in this
          build. Recovered historical exports are partial reconstructions, not verbatim
          transcripts. Nothing here is presented as a certification that every prior conversation
          was recovered verbatim.
        </p>
        <p>
          Library grouping is labelled configurable / pending reconciliation — this build commits
          to neither five nor seven domains. No dated timeline entries are published in initial
          v2.0 scope.
        </p>
      </section>

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
