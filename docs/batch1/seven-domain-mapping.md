# Seven-domain mapping — 57 chapters (PROPOSED, pending owner approval)

**Status: PROPOSED, PENDING OWNER APPROVAL. This table is a review artifact. Migration is NOT final until the owner approves it. Nothing in this branch changes any chapter URL, slug, or content.**

## Rules applied

- **Identifier preservation (hard rule):** every slug and URL is unchanged. Domain is navigation grouping + library filtering only — **not** a URL segment. No domain-prefixed routes are introduced by this table. If domain-prefixed routes are ever adopted, they ship with a complete old-to-new redirect map first.
- **Assignment basis:** chapter title + section headings + subject, checked against the chapter JSON — not title alone, and not the current domain alone. Where the subject evidence departs from the domain-level default, the row says so and is flagged.
- **Domain-level defaults (from the brief):** hardware-computing → Computing and Hardware (clean); infrastructure-operations → Networks and Infrastructure (clean in principle; pure-operations chapters flagged where Ecosystems and Relationships fits better); systems-evolution → Evolution and History (clean in principle); institutions-markets SPLITS (institutions/standards/governance → Business and Organizations; markets/pricing/competition → Economics and Markets; assigned individually); industrial-business-networks SPLITS (industry-sector → Industries and Sectors; business-network/participant → Ecosystems and Relationships; organisation-structure → Business and Organizations; assigned individually).
- **Flags:** `AMBIGUOUS` = two near-equal fits, or no single domain fits well; the proposed domain is the best single choice, not a settled fact. `BORDERLINE` = a defensible primary with a named secondary reading. Unflagged rows follow the domain-level default or an unambiguous subject. Nothing was force-fit: flagged rows are the ones the owner most needs to rule on.
- **JSON stays source of truth.** This mapping is navigation metadata for a future frontend; it does not migrate content and does not create MDX.

## Proposed domain counts (57 chapters)

| Proposed domain | Chapters |
|---|---|
| Networks and Infrastructure | 15 |
| Computing and Hardware | 13 |
| Evolution and History | 12 |
| Ecosystems and Relationships | 8 |
| Business and Organizations | 5 |
| Economics and Markets | 2 |
| Industries and Sectors | 2 |

**Thin-domain warning:** Economics and Markets (2) and Industries and Sectors (2) are thin after the split — most market/industry material in the master is framed as ecosystems, organisations, or era history, not as standalone market/industry studies. That is a property of the source content, not a counting error. If the owner wants fuller Economics/Industries shelves, that requires new research chapters (a later, separately approved pass), not re-labelling ecosystem chapters. Cross-listing a chapter under a secondary domain is an alternative the owner can approve; this table assigns exactly one primary domain per chapter so the decision stays visible.

## The 57-row mapping

