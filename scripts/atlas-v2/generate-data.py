#!/usr/bin/env python3
"""Generate Atlas V2 (Preview 2) data from the consolidated content master.

READ-ONLY input: a local copy of the phone content repo (~/atlas-content on the
phone; never written to by this script). Default --content-dir points at the
local working copy used for this preview; pass the path explicitly on re-run.

Outputs (website repo only):
  lib/atlas-v2/chapters.ts   — full chapter bodies (blocks, tables, diagrams,
                               illustrations, original-note filenames)
  lib/atlas-v2/domains.ts    — PROPOSED seven-domain mapping (pending owner
                               approval) + per-chapter reason + source domain
  lib/atlas-v2/related.ts    — related-chapter links, labelled by evidence
  public/atlas-v2/search-index.json — build-time full-text index (WP5)
  docs/atlas-v2-library-reader-search.md — mapping table + procedures
                               (mapping section is rewritten by this script)

Rules enforced here (never invent metadata):
  * Slugs/URLs are copied verbatim from the master; domain is grouping only.
  * Missing fields render as missing in the UI, never guessed.
  * Related links come only from (a) the chapter's own related_concepts,
    (b) concepts shared by 2+ chapters in concepts.json, or (c) same
    proposed-domain membership — each labelled with its evidence in related.ts.
  * Original-note SHAs are NOT emitted into the UI bundle: the task record
    states stored SHAs do not match stored files (0/136), so displaying a SHA
    would imply a verification that does not exist. Filenames are the link key.
"""
import argparse, glob, json, os, re, sys
from collections import Counter, defaultdict

# slug -> (proposed domain, reason, flagged?)
PROPOSED = {}
def m(slug, domain, reason, flagged=False):
    PROPOSED[slug] = (domain, reason, flagged)

HW = "Computing and Hardware"
for s in ["15-computing-memory-power-and-interface-silicon",
          "computing-power-and-interface-silicon",
          "from-electric-signals-to-functional-silicon",
          "from-embedded-devices-to-nics-switches-and-cloud-systems",
          "from-silicon-to-a-working-nic",
          "handwritten-semiconductor-notes-detailed-reading-and-technical-connections",
          "memory-from-physical-cells-to-processes-numa-and-durable-data",
          "memory-hierarchy-storage-and-motherboard-controllers",
          "processing-engines-instruction-sets-and-configurable-logic",
          "semiconductor-devices-and-interface-circuits"]:
    m(s, HW, "Hardware/computing subject; source domain maps 1:1.")
m("electronic-digital-computers-and-operating-systems", HW,
  "Subject is computers and operating systems, not networks; source domain was infrastructure-operations.", True)

NI = "Networks and Infrastructure"
for s in ["22-from-telegraph-era-controls-to-ai-era-networks-standards-and-schedules",
          "23-artifact-repositories-hardware-buses-firmware-and-programming-paradigms",
          "address-spaces-and-storage-abstraction",
          "address-spaces-storage-abstraction-virtualization-os-functions",
          "artifact-delivery-vm-oci-storage-network-boundaries",
          "distributed-communication-and-network-segmentation",
          "distributed-computing-communication-patterns-network-segmentation",
          "from-pre-web-networks-to-web-1-0-web-2-0-and-the-ai-web",
          "interfaces-linux-datapaths-and-physical-to-virtual-infrastructure",
          "linux-identity-data-states-kernel-boundaries-sterling-deployment",
          "operating-systems-kernel-boundaries-hypervisor-architecture",
          "operating-systems-kernels-and-hypervisors",
          "packet-switching-lans-and-internetworking",
          "physical-networks-kubernetes-networking-and-enterprise-traffic-paths",
          "public-internet-mobile-networks-and-global-reach",
          "telegraph-telephone-and-electrical-networks",
          "virtualization-cloud-and-software-defined-enterprise"]:
    m(s, NI, "Network/infrastructure subject; source domain maps 1:1 in substance.")
