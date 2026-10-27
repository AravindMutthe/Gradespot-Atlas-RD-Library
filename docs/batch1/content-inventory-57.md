# Atlas Batch 1 — Content inventory (57 chapters)

**Status: review artifact, generated from the content master. Proposed, pending owner approval where it proposes anything.**

**Source (read-only):** phone `~/atlas-content/` — `manifests/chapters.json`, `manifests/release.json`, and the 57 chapter JSON files under `chapters/` (five current domains). No content-repo file was changed by this work package. JSON remains the source of truth; there is **no MDX migration** in this package.

**Release:** `v1-consolidated-001`, version `1.0.0-continuing`, status `research-edition`, `content_sha256 970489efd3899d29` (as recorded in `manifests/release.json`).

## How to read the counts

- `blocks` = number of `blocks[]` entries in the chapter JSON; `paras` = paragraph count (chapter `paragraph_count` field, verified equal to the sum of `paras[]` across blocks for all 57 chapters, and equal to `manifests/chapters.json` for all 57).
- `images` = chapter `image_count` field; `illustrations` in the file is the same list. `diagrams` / `tables` = lengths of the chapter `diagrams[]` / `tables[]` lists (the chapter files store these as lists, not integers; the manifest stores the matching counts). Manifest and chapter files agree on every count for all 57 chapters — there were zero count mismatches.
- `notes` = number of `original_notes[]` entries. `related` = number of `related_concepts[]` entries. Related slugs were validated: all 132 non-empty related entries point at one of the 57 slugs (zero dangling links).
- **187 chapter-image references vs 136 unique files:** the 57 chapters reference 187 images in total, but only 136 distinct filenames occur (`illustrations` and `original_notes` filename sets are identical, 136 each, full overlap). The same original-note file is legitimately reused by several chapters. `release.json`'s `unique_images: 136` matches the distinct-filename count, not the 187 reference count.
- **Paragraph total vs release arithmetic:** chapter paragraph counts sum to **1,040**. `release.json` records `baseline_paragraphs_kept: 733` and `industry_paragraphs_added: 283`, which sum to 1,016 — 24 fewer. This inventory does **not** resolve that gap; it records both numbers as found. Do not quote 1,016 as the chapter total or 1,040 as the baseline+industry sum. (Possible explanations were not verified and are not asserted here.)

## Original notes — SHA caveat (hard rule for any reader UI)

Every `original_notes[]` entry carries a `sha256` field, and the **filename is the working link key**: the filename sets of `illustrations[]` and `original_notes[]` match exactly (136/136). However, the standing audit finding is that master original-note SHA-256 values match stored image files **0/136**. Therefore **no original-note link in this package may be described as SHA-verified**. A reader UI must display filename (+ stored SHA, labelled as stored, not verified) and must not claim hash verification. SHA re-validation is a separate, later pass; it is not done here.

31 chapters have zero original notes and zero illustrations; 26 chapters carry all 187 image references. 29 chapters have an empty `related_concepts[]` list — for those chapters the reader's 'related chapters' links are **missing, not empty by design**, and must not be invented. The 28 chapters with related entries are listed per chapter in the table's `related` column (count) and in full in the JSON companion to this inventory (see `content-inventory-57.json`).

## Counts by current domain

| Current domain | Chapters | Paragraphs | Image refs | Diagrams | Tables |
|---|---|---|---|---|---|
| hardware-computing | 10 | 194 | 18 | 2 | 1 |
| industrial-business-networks | 11 | 127 | 0 | 0 | 17 |
| infrastructure-operations | 20 | 380 | 75 | 20 | 23 |
| institutions-markets | 7 | 99 | 13 | 0 | 4 |
| systems-evolution | 9 | 240 | 81 | 0 | 3 |
| **Total** | **57** | **1,040** | **187** | **22** | **48** |

Totals cross-check: diagrams 22 and tables 48 match `release.json`; paragraphs 1,040 and image references 187 match the manifest sums (see the 24-paragraph note above).

## All 57 chapters