| # | Slug | Current domain | Proposed domain | Flag | Reason |
|---|---|---|---|---|---|
| 1 | `15-computing-memory-power-and-interface-silicon` | hardware-computing | **Computing and Hardware** | — | Chips, memory, power and interfaces — hardware subject throughout. |
| 2 | `18-computer-architecture-instruction-sets-to-distributed-systems` | systems-evolution | **Evolution and History** | — | Architecture traced from instruction sets to distributed systems — evolution narrative. |
| 3 | `19-built-in-architecture-runtime-tuning-and-deliberate-distributed-design` | systems-evolution | **Evolution and History** | AMBIGUOUS | Current-domain rule; content is design guidance (decision layers, tuning), not an era narrative. |
| 4 | `20-processes-execution-models-backup-and-archives` | systems-evolution | **Evolution and History** | AMBIGUOUS | Current-domain rule; content is OS fundamentals (processes, backup vs archive), not an era narrative. |
| 5 | `21-conversations-and-projects-recovered-knowledge-map` | systems-evolution | **Evolution and History** | AMBIGUOUS | A recovered historical register spanning all topics; no single subject domain fits. |
| 6 | `22-from-telegraph-era-controls-to-ai-era-networks-standards-and-schedules` | infrastructure-operations | **Networks and Infrastructure** | BORDERLINE | Network eras from telegraph controls to AI-era networks; standards/government/scheduling are secondary threads. |
| 7 | `23-artifact-repositories-hardware-buses-firmware-and-programming-paradigms` | infrastructure-operations | **Networks and Infrastructure** | BORDERLINE | Artifact repositories and delivery infrastructure; hardware buses/firmware are secondary. |
| 8 | `address-spaces-and-storage-abstraction` | infrastructure-operations | **Networks and Infrastructure** | BORDERLINE | Storage abstraction and virtualization infrastructure; OS/storage fundamentals are secondary. |
| 9 | `address-spaces-storage-abstraction-virtualization-os-functions` | infrastructure-operations | **Networks and Infrastructure** | BORDERLINE | Storage/OS virtualization infrastructure; OS-functions content is secondary. |
| 10 | `ai-infrastructure-power-and-the-digital-economy` | industrial-business-networks | **Economics and Markets** | AMBIGUOUS | AI infrastructure read through power and the digital economy; industry-sector reading is secondary. |
| 11 | `artifact-delivery-vm-oci-storage-network-boundaries` | infrastructure-operations | **Networks and Infrastructure** | — | Artifact delivery, OCI and network boundaries — delivery infrastructure. |
| 12 | `communication-trade-the-first-networks` | institutions-markets | **Ecosystems and Relationships** | AMBIGUOUS | The first networks as trade/communication relationships; era-history reading is secondary. |
| 13 | `computing-power-and-interface-silicon` | hardware-computing | **Computing and Hardware** | — | Computing, power and interface silicon — hardware subject. |
| 14 | `distributed-communication-and-network-segmentation` | infrastructure-operations | **Networks and Infrastructure** | — | Distributed communication and network segmentation — network subject. |
| 15 | `distributed-computing-communication-patterns-network-segmentation` | infrastructure-operations | **Networks and Infrastructure** | — | Distributed communication patterns and segmentation — network subject. |
| 16 | `electronic-digital-computers-and-operating-systems` | infrastructure-operations | **Computing and Hardware** | AMBIGUOUS | Subject is computers and operating systems, not networks; departs from the infra-to-Networks default. |
| 17 | `from-electric-signals-to-functional-silicon` | hardware-computing | **Computing and Hardware** | — | Circuit behaviours and the path from signal to silicon — hardware foundations. |
| 18 | `from-electrical-communication-to-the-ai-infrastructure-economy` | industrial-business-networks | **Evolution and History** | AMBIGUOUS | Organised as a comparative historical index across eras; economy is the endpoint, not the structure. |
| 19 | `from-embedded-devices-to-nics-switches-and-cloud-systems` | hardware-computing | **Computing and Hardware** | BORDERLINE | Device classes and the NIC path; network journey is secondary to the devices. |
| 20 | `from-governance-and-business-models-to-working-technical-systems` | institutions-markets | **Business and Organizations** | — | Governance and business models mapped to working systems — organisation subject. |
| 21 | `from-human-communication-to-interconnected-digital-systems` | systems-evolution | **Evolution and History** | — | Era-spanning story from human communication to digital systems; also the Atlas intro chapter. |
| 22 | `from-merchant-correspondence-to-ai-platforms-technology-infrastructure-and-business-by-era` | industrial-business-networks | **Evolution and History** | — | Explicitly by era, merchant correspondence to AI platforms. |
| 23 | `from-pre-web-networks-to-web-1-0-web-2-0-and-the-ai-web` | infrastructure-operations | **Evolution and History** | AMBIGUOUS | Organised as eras (pre-Web, Web 1.0/2.0/Web3, AI Web); era structure is the organising principle, not network mechanics. |
| 24 | `from-silicon-to-a-working-nic` | hardware-computing | **Computing and Hardware** | — | Silicon-to-NIC data path — hardware subject. |
| 25 | `global-digital-delivery-networks-operators-platforms-and-revenue` | industrial-business-networks | **Ecosystems and Relationships** | AMBIGUOUS | Delivery as a network of operators and platforms reaching households; revenue/industry readings are secondary. |
| 26 | `handwritten-semiconductor-notes-detailed-reading-and-technical-connections` | hardware-computing | **Computing and Hardware** | — | Semiconductor notes and IC classification — hardware subject. |
| 27 | `how-shared-technology-became-proprietary-ecosystems` | industrial-business-networks | **Ecosystems and Relationships** | — | Shared technology becoming proprietary ecosystems — ecosystem subject. |
| 28 | `industrial-evolution-from-merchant-networks-to-ai-ecosystems` | industrial-business-networks | **Industries and Sectors** | BORDERLINE | How industries and their networks evolve; participant/ecosystem thread is secondary. |
| 29 | `institutions-standards-global-supply-chains` | institutions-markets | **Business and Organizations** | BORDERLINE | Institutions, standards and governance; supply-chain relationships are secondary. |
| 30 | `interfaces-linux-datapaths-and-physical-to-virtual-infrastructure` | infrastructure-operations | **Networks and Infrastructure** | — | Linux datapaths and physical-to-virtual infrastructure — network/infrastructure subject. |
| 31 | `linux-identity-data-states-kernel-boundaries-sterling-deployment` | infrastructure-operations | **Networks and Infrastructure** | BORDERLINE | Linux identity, kernel boundaries and Kubernetes deployment — infrastructure operations. |
| 32 | `market-structures-integration-consolidation-and-the-distribution-of-control` | institutions-markets | **Economics and Markets** | — | Market structures, integration, consolidation and control — markets subject. |
| 33 | `memory-from-physical-cells-to-processes-numa-and-durable-data` | hardware-computing | **Computing and Hardware** | — | Memory hierarchy, NUMA and durable data — hardware/computing subject. |
| 34 | `memory-hierarchy-storage-and-motherboard-controllers` | hardware-computing | **Computing and Hardware** | — | Memory hierarchy, storage and motherboard controllers — hardware subject. |
| 35 | `open-source-contributors-institutions-and-the-software-supply-chain` | institutions-markets | **Ecosystems and Relationships** | AMBIGUOUS | Contributor network and software supply chain are the subject; institutional control is secondary. |
| 36 | `operating-systems-kernel-boundaries-hypervisor-architecture` | infrastructure-operations | **Computing and Hardware** | AMBIGUOUS | Subject is OS kernels and hypervisor architecture, not networks; departs from the infra-to-Networks default. |
| 37 | `operating-systems-kernels-and-hypervisors` | infrastructure-operations | **Computing and Hardware** | AMBIGUOUS | Subject is OS kernels and hypervisors, not networks; departs from the infra-to-Networks default. |
| 38 | `packet-switching-lans-and-internetworking` | infrastructure-operations | **Networks and Infrastructure** | — | Packet switching, LANs and internetworking — network subject. |
| 39 | `physical-networks-kubernetes-networking-and-enterprise-traffic-paths` | infrastructure-operations | **Networks and Infrastructure** | — | Physical and Kubernetes networking and traffic paths — network subject. |
| 40 | `pre-electrical-networks-and-institutional-coordination` | institutions-markets | **Business and Organizations** | BORDERLINE | Institutional coordination is the subject; pre-electrical era is secondary. |
| 41 | `processing-engines-instruction-sets-and-configurable-logic` | hardware-computing | **Computing and Hardware** | — | Processing engines and instruction sets — computing subject. |
| 42 | `public-infrastructure-private-ecosystems-and-the-changing-geography-of-control` | industrial-business-networks | **Ecosystems and Relationships** | BORDERLINE | Public infrastructure and private ecosystems; governance/authority is secondary. |
| 43 | `public-internet-mobile-networks-and-global-reach` | infrastructure-operations | **Networks and Infrastructure** | — | Public Internet and mobile networks — network subject. |
| 44 | `radio-electronic-switching-and-data-processing` | systems-evolution | **Evolution and History** | BORDERLINE | Era study (radio/electronic switching era) in the standard era-study template. |
| 45 | `scheduling-resources-and-operational-systems` | infrastructure-operations | **Ecosystems and Relationships** | AMBIGUOUS | Pure-operations chapter: project resource coordination between participants; Business and Organizations is also defensible. |
| 46 | `semiconductor-devices-and-interface-circuits` | hardware-computing | **Computing and Hardware** | — | Semiconductor devices and interface circuits — hardware subject. |
| 47 | `shared-foundations-open-source-and-the-construction-of-private-ecosystems` | industrial-business-networks | **Ecosystems and Relationships** | — | Shared foundations and construction of private ecosystems — ecosystem subject. |
| 48 | `source-photographs` | systems-evolution | **Evolution and History** | AMBIGUOUS | PROVISIONAL ONLY by current-domain rule. This is the source-photograph gallery, not a subject chapter; its proper home is the Sources experience, not any domain. |
| 49 | `systems-knowledge-map-and-practical-applications` | systems-evolution | **Evolution and History** | AMBIGUOUS | Current-domain rule; content is a cross-cutting knowledge map, not an era narrative. |
| 50 | `technology-leadership-business-models` | institutions-markets | **Business and Organizations** | — | Technology leadership and business models; organisation and technical control. |
| 51 | `telegraph-telephone-and-electrical-networks` | infrastructure-operations | **Networks and Infrastructure** | — | Telegraph, telephone and electrical networks — network subject. |
| 52 | `the-evolution-of-human-computer-interfaces` | systems-evolution | **Evolution and History** | — | Human-computer interaction traced across eras — history subject. |
| 53 | `the-global-digital-industry-stack-india-united-states-europe-and-china` | industrial-business-networks | **Industries and Sectors** | — | Regional industry stacks (India, US, EU, China) — industry-sector subject. |
| 54 | `the-global-digital-industry-stack-ownership-architecture-and-revenue` | industrial-business-networks | **Ecosystems and Relationships** | AMBIGUOUS | A service as a coalition of independently operated systems; ownership/governance is secondary. |
| 55 | `vertical-horizontal-and-platform-integration-across-technology-eras` | industrial-business-networks | **Business and Organizations** | BORDERLINE | Integration strategies and how organisations grow, plateau and decline. |
| 56 | `virtualization-cloud-and-software-defined-enterprise` | infrastructure-operations | **Networks and Infrastructure** | — | Virtualization, cloud and software-defined enterprise infrastructure. |
| 57 | `vm-deployment-artifactory-oci-hardware-buses` | infrastructure-operations | **Networks and Infrastructure** | — | VM deployment, Artifactory/OCI repositories and network layers — deployment infrastructure. |