m("vm-deployment-artifactory-oci-hardware-buses", NI,
  "Deployment/infrastructure tooling; grouped under infrastructure.", True)

EH = "Evolution and History"
for s in ["18-computer-architecture-instruction-sets-to-distributed-systems",
          "19-built-in-architecture-runtime-tuning-and-deliberate-distributed-design",
          "20-processes-execution-models-backup-and-archives",
          "21-conversations-and-projects-recovered-knowledge-map",
          "from-human-communication-to-interconnected-digital-systems",
          "radio-electronic-switching-and-data-processing",
          "the-evolution-of-human-computer-interfaces"]:
    m(s, EH, "Era-spanning/evolution subject; source domain maps 1:1 in substance.")
m("systems-knowledge-map-and-practical-applications", EH,
  "Knowledge-map chapter; evolution grouping is the closest fit.", True)
m("source-photographs", EH,
  "Archive of source scans across eras; grouped by era-spanning material.", True)
m("communication-trade-the-first-networks", EH,
  "Historical origins of networks; subject is history, not current markets.", True)
m("pre-electrical-networks-and-institutional-coordination", EH,
  "Pre-electrical era subject; history grouping fits the content.", True)
m("from-electrical-communication-to-the-ai-infrastructure-economy", EH,
  "Era-spanning narrative (electrical era to AI era).", True)
m("from-merchant-correspondence-to-ai-platforms-technology-infrastructure-and-business-by-era", EH,
  "Explicitly organised by era.", True)

BO = "Business and Organizations"
m("from-governance-and-business-models-to-working-technical-systems", BO,
  "Governance/business-model subject.")
m("institutions-standards-global-supply-chains", BO,
  "Institutions/standards/governance subject.")
m("technology-leadership-business-models", BO,
  "Leadership/business-model subject.")
m("vertical-horizontal-and-platform-integration-across-technology-eras", BO,
  "Integration strategy subject (organisational strategy).", True)
m("scheduling-resources-and-operational-systems", BO,
  "Operational scheduling/management subject, not a network subject; source domain was infrastructure-operations.", True)

EM = "Economics and Markets"
m("market-structures-integration-consolidation-and-the-distribution-of-control", EM,
  "Market-structure/consolidation subject.")
m("ai-infrastructure-power-and-the-digital-economy", EM,
  "Digital-economy/power subject.", True)
m("global-digital-delivery-networks-operators-platforms-and-revenue", EM,
  "Operators/platforms/revenue subject.", True)
m("the-global-digital-industry-stack-ownership-architecture-and-revenue", EM,
  "Ownership/revenue subject.", True)

IS = "Industries and Sectors"
m("the-global-digital-industry-stack-india-united-states-europe-and-china", IS,
  "Industry stack by country/region.")
m("industrial-evolution-from-merchant-networks-to-ai-ecosystems", IS,
  "Industrial-evolution subject; also historical, hence flagged.", True)

ER = "Ecosystems and Relationships"
m("how-shared-technology-became-proprietary-ecosystems", ER,
  "Shared-to-proprietary ecosystem subject.")
m("shared-foundations-open-source-and-the-construction-of-private-ecosystems", ER,
  "Ecosystem-construction subject.")
m("open-source-contributors-institutions-and-the-software-supply-chain", ER,
  "Participant/contributor ecosystem subject.", True)
m("public-infrastructure-private-ecosystems-and-the-changing-geography-of-control", ER,
  "Public/private ecosystem subject.", True)

DOMAINS = [HW, NI, EH, IS, BO, EM, ER]