Sorted by slug. `sources` uses the manifest's edition labels verbatim. `note` is the chapter file's own `note` field where present, otherwise `—`. Missing fields are shown as missing; nothing is invented.

| Slug | Title | Domain | Blocks | Paras | Images | Diag | Tables | Notes | Related | Sources |
|---|---|---|---|---|---|---|---|---|---|---|
| `15-computing-memory-power-and-interface-silicon` | 15 · Computing, memory, power and interface silicon | hardware-computing | 7 | 22 | 4 | 1 | 0 | 4 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `18-computer-architecture-instruction-sets-to-distributed-systems` | 18 · Computer architecture: instruction sets to distributed systems | systems-evolution | 4 | 20 | 5 | 0 | 0 | 5 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `19-built-in-architecture-runtime-tuning-and-deliberate-distributed-design` | 19 · Built-in architecture, runtime tuning and deliberate distributed design | systems-evolution | 5 | 10 | 2 | 0 | 1 | 2 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `20-processes-execution-models-backup-and-archives` | 20 · Processes, execution models, backup and archives | systems-evolution | 6 | 13 | 4 | 0 | 2 | 4 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `21-conversations-and-projects-recovered-knowledge-map` | 21 · Conversations and projects: recovered knowledge map | systems-evolution | 21 | 58 | 0 | 0 | 0 | 0 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `22-from-telegraph-era-controls-to-ai-era-networks-standards-and-schedules` | 22 · From telegraph-era controls to AI-era networks, standards and schedules | infrastructure-operations | 10 | 29 | 6 | 0 | 3 | 6 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `23-artifact-repositories-hardware-buses-firmware-and-programming-paradigms` | 23 · Artifact repositories, hardware buses, firmware and programming paradigms | infrastructure-operations | 8 | 21 | 6 | 0 | 0 | 6 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `address-spaces-and-storage-abstraction` | Address spaces and storage abstraction | infrastructure-operations | 1 | 10 | 6 | 5 | 0 | 6 | 5 | Industry Evolution Edition (63.1 MB) |
| `address-spaces-storage-abstraction-virtualization-os-functions` | Address Spaces, Storage Abstraction, Virtualization & OS Functions | infrastructure-operations | 14 | 72 | 6 | 5 | 0 | 6 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `ai-infrastructure-power-and-the-digital-economy` | AI infrastructure, power and the digital economy | industrial-business-networks | 9 | 10 | 0 | 0 | 0 | 0 | 7 | Industry Evolution Edition (63.1 MB) |
| `artifact-delivery-vm-oci-storage-network-boundaries` | 📦 Artifact Delivery: VM, OCI, Storage & Network Boundaries | infrastructure-operations | 8 | 16 | 6 | 0 | 0 | 6 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `communication-trade-the-first-networks` | 🕰️ Communication, trade & the first networks | institutions-markets | 5 | 16 | 3 | 0 | 0 | 3 | 5 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `computing-power-and-interface-silicon` | Computing, power and interface silicon | hardware-computing | 1 | 8 | 4 | 1 | 0 | 4 | 5 | Industry Evolution Edition (63.1 MB) |
| `distributed-communication-and-network-segmentation` | Distributed communication and network segmentation | infrastructure-operations | 1 | 10 | 6 | 1 | 4 | 6 | 5 | Industry Evolution Edition (63.1 MB) |
| `distributed-computing-communication-patterns-network-segmentation` | Distributed Computing, Communication Patterns & Network Segmentation | infrastructure-operations | 11 | 27 | 6 | 1 | 4 | 6 | 1 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `electronic-digital-computers-and-operating-systems` | Electronic digital computers and operating systems | infrastructure-operations | 9 | 9 | 0 | 0 | 0 | 0 | 7 | Industry Evolution Edition (63.1 MB) |
| `from-electric-signals-to-functional-silicon` | ⚡ From electric signals to functional silicon | hardware-computing | 4 | 11 | 0 | 0 | 0 | 0 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `from-electrical-communication-to-the-ai-infrastructure-economy` | From Electrical Communication to the AI Infrastructure Economy | industrial-business-networks | 15 | 25 | 0 | 0 | 3 | 0 | 0 | Industry Evolution Edition (63.1 MB) |
| `from-embedded-devices-to-nics-switches-and-cloud-systems` | 🌐 From embedded devices to NICs, switches and cloud systems | hardware-computing | 5 | 14 | 0 | 0 | 0 | 0 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `from-governance-and-business-models-to-working-technical-systems` | 🏛️ From governance and business models to working technical systems | institutions-markets | 8 | 25 | 0 | 0 | 1 | 0 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `from-human-communication-to-interconnected-digital-systems` | From human communication to interconnected digital systems. | systems-evolution | 5 | 24 | 0 | 0 | 0 | 0 | 0 | Knowledge-V1 (first consolidated V1, 110.8 MB); V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `from-merchant-correspondence-to-ai-platforms-technology-infrastructure-and-business-by-era` | From Merchant Correspondence to AI Platforms: Technology, Infrastructure and Business by Era | industrial-business-networks | 9 | 11 | 0 | 0 | 1 | 0 | 3 | Industry Evolution Edition (63.1 MB) |
| `from-pre-web-networks-to-web-1-0-web-2-0-and-the-ai-web` | From Pre-Web Networks to Web 1.0, Web 2.0 and the AI Web | infrastructure-operations | 8 | 16 | 0 | 0 | 1 | 0 | 0 | Industry Evolution Edition (63.1 MB) |
| `from-silicon-to-a-working-nic` | 🔌 From silicon to a working NIC | hardware-computing | 6 | 31 | 3 | 0 | 0 | 3 | 5 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `global-digital-delivery-networks-operators-platforms-and-revenue` | Global Digital Delivery: Networks, Operators, Platforms and Revenue | industrial-business-networks | 7 | 7 | 0 | 0 | 1 | 0 | 0 | Industry Evolution Edition (63.1 MB) |
| `handwritten-semiconductor-notes-detailed-reading-and-technical-connections` | 🔬 Handwritten semiconductor notes: detailed reading and technical connections | hardware-computing | 20 | 52 | 0 | 0 | 0 | 0 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `how-shared-technology-became-proprietary-ecosystems` | How Shared Technology Became Proprietary Ecosystems | industrial-business-networks | 3 | 7 | 0 | 0 | 2 | 0 | 0 | Industry Evolution Edition (63.1 MB) |
| `industrial-evolution-from-merchant-networks-to-ai-ecosystems` | Industrial Evolution: From Merchant Networks to AI Ecosystems | industrial-business-networks | 10 | 32 | 0 | 0 | 2 | 0 | 0 | Industry Evolution Edition (63.1 MB) |
| `institutions-standards-global-supply-chains` | 🌍 Institutions, standards & global supply chains | institutions-markets | 5 | 17 | 8 | 0 | 0 | 8 | 5 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `interfaces-linux-datapaths-and-physical-to-virtual-infrastructure` | Interfaces, Linux datapaths and physical-to-virtual infrastructure | infrastructure-operations | 9 | 27 | 4 | 0 | 1 | 4 | 1 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `linux-identity-data-states-kernel-boundaries-sterling-deployment` | 🔐 Linux Identity, Data States, Kernel Boundaries & Sterling Deployment | infrastructure-operations | 8 | 18 | 6 | 3 | 1 | 6 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `market-structures-integration-consolidation-and-the-distribution-of-control` | Market Structures, Integration, Consolidation and the Distribution of Control | institutions-markets | 4 | 6 | 0 | 0 | 2 | 0 | 3 | Industry Evolution Edition (63.1 MB) |
| `memory-from-physical-cells-to-processes-numa-and-durable-data` | Memory: from physical cells to processes, NUMA and durable data | hardware-computing | 10 | 20 | 7 | 0 | 0 | 7 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `memory-hierarchy-storage-and-motherboard-controllers` | 🗃️ Memory hierarchy, storage and motherboard controllers | hardware-computing | 4 | 11 | 0 | 0 | 0 | 0 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `open-source-contributors-institutions-and-the-software-supply-chain` | Open Source: Contributors, Institutions and the Software Supply Chain | institutions-markets | 6 | 9 | 0 | 0 | 1 | 0 | 0 | Industry Evolution Edition (63.1 MB) |
| `operating-systems-kernel-boundaries-hypervisor-architecture` | Operating Systems, Kernel Boundaries & Hypervisor Architecture | infrastructure-operations | 12 | 25 | 6 | 0 | 4 | 6 | 1 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `operating-systems-kernels-and-hypervisors` | Operating systems, kernels and hypervisors | infrastructure-operations | 1 | 10 | 6 | 0 | 4 | 6 | 5 | Industry Evolution Edition (63.1 MB) |
| `packet-switching-lans-and-internetworking` | Packet switching, LANs and internetworking | infrastructure-operations | 9 | 9 | 0 | 0 | 0 | 0 | 7 | Industry Evolution Edition (63.1 MB) |
| `physical-networks-kubernetes-networking-and-enterprise-traffic-paths` | Physical networks, Kubernetes networking and enterprise traffic paths | infrastructure-operations | 9 | 15 | 4 | 5 | 1 | 4 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `pre-electrical-networks-and-institutional-coordination` | Pre-electrical networks and institutional coordination | institutions-markets | 9 | 9 | 0 | 0 | 0 | 0 | 7 | Industry Evolution Edition (63.1 MB) |
| `processing-engines-instruction-sets-and-configurable-logic` | 🧠 Processing engines, instruction sets and configurable logic | hardware-computing | 3 | 7 | 0 | 0 | 1 | 0 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `public-infrastructure-private-ecosystems-and-the-changing-geography-of-control` | Public Infrastructure, Private Ecosystems and the Changing Geography of Control | industrial-business-networks | 3 | 6 | 0 | 0 | 2 | 0 | 0 | Industry Evolution Edition (63.1 MB) |
| `public-internet-mobile-networks-and-global-reach` | Public Internet, mobile networks and global reach | infrastructure-operations | 9 | 9 | 0 | 0 | 0 | 0 | 7 | Industry Evolution Edition (63.1 MB) |
| `radio-electronic-switching-and-data-processing` | Radio, electronic switching and data processing | systems-evolution | 9 | 9 | 0 | 0 | 0 | 0 | 7 | Industry Evolution Edition (63.1 MB) |
| `scheduling-resources-and-operational-systems` | 📅 Scheduling resources and operational systems | infrastructure-operations | 5 | 17 | 1 | 0 | 0 | 1 | 5 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `semiconductor-devices-and-interface-circuits` | Semiconductor devices and interface circuits | hardware-computing | 1 | 18 | 0 | 0 | 0 | 0 | 5 | Industry Evolution Edition (63.1 MB) |
| `shared-foundations-open-source-and-the-construction-of-private-ecosystems` | Shared Foundations, Open Source and the Construction of Private Ecosystems | industrial-business-networks | 4 | 8 | 0 | 0 | 1 | 0 | 3 | Industry Evolution Edition (63.1 MB) |
| `source-photographs` | 📚 Source photographs | systems-evolution | 3 | 86 | 67 | 0 | 0 | 67 | 1 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `systems-knowledge-map-and-practical-applications` | Systems knowledge map and practical applications | systems-evolution | 1 | 4 | 0 | 0 | 0 | 0 | 5 | Industry Evolution Edition (63.1 MB) |
| `technology-leadership-business-models` | 🏛️ Technology leadership & business models | institutions-markets | 5 | 17 | 2 | 0 | 0 | 2 | 5 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `telegraph-telephone-and-electrical-networks` | Telegraph, telephone and electrical networks | infrastructure-operations | 9 | 9 | 0 | 0 | 0 | 0 | 7 | Industry Evolution Edition (63.1 MB) |
| `the-evolution-of-human-computer-interfaces` | 💻 The evolution of human–computer interfaces | systems-evolution | 5 | 16 | 3 | 0 | 0 | 3 | 5 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |
| `the-global-digital-industry-stack-india-united-states-europe-and-china` | The Global Digital Industry Stack: India, United States, Europe and China | industrial-business-networks | 7 | 9 | 0 | 0 | 1 | 0 | 3 | Industry Evolution Edition (63.1 MB) |
| `the-global-digital-industry-stack-ownership-architecture-and-revenue` | The Global Digital Industry Stack: Ownership, Architecture and Revenue | industrial-business-networks | 4 | 7 | 0 | 0 | 1 | 0 | 0 | Industry Evolution Edition (63.1 MB) |
| `vertical-horizontal-and-platform-integration-across-technology-eras` | Vertical, Horizontal and Platform Integration Across Technology Eras | industrial-business-networks | 3 | 5 | 0 | 0 | 3 | 0 | 0 | Industry Evolution Edition (63.1 MB) |
| `virtualization-cloud-and-software-defined-enterprise` | Virtualization, cloud and software-defined enterprise | infrastructure-operations | 9 | 9 | 0 | 0 | 0 | 0 | 7 | Industry Evolution Edition (63.1 MB) |
| `vm-deployment-artifactory-oci-hardware-buses` | VM Deployment, Artifactory, OCI & Hardware Buses | infrastructure-operations | 8 | 22 | 6 | 0 | 0 | 6 | 0 | V1 Research Edition (110.8 MB baseline); Industry Evolution Edition (63.1 MB) |