## Ambiguous rows — owner decisions required (16)

Each row below needs an explicit owner ruling before migration. The proposal stands as written until ruled on; it is not a default that silently becomes final.

- `19-built-in-architecture-runtime-tuning-and-deliberate-distributed-design` (current: systems-evolution) → proposed **Evolution and History**. Current-domain rule; content is design guidance (decision layers, tuning), not an era narrative.
- `20-processes-execution-models-backup-and-archives` (current: systems-evolution) → proposed **Evolution and History**. Current-domain rule; content is OS fundamentals (processes, backup vs archive), not an era narrative.
- `21-conversations-and-projects-recovered-knowledge-map` (current: systems-evolution) → proposed **Evolution and History**. A recovered historical register spanning all topics; no single subject domain fits.
- `ai-infrastructure-power-and-the-digital-economy` (current: industrial-business-networks) → proposed **Economics and Markets**. AI infrastructure read through power and the digital economy; industry-sector reading is secondary.
- `communication-trade-the-first-networks` (current: institutions-markets) → proposed **Ecosystems and Relationships**. The first networks as trade/communication relationships; era-history reading is secondary.
- `electronic-digital-computers-and-operating-systems` (current: infrastructure-operations) → proposed **Computing and Hardware**. Subject is computers and operating systems, not networks; departs from the infra-to-Networks default.
- `from-electrical-communication-to-the-ai-infrastructure-economy` (current: industrial-business-networks) → proposed **Evolution and History**. Organised as a comparative historical index across eras; economy is the endpoint, not the structure.
- `from-pre-web-networks-to-web-1-0-web-2-0-and-the-ai-web` (current: infrastructure-operations) → proposed **Evolution and History**. Organised as eras (pre-Web, Web 1.0/2.0/Web3, AI Web); era structure is the organising principle, not network mechanics.
- `global-digital-delivery-networks-operators-platforms-and-revenue` (current: industrial-business-networks) → proposed **Ecosystems and Relationships**. Delivery as a network of operators and platforms reaching households; revenue/industry readings are secondary.
- `open-source-contributors-institutions-and-the-software-supply-chain` (current: institutions-markets) → proposed **Ecosystems and Relationships**. Contributor network and software supply chain are the subject; institutional control is secondary.
- `operating-systems-kernel-boundaries-hypervisor-architecture` (current: infrastructure-operations) → proposed **Computing and Hardware**. Subject is OS kernels and hypervisor architecture, not networks; departs from the infra-to-Networks default.
- `operating-systems-kernels-and-hypervisors` (current: infrastructure-operations) → proposed **Computing and Hardware**. Subject is OS kernels and hypervisors, not networks; departs from the infra-to-Networks default.
- `scheduling-resources-and-operational-systems` (current: infrastructure-operations) → proposed **Ecosystems and Relationships**. Pure-operations chapter: project resource coordination between participants; Business and Organizations is also defensible.
- `source-photographs` (current: systems-evolution) → proposed **Evolution and History**. PROVISIONAL ONLY by current-domain rule. This is the source-photograph gallery, not a subject chapter; its proper home is the Sources experience, not any domain.
- `systems-knowledge-map-and-practical-applications` (current: systems-evolution) → proposed **Evolution and History**. Current-domain rule; content is a cross-cutting knowledge map, not an era narrative.
- `the-global-digital-industry-stack-ownership-architecture-and-revenue` (current: industrial-business-networks) → proposed **Ecosystems and Relationships**. A service as a coalition of independently operated systems; ownership/governance is secondary.