def ts_str(s):
    return json.dumps(s, ensure_ascii=False)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--content-dir", required=True)
    ap.add_argument("--repo", required=True)
    a = ap.parse_args()
    manifest = json.load(open(os.path.join(a.content_dir, "manifests/chapters.json")))
    concepts = json.load(open(os.path.join(a.content_dir, "concepts/concepts.json")))
    chapters = {}
    for p in glob.glob(os.path.join(a.content_dir, "chapters/*/*.json")):
        d = json.load(open(p))
        chapters[d["slug"]] = d
    assert len(chapters) == 57, len(chapters)
    assert set(chapters) == {c["slug"] for c in manifest}, "manifest/chapter slug mismatch"
    missing = [s for s in chapters if s not in PROPOSED]
    assert not missing, f"unmapped chapters: {missing}"
    # related evidence
    by_slug = {c["slug"]: c for c in manifest}
    shared = defaultdict(Counter)
    shared_names = defaultdict(dict)
    for c in concepts:
        chs = c["chapters"]
        for x in chs:
            for y in chs:
                if x != y:
                    shared[x][y] += 1
                    shared_names[x].setdefault(y, []).append(c["name"])
    related = {}
    for slug, d in chapters.items():
        explicit = [s for s in d.get("related_concepts", []) if s in chapters]
        entries = []
        for s in explicit:
            entries.append({"slug": s, "evidence": "chapter-link",
                            "detail": "Listed in this chapter's own related chapters."})
        seen = {s for s, _ in [(e["slug"], 0) for e in entries]}
        for s, n in shared[slug].most_common():
            if s in seen:
                continue
            seen.add(s)
            entries.append({"slug": s, "evidence": "shared-concept",
                            "detail": f"Shares {n} verified concept(s): " + "; ".join(shared_names[slug][s][:3])})
        prop = PROPOSED[slug][0]
        same = [c["slug"] for c in manifest if c["slug"] != slug and PROPOSED[c["slug"]][0] == prop]
        for s in same:
            if s not in seen:
                seen.add(s)
                entries.append({"slug": s, "evidence": "same-domain",
                                "detail": f"Also in the proposed domain “{prop}” (grouping only, not an editorial link)."})
        related[slug] = entries
        assert entries, f"no related links for {slug}"
    # chapters.ts
    lines = []
    lines.append("/* Generated by scripts/atlas-v2/generate-data.py from the consolidated")
    lines.append("   content master (release v1-consolidated-001). Do not hand-edit: re-run")
    lines.append("   the generator. Slugs are verbatim master slugs; domains live in domains.ts. */")
    lines.append("export interface AtlasV2Block { h2: string; paras: string[]; lists: string[][]; }")
    lines.append("export interface AtlasV2Table { h2: string; rows: string[][]; source: string; }")
    lines.append("export interface AtlasV2Diagram { h2: string; text: string; source: string; }")
    lines.append("export interface AtlasV2Chapter { slug: string; title: string; sourceDomain: string;")
    lines.append("  sources: string[]; paragraphCount: number; imageCount: number;")
    lines.append("  blocks: AtlasV2Block[]; tables: AtlasV2Table[]; diagrams: AtlasV2Diagram[];")
    lines.append("  illustrations: string[]; originalNotes: string[]; }")
    lines.append("export const ATLAS_V2_RELEASE = { contentRelease: \"v1-consolidated-001\", version: \"1.0.0-continuing\", contentSha256: \"970489efd3899d29\" };")
    lines.append("export const ATLAS_V2_CHAPTERS: AtlasV2Chapter[] = [")
    for c in manifest:  # manifest order = canonical order
        d = chapters[c["slug"]]
        ch = {"slug": d["slug"], "title": d["title"], "sourceDomain": d["domain"],
              "sources": d.get("sources", []), "paragraphCount": d.get("paragraph_count", c["paragraphs"]),
              "imageCount": d.get("image_count", c["images"]),
              "blocks": [{"h2": b.get("h2", ""), "paras": b.get("paras", []), "lists": b.get("lists", [])} for b in d["blocks"]],
              "tables": [{"h2": t.get("h2", ""), "rows": t.get("rows", []), "source": t.get("source", "")} for t in d.get("tables", [])],
              "diagrams": [{"h2": g.get("h2", ""), "text": g.get("text", ""), "source": g.get("source", "")} for g in d.get("diagrams", [])],
              "illustrations": d.get("illustrations", []),
              "originalNotes": [n.get("file", "") for n in d.get("original_notes", []) if n.get("file")]}
        lines.append("  " + ts_str(ch) + ",")
    lines.append("];")
    lines.append("export const ATLAS_V2_BY_SLUG: Record<string, AtlasV2Chapter> = Object.fromEntries(ATLAS_V2_CHAPTERS.map((c) => [c.slug, c]));")
    os.makedirs(os.path.join(a.repo, "lib/atlas-v2"), exist_ok=True)
    open(os.path.join(a.repo, "lib/atlas-v2/chapters.ts"), "w").write("\n".join(lines) + "\n")
    # domains.ts
    dl = ["/* PROPOSED seven-domain grouping — pending owner approval. Migration is NOT",
          "   final until the owner approves. Domain is grouping/filtering only; it is",
          "   never a URL segment and never changes a slug. Source domain is preserved. */",
          "export const ATLAS_V2_DOMAINS = " + ts_str(DOMAINS) + ";",
          "export interface AtlasV2DomainMapping { slug: string; sourceDomain: string; proposedDomain: string; reason: string; flagged: boolean; }",
          "export const ATLAS_V2_DOMAIN_MAP: AtlasV2DomainMapping[] = ["]
    for c in manifest:
        dom, reason, flagged = PROPOSED[c["slug"]]
        dl.append("  " + ts_str({"slug": c["slug"], "sourceDomain": c["domain"], "proposedDomain": dom, "reason": reason, "flagged": flagged}) + ",")
    dl.append("];")
    dl.append("export const ATLAS_V2_DOMAIN_OF: Record<string, string> = Object.fromEntries(ATLAS_V2_DOMAIN_MAP.map((m) => [m.slug, m.proposedDomain]));")
    open(os.path.join(a.repo, "lib/atlas-v2/domains.ts"), "w").write("\n".join(dl) + "\n")
    # related.ts
    rl = ["/* Related-chapter links, each labelled with its evidence. Nothing here is an",
          "   invented editorial claim: 'chapter-link' = the chapter's own list;",
          "   'shared-concept' = concepts.json lists both chapters under one concept;",
          "   'same-domain' = same PROPOSED domain grouping only. */",
          "export interface AtlasV2Related { slug: string; evidence: string; detail: string; }",
          "export const ATLAS_V2_RELATED: Record<string, AtlasV2Related[]> = {"]
    for slug in [c["slug"] for c in manifest]:
        rl.append("  " + ts_str(slug) + ": " + ts_str(related[slug]) + ",")
    rl.append("};")
    open(os.path.join(a.repo, "lib/atlas-v2/related.ts"), "w").write("\n".join(rl) + "\n")
    # search index
    idx = []
    for c in manifest:
        d = chapters[c["slug"]]
        headings = [b["h2"] for b in d["blocks"] if b.get("h2")]
        body = []
        for b in d["blocks"]:
            body.extend(b.get("paras", []))
            for lst in b.get("lists", []):
                body.extend(lst)
        for t in d.get("tables", []):
            for row in t.get("rows", []):
                body.extend(row)
        for g in d.get("diagrams", []):
            body.append(g.get("text", ""))
        idx.append({"slug": d["slug"], "title": d["title"], "sourceDomain": d["domain"],
                    "proposedDomain": PROPOSED[d["slug"]][0], "headings": headings,
                    "text": "\n".join(body)})
    os.makedirs(os.path.join(a.repo, "public/atlas-v2"), exist_ok=True)
    open(os.path.join(a.repo, "public/atlas-v2/search-index.json"), "w").write(json.dumps(
        {"contentRelease": "v1-consolidated-001", "version": "1.0.0-continuing",
         "generatedFrom": "consolidated content master chapters + concepts.json", "chapters": idx},
        ensure_ascii=False))
    # docs mapping table
    counts = Counter(PROPOSED[s][0] for s in PROPOSED)
    doc = []
    doc.append("# Atlas V2 — Library, Reader, Search (Preview 2, WP3–WP5)\n")
    doc.append("Branch: `feat/atlas-platform-v2`. Release: v1-consolidated-001, version 1.0.0-continuing, content SHA 970489efd3899d29.\n")
    doc.append("## Proposed seven-domain mapping — PENDING OWNER APPROVAL (migration NOT final)\n")
    doc.append("Domain is grouping/filtering only, never a URL segment. Every existing slug/URL is unchanged. Flagged rows need owner review before any migration decision.\n")
    for dom in DOMAINS:
        doc.append(f"\n### {dom} ({counts[dom]} chapters)\n")
        for c in manifest:
            if PROPOSED[c["slug"]][0] == dom:
                _, reason, flagged = PROPOSED[c["slug"]]
                doc.append(f"- `{c['slug']}` — source `{c['domain']}` — {reason}{' **FLAGGED for review.**' if flagged else ''}")
    doc.append("\n## Indexing + content-update procedure (WP5)\n")
    doc.append("1. Content changes happen ONLY in the content repo (never in this website branch) and get a new tagged release.\n")
    doc.append("2. Copy the new release's chapters/manifests/concepts (read-only) to a local working copy.\n")
    doc.append("3. Run: `python3 scripts/atlas-v2/generate-data.py --content-dir <copy> --repo .` — this regenerates `lib/atlas-v2/chapters.ts`, `domains.ts`, `related.ts`, `public/atlas-v2/search-index.json`, and this mapping section.\n")
    doc.append("4. Re-run the checks in `scripts/atlas-v2/checks.py` (chapter count = 57, link check, search queries) and rebuild.\n")
    doc.append("5. Deploy to STAGING ONLY via `vercel-file-deploy-staging.py`; never the production uploader; production stays unchanged until owner tap.\n")
    doc.append("\n## Original notes + provenance (honesty labels)\n")
    doc.append("- Sources lines are copied verbatim from the master (e.g. “V1 Research Edition”, “Industry Evolution Edition”).\n")
    doc.append("- Paragraphs labelled “From the original pages” paraphrase handwritten sources; “Technical expansion and corrections” is editorial explanation, not manuscript text. Those labels are preserved in the reader.\n")
    doc.append("- Original-note files are linked BY FILENAME. SHA verification is NEVER claimed: the recorded master SHAs are known not to match the stored files (0/136), so no SHA is displayed as proof. The filename is the working link key.\n")
    doc.append("- Images are local build assets (`/atlas-images/<filename>`, copied at build time from the verified staging asset set, 136 files); lazy-loaded; never hotlinked.\n")
    doc.append("\n## Search (WP5)\n")
    doc.append("- Build-time static index (`public/atlas-v2/search-index.json`): titles, headings, concepts (via chapter text), and full body text (paragraphs, lists, table cells, diagram text). No vector DB, zero budget.\n")
    doc.append("- Results page: `/search?q=…` — query persists in the URL and is shareable; snippets come from the first matching body paragraph; highlighting is done by React text-splitting (no injected HTML).\n")
    doc.append("- Search box appears on the library page and on every chapter-reader page.\n")
    open(os.path.join(a.repo, "docs/atlas-v2-library-reader-search.md"), "w").write("\n".join(doc))
    print(f"chapters={len(chapters)} domains={dict(counts)} flagged={sum(1 for v in PROPOSED.values() if v[2])}")
    print(f"related: explicit-only chapters={sum(1 for s in related if any(e['evidence']=='chapter-link' for e in related[s]))}, "
          f"min links={min(len(v) for v in related.values())}, max links={max(len(v) for v in related.values())}")

if __name__ == "__main__":
    main()
