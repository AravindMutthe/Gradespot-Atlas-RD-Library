import type { Metadata } from "next";
import Link from "next/link";
import {
  EXPLORER_VIEWS,
  NIC_EVIDENCE_BASELINE,
  type ExplorerView,
} from "@/lib/explorer-nic";
import styles from "./explorer.module.css";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  title: "System Explorer — Aravind Systems Atlas",
  description:
    "A teaching instrument for one journey: from silicon to a working NIC. Three views — System Setup, Follow an HTTPS Request, Troubleshoot — with typed relationships, reviewed example commands, and a mandatory limitations panel.",
  alternates: { canonical: `${BASE}/system-explorer/` },
};

const NIC_HREF = "/from-silicon-to-a-working-nic/";

function nodeLabel(view: ExplorerView, id: string): string {
  return view.nodes.find((n) => n.id === id)?.label ?? id;
}

function wrapLabel(label: string): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (t.length > 44 && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = t;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

// Static SVG overview. The ordered list below it is the authoritative
// content; the edge table lists every typed relationship. Connectors are
// drawn ONLY for typed edges — teaching order alone never draws an arrow.
function Diagram({ view }: { view: ExplorerView }) {
  const boxX = 150;
  const boxW = 340;
  const cx = 320;
  const boxH = 64;
  const gap = 40;
  const y = (i: number) => 10 + i * (boxH + gap);
  const yc = (i: number) => y(i) + boxH / 2;
  const height = 10 + view.nodes.length * (boxH + gap) - gap + 10;
  return (
    <figure className={styles.svgWrap}>
      <svg
        role="img"
        aria-label={`Diagram of the ${view.title} teaching sequence with typed relationships. The ordered list below is the full text alternative.`}
        viewBox={`0 0 640 ${height}`}
        width="100%"
      >
        <defs>
          <marker
            id={`arrow-${view.id}`}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="#12243A" />
          </marker>
        </defs>
        {view.nodes.map((n, i) => {
          const lines = wrapLabel(n.label);
          return (
            <g key={n.id}>
              <rect
                x={boxX}
                y={y(i)}
                width={boxW}
                height={boxH}
                rx={12}
                fill="#FFFFFF"
                stroke="#12243A"
                strokeWidth={1.5}
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={cx}
                  y={y(i) + (lines.length === 1 ? 38 : 27 + li * 20)}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={700}
                  fill="#12243A"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
        {view.edges.map((e, k) => {
          const si = view.nodes.findIndex((n) => n.id === e.from);
          const ti = view.nodes.findIndex((n) => n.id === e.to);
          if (si < 0 || ti < 0) return null;
          const midY = (yc(si) + yc(ti)) / 2;
          if (ti === si + 1) {
            return (
              <g key={k}>
                <line
                  x1={cx}
                  y1={y(si) + boxH}
                  x2={cx}
                  y2={y(ti)}
                  stroke="#12243A"
                  strokeWidth={1.5}
                  markerEnd={`url(#arrow-${view.id})`}
                />
                <text
                  x={cx + 12}
                  y={midY + 4}
                  fontSize={11}
                  fill="#087F83"
                  paintOrder="stroke"
                  stroke="#F7F8F6"
                  strokeWidth={3}
                >
                  {e.type}
                </text>
              </g>
            );
          }
          if (ti < si) {
            return (
              <g key={k}>
                <path
                  d={`M ${boxX} ${yc(si)} L 70 ${yc(si)} L 70 ${yc(ti)} L ${boxX} ${yc(ti)}`}
                  fill="none"
                  stroke="#12243A"
                  strokeWidth={1.5}
                  markerEnd={`url(#arrow-${view.id})`}
                />
                <text
                  x={70}
                  y={midY + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#087F83"
                  paintOrder="stroke"
                  stroke="#F7F8F6"
                  strokeWidth={3}
                >
                  {e.type}
                </text>
              </g>
            );
          }
          return (
            <g key={k}>
              <path
                d={`M ${boxX + boxW} ${yc(si)} L 570 ${yc(si)} L 570 ${yc(ti)} L ${boxX + boxW} ${yc(ti)}`}
                fill="none"
                stroke="#12243A"
                strokeWidth={1.5}
                markerEnd={`url(#arrow-${view.id})`}
              />
              <text
                x={575}
                y={midY + 4}
                textAnchor="middle"
                fontSize={11}
                fill="#087F83"
                paintOrder="stroke"
                stroke="#F7F8F6"
                strokeWidth={3}
              >
                {e.type}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        Teaching order with typed relationships. The ordered list below is
        the authoritative text alternative; the edge table lists every
        typed relationship.
      </figcaption>
    </figure>
  );
}

function ViewNav({ current }: { current?: string }) {
  return (
    <nav className={styles.viewNav} aria-label="Explorer views">
      {EXPLORER_VIEWS.map((v) => (
        <Link
          key={v.id}
          href={`#${v.id}`}
          aria-current={current === v.id ? "true" : undefined}
        >
          {v.title}
        </Link>
      ))}
      <Link href="#limitations">Limitations</Link>
    </nav>
  );
}

function PrevNext({ index }: { index: number }) {
  const prev = EXPLORER_VIEWS[index - 1];
  const next = EXPLORER_VIEWS[index + 1];
  return (
    <p className={styles.prevNext}>
      {prev ? (
        <Link href={`#${prev.id}`}>&larr; Previous view: {prev.title}</Link>
      ) : (
        <span />
      )}{" "}
      {next ? (
        <Link href={`#${next.id}`}>Next view: {next.title} &rarr;</Link>
      ) : (
        <Link href="#limitations">Back to the limitations panel &uarr;</Link>
      )}
    </p>
  );
}

export default function SystemExplorerPage() {
  return (
    <>
      <p className="eyebrow">System Explorer · Release v1-consolidated-001</p>
      <h1>System Explorer</h1>
      <p className="lead">
        A teaching instrument for one journey: from silicon to a working
        NIC. Three views follow the same system from setup, through one
        HTTPS request, to diagnosis when something breaks.
      </p>
      <p>
        <strong>Teaching sequence, not verified notes.</strong> The steps
        below are shown in teaching order. They are not a literal packet
        path, not historical causation, and not verified original-note
        attribution. The source chapter is{" "}
        <Link href={NIC_HREF}>From silicon to a working NIC</Link>; the
        Explorer quotes its concepts and links to it — it does not
        duplicate the chapter body.
      </p>
      <p>
        <strong>No JavaScript needed.</strong> Every view is a full
        ordered list below its diagram, reachable by keyboard and by the
        view links. Diagrams are visual overviews only, never the sole
        way to access the information.
      </p>

      <ViewNav />

      <section className="panel" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading">Evidence tiers — what each label means</h2>
        <div className={styles.tierGrid}>
          <div className="card">
            <h3>Technical explanation</h3>
            <p>
              A technically reviewed explanation of a mechanism. Node
              mechanisms and example commands on this page carry this
              tier: each command was reviewed for correctness and safety
              before publication.
            </p>
          </div>
          <div className="card">
            <h3>Illustrative teaching model</h3>
            <p>
              The ordering and diagrams themselves. They teach how the
              parts relate; they are not a literal execution path, not a
              packet trace, and not historical causation.
            </p>
          </div>
          <div className="card">
            <h3>Supported by original note</h3>
            <p>
              Verified paragraph attribution only.{" "}
              <strong>
                No Explorer claim currently carries this tier.
              </strong>{" "}
              Technical correctness does not establish original-note
              provenance.
            </p>
          </div>
        </div>
        <p>
          <strong>NIC evidence baseline (visible, exact): </strong>
          {NIC_EVIDENCE_BASELINE.verified} verified /{" "}
          {NIC_EVIDENCE_BASELINE.candidateHypotheses} title-based
          candidate hypotheses / {NIC_EVIDENCE_BASELINE.unassessed}{" "}
          unassessed, across the NIC chapter&apos;s 31 paragraphs. The
          five candidates are hypotheses for transcription-based
          confirmation, not findings. Chapter links on this page are
          chapter-level associations, never paragraph verification. In
          Explorer copy, &ldquo;verified&rdquo; means chapter-membership
          verification unless it explicitly says paragraph verification —
          and paragraph verification does not exist for the NIC chapter
          today.
        </p>
      </section>

      <section
        className="panel verify"
        id="limitations"
        aria-labelledby="limitations-heading"
      >
        <h2 id="limitations-heading">Limitations — read before trusting a step</h2>
        <ul>
          <li>
            <strong>Init-time mixed with per-request.</strong> System
            Setup steps (discovery, driver binding) happen once at
            startup; HTTPS Request steps happen per request. The two
            kinds are never the same kind of step.
          </li>
          <li>
            <strong>Teaching order, not a packet path.</strong> Arrows
            describe a teaching sequence, not necessarily historical
            causation or a literal execution path. The real stack is
            bidirectional, with retransmissions, MTU handling, offloads,
            and queueing.
          </li>
          <li>
            <strong>DNS is not performed by the NIC.</strong> Name
            resolution is an OS and resolver job; the NIC moves frames.
          </li>
          <li>
            <strong>Conditional paths stay conditional.</strong> ARP is
            IPv4-only and Neighbor Discovery is IPv6-only; HTTPS over
            TCP and HTTP/3 over QUIC are alternative paths, never both
            for one request; cached answers skip resolution and neighbor
            discovery entirely.
          </li>
          <li>
            <strong>Commands are educational examples.</strong> Every
            command on this page was technically reviewed, but outputs
            vary by distribution, kernel, and privileges. All commands
            are read-only except ping (which sends ICMP echo requests)
            and curl (which performs a real HTTPS request). Replace
            placeholders such as <code>&lt;iface&gt;</code> with your
            own values, and never run a command you do not understand.
          </li>
          <li>
            <strong>No original-note provenance.</strong> Nothing on
            this page is presented as verified by the original
            handwritten notes (0 verified / 5 candidates / 26
            unassessed). No note photographs are embedded here.
          </li>
          <li>
            <strong>What this Explorer is not.</strong> Not a general
            graph of all 57 chapters, not an AI tutor, not an executable
            lab, and not a simulator.
          </li>
        </ul>
      </section>

      {EXPLORER_VIEWS.map((view, vi) => (
        <section key={view.id} id={view.id} aria-labelledby={`${view.id}-heading`}>
          <h2 id={`${view.id}-heading`}>
            {vi + 1}. {view.title}
          </h2>
          <p className="lead">{view.intro}</p>
          {view.conditionalNote ? <p>{view.conditionalNote}</p> : null}
          <Diagram view={view} />
          <ol>
            {view.nodes.map((node) => (
              <li key={node.id} className="step">
                <h3>{node.label}</h3>
                <p>
                  <strong>Purpose: </strong>
                  {node.purpose}
                </p>
                <p>{node.whatHappens}</p>
                {node.inspect ? (
                  <div className={styles.cmdBlock}>
                    <p>
                      <strong>Observe: </strong>
                      <code>{node.inspect.command}</code>
                    </p>
                    <p>
                      <strong>Expected: </strong>
                      {node.inspect.expected}
                    </p>
                    <p>
                      <strong>Safety: </strong>
                      {node.inspect.safety}
                    </p>
                  </div>
                ) : null}
                <p>
                  <strong>Limitation: </strong>
                  {node.limitation}
                </p>
                <p>
                  <strong>Related chapter: </strong>
                  {node.relatedChapters.map((c, ci) => (
                    <span key={c.slug}>
                      {ci > 0 ? "; " : null}
                      <Link href={`/${c.slug}/`}>{c.title}</Link>
                    </span>
                  ))}{" "}
                  (chapter-level association, not paragraph verification)
                </p>
              </li>
            ))}
          </ol>
          <h3>Typed relationships in this view</h3>
          <p>
            Every arrow above appears here with its type. A relationship
            labelled &ldquo;related&rdquo; is a weaker, non-causal
            association — never causation.
          </p>
          <table className={styles.edgeTable}>
            <thead>
              <tr>
                <th scope="col">From</th>
                <th scope="col">Relationship</th>
                <th scope="col">To</th>
                <th scope="col">Note</th>
              </tr>
            </thead>
            <tbody>
              {view.edges.map((e, ei) => (
                <tr key={ei}>
                  <td>{nodeLabel(view, e.from)}</td>
                  <td>
                    <strong>{e.type}</strong>
                  </td>
                  <td>{nodeLabel(view, e.to)}</td>
                  <td>{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <PrevNext index={vi} />
        </section>
      ))}

      <section className="panel" aria-labelledby="scope-heading">
        <h2 id="scope-heading">Scope of this Explorer</h2>
        <p>
          This Explorer covers the existing NIC teaching model only: the
          five-step system view and the worked HTTPS example from{" "}
          <Link href={NIC_HREF}>From silicon to a working NIC</Link>,
          with supporting context from{" "}
          <Link href="/from-embedded-devices-to-nics-switches-and-cloud-systems/">
            From embedded devices to NICs, switches, and cloud systems
          </Link>
          . No unrelated systems or industries are added in this step.
          Future journeys, if any, are separate decisions.
        </p>
      </section>
    </>
  );
}