### The two rows that most need a ruling, not a label

- `source-photographs`: labelling a 67-image source gallery 'Evolution and History' is a filing convenience, not a subject claim. Recommended owner options: (a) keep it out of domain navigation entirely and home it under Sources; (b) accept the provisional Evolution and History label for filtering only, with the Sources home primary. This table records (b) as provisional so the row is not dropped — dropping it would lose a chapter from the library count.
- `21-conversations-and-projects-recovered-knowledge-map`: a cross-domain register. Recommended owner options: (a) Evolution and History as proposed (it is a historical recovery); (b) no single domain — library cross-reference only. Either way it must remain reachable from the library; it must not be hidden because it fits no shelf.

## Borderline rows (12)

- `22-from-telegraph-era-controls-to-ai-era-networks-standards-and-schedules` → **Networks and Infrastructure**. Network eras from telegraph controls to AI-era networks; standards/government/scheduling are secondary threads.
- `23-artifact-repositories-hardware-buses-firmware-and-programming-paradigms` → **Networks and Infrastructure**. Artifact repositories and delivery infrastructure; hardware buses/firmware are secondary.
- `address-spaces-and-storage-abstraction` → **Networks and Infrastructure**. Storage abstraction and virtualization infrastructure; OS/storage fundamentals are secondary.
- `address-spaces-storage-abstraction-virtualization-os-functions` → **Networks and Infrastructure**. Storage/OS virtualization infrastructure; OS-functions content is secondary.
- `from-embedded-devices-to-nics-switches-and-cloud-systems` → **Computing and Hardware**. Device classes and the NIC path; network journey is secondary to the devices.
- `industrial-evolution-from-merchant-networks-to-ai-ecosystems` → **Industries and Sectors**. How industries and their networks evolve; participant/ecosystem thread is secondary.
- `institutions-standards-global-supply-chains` → **Business and Organizations**. Institutions, standards and governance; supply-chain relationships are secondary.
- `linux-identity-data-states-kernel-boundaries-sterling-deployment` → **Networks and Infrastructure**. Linux identity, kernel boundaries and Kubernetes deployment — infrastructure operations.
- `pre-electrical-networks-and-institutional-coordination` → **Business and Organizations**. Institutional coordination is the subject; pre-electrical era is secondary.
- `public-infrastructure-private-ecosystems-and-the-changing-geography-of-control` → **Ecosystems and Relationships**. Public infrastructure and private ecosystems; governance/authority is secondary.
- `radio-electronic-switching-and-data-processing` → **Evolution and History**. Era study (radio/electronic switching era) in the standard era-study template.
- `vertical-horizontal-and-platform-integration-across-technology-eras` → **Business and Organizations**. Integration strategies and how organisations grow, plateau and decline.

## What this table does not do

- It does not rename, move, merge, or split any chapter.
- It does not add the four proposed new Linux/OS/Kubernetes chapters, the Chapter 21 merge items, or any b023 material (all later, separately approved passes).
- It does not publish the 2 privacy-excluded items or the 4 former-employer records (they appear nowhere in this package).
- It does not claim the seven domains are balanced: see the thin-domain warning above.