## Chapter notes carried verbatim from the files

- `address-spaces-and-storage-abstraction`: Second substantive chapter under this title in the Industry edition (first instance merged with its baseline counterpart).
- `computing-power-and-interface-silicon`: Second substantive chapter under this title in the Industry edition (first instance merged with its baseline counterpart).
- `distributed-communication-and-network-segmentation`: Second substantive chapter under this title in the Industry edition (first instance merged with its baseline counterpart).
- `operating-systems-kernels-and-hypervisors`: Second substantive chapter under this title in the Industry edition (first instance merged with its baseline counterpart).
- `semiconductor-devices-and-interface-circuits`: Second substantive chapter under this title in the Industry edition (first instance merged with its baseline counterpart).
- `systems-knowledge-map-and-practical-applications`: Second substantive chapter under this title in the Industry edition (first instance merged with its baseline counterpart).

29 chapters also carry an `industry_title` field (the Industry-edition title for the merged baseline chapter). Those titles are preserved in `content-inventory-57.json` and are **not** used as display titles here; the display title is the chapter `title` field.

## Special cases observed (not resolved here)

- `source-photographs` (systems-evolution): 86 paragraphs and 67 image references — it is the source-photograph gallery chapter, not a subject article. Its size dominates the image counts; any per-chapter average that includes it is misleading.
- `21-conversations-and-projects-recovered-knowledge-map` (systems-evolution): 58 paragraphs across 21 blocks, zero images — a recovered register, not a normal article.
- `from-human-communication-to-interconnected-digital-systems` (systems-evolution): the only chapter carrying a `variants` field, and the only chapter sourced from three editions (Knowledge-V1 + Research + Industry). Its variant contents were not expanded here.
- Six industry-only chapters carry the file note 'Second substantive chapter under this title in the Industry edition (first instance merged with its baseline counterpart).' They are distinct chapters with distinct slugs, not duplicates to merge silently.
- Chapters whose `blocks[]` contain a single 'Source-related annotations' block (e.g. the industry-only annotation chapters) carry editorial/production annotations, not full articles, in that block. Their paragraph counts are as recorded; reading quality of those chapters is a content question for a later pass, not a count to adjust here.

## Files

- This document: `docs/batch1/content-inventory-57.md`
- Machine-readable companion (same data, plus per-chapter `original_notes` filenames, `illustration` filenames, `related_concepts` slugs, headings, and `industry_title`): `docs/batch1/content-inventory-57.json`
- Mapping to seven domains: `docs/batch1/seven-domain-mapping.md`
