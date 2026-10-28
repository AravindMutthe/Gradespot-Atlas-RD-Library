// System Explorer data — NIC teaching model ONLY (Step 3, DES-05).
// Every edge carries a typed relationship; untyped chains are not shipped.
// Evidence tiers (DES-05 section 5, mandatory):
//   - "Technical explanation": technically reviewed explanation of a mechanism.
//   - "Illustrative teaching model": the ordering/sequence itself — a teaching
//     model, not a literal execution path and not historical causation.
//   - "Supported by original note": verified paragraph attribution ONLY.
//     Currently NO Explorer claim carries this tier for the NIC chapter
//     (NIC pilot: 0 verified / 5 title-based candidates / 26 unassessed).
// Related chapter links are chapter-level associations, never paragraph
// verification. Commands are technically reviewed EDUCATIONAL EXAMPLES:
// read-only unless a safety note says otherwise; never transcriptions of
// the handwritten notes.

export type EdgeType = "prerequisite" | "data flows to" | "configured by" | "related";

export type ExplorerEdge = {
  from: string;
  to: string;
  type: EdgeType;
  note: string;
};

export type InspectExample = {
  command: string;
  expected: string;
  safety: string;
  networkActive?: boolean;
};

export type ExplorerNode = {
  id: string;
  label: string;
  purpose: string;
  whatHappens: string;
  inspect?: InspectExample;
  relatedChapters: { slug: string; title: string }[];
  limitation: string;
};

export type ExplorerView = {
  id: "setup" | "https" | "troubleshoot";
  title: string;
  intro: string;
  conditionalNote?: string;
  nodes: ExplorerNode[];
  edges: ExplorerEdge[];
};

const NIC = { slug: "from-silicon-to-a-working-nic", title: "From silicon to a working NIC" };
const NIC_SIBLING = {
  slug: "from-embedded-devices-to-nics-switches-and-cloud-systems",
  title: "From embedded devices to NICs, switches, and cloud systems",
};

export const NIC_EVIDENCE_BASELINE = {
  verified: 0,
  candidateHypotheses: 5,
  unassessed: 26,
  note: "NIC pilot result across the chapter's 31 paragraphs: 0 paragraph-verified against original notes, 5 title-based candidates (hypotheses for transcription-based confirmation, not findings), 26 unassessed. Technical correctness does NOT establish original-note provenance.",
};

export const EXPLORER_VIEWS: ExplorerView[] = [
  {
    id: "setup",
    title: "System Setup",
    intro:
      "How a system is brought to a working state: discovery, driver binding, interface creation, addressing, and readiness. These are init-time steps — they happen once when the system starts or the device appears, not once per request.",
    nodes: [
      {
        id: "s1",
        label: "PCIe device discovery",
        purpose: "The operating system identifies the NIC hardware and its identifiers.",
        whatHappens:
          "At boot or device enumeration, the OS walks the PCIe bus. Each function exposes vendor and device identifiers and class codes in configuration space, and the OS matches those identifiers against known drivers.",
        inspect: {
          command: "lspci -nn | grep -i ethernet",
          expected: "One line per Ethernet controller, with vendor:device identifiers in brackets.",
          safety: "Read-only: lists hardware only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "Discovery is init-time, not per-request. A device can be present yet unusable without a matching driver.",
      },
      {
        id: "s2",
        label: "Driver binding",
        purpose: "A compatible kernel driver claims and initializes the device.",
        whatHappens:
          "The kernel matches the discovered device identifiers to a driver. The driver's probe routine initializes the hardware, allocates resources, and registers the network device with the kernel.",
        inspect: {
          command: "lspci -k",
          expected: 'A "Kernel driver in use:" line under the Ethernet controller. ethtool -i <iface> also shows the driver name (replace <iface> with your interface name).',
          safety: "Read-only: reports driver state only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "Binding needs a matching driver. No driver line means a driver or firmware problem, not a cable problem — check vendor support and firmware, which this Explorer does not cover.",
      },
      {
        id: "s3",
        label: "Kernel network interface",
        purpose: "The driver exposes a network device the OS can send through.",
        whatHappens:
          "The driver registers a network device (for example eth0 or enp0s3) and the kernel creates transmit and receive queues for it. The interface has an admin state (up/down) separate from link state (carrier detected or not).",
        inspect: {
          command: "ip link show",
          expected: "Each interface with its state. UP plus LOWER_UP means administratively up with carrier detected.",
          safety: "Read-only: reports interface state only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "Interface UP does not mean the network works — it means the local link layer is ready. Interface names are OS-assigned and vary by system.",
      },
      {
        id: "s4",
        label: "Network configuration",
        purpose: "Addressing, routes, and resolver settings are applied to the interface.",
        whatHappens:
          "An IP address (from DHCP or static configuration), a default route, and a DNS resolver list are configured by an OS service such as NetworkManager, systemd-networkd, or a DHCP client — not by the NIC hardware itself.",
        inspect: {
          command: "ip addr show; ip route show; resolvectl status",
          expected: "An address on the interface, a default route via a gateway, and the configured DNS servers. On systems without systemd-resolved, /etc/resolv.conf shows the resolver list instead.",
          safety: "Read-only: reports configuration only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "The configuration source varies by system. A wrong gateway or DNS server breaks reachability even with a healthy link.",
      },
      {
        id: "s5",
        label: "Readiness",
        purpose: "The host is ready to send traffic.",
        whatHappens:
          "Link up, address assigned, and default route present together mean the preconditions for an outbound request are met. Readiness is checked once as a precondition, not repeated per request.",
        inspect: {
          command: "ip link show; ip route show default",
          expected: "The interface UP with LOWER_UP, and a default route line. Both must be present for the readiness claim.",
          safety: "Read-only: reports state only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "A ready host can still fail later steps: DNS resolution, TLS negotiation, or server errors are separate layers with their own failures.",
      },
    ],
    edges: [
      { from: "s1", to: "s2", type: "prerequisite", note: "Driver matching cannot happen before the device and its identifiers are discovered." },
      { from: "s2", to: "s3", type: "prerequisite", note: "No kernel network interface exists until a driver registers the device." },
      { from: "s4", to: "s3", type: "configured by", note: "Addressing and routes configure how the interface is used; the hardware does not configure itself." },
      { from: "s3", to: "s5", type: "prerequisite", note: "Readiness requires a working interface." },
      { from: "s4", to: "s5", type: "prerequisite", note: "Readiness requires addressing and a route, not just a link." },
    ],
  },
  {
    id: "https",
    title: "HTTPS Request",
    intro:
      "One worked example: a host sends an HTTPS request through the system. This is an outbound data path, not a historical timeline. The network card does not directly understand an HTTPS URL — the OS and applications perform different jobs, and every conditional step below runs only when its condition holds.",
    conditionalNote:
      "Conditional paths stay conditional: name resolution runs only when no cached answer exists; neighbor discovery runs only when the next hop's link-layer address is not cached; the transport path is either HTTPS over TCP or HTTP/3 over QUIC — never both for one request.",
    nodes: [
      {
        id: "h1",
        label: "Name resolution (conditional)",
        purpose: "Turn a hostname into an IP address — only when no cached answer exists.",
        whatHappens:
          "The system resolver checks its cache, then local sources such as /etc/hosts, then DNS. DNS returns A records (IPv4) or AAAA records (IPv6). DNS is not performed by the NIC.",
        inspect: {
          command: "getent hosts example.com",
          expected: "Resolved IP addresses via the system resolver. On systemd systems, resolvectl query example.com shows the same lookup with its source.",
          safety: "Read-only; a lookup may query the configured resolver. A cached answer performs no network query at all.",
          networkActive: true,
        },
        relatedChapters: [NIC],
        limitation:
          "A cached answer skips the network query entirely, and a hosts entry can override DNS. If resolution fails, no connection is attempted — the failure is at this layer, not the network.",
      },
      {
        id: "h2",
        label: "Route selection (per destination)",
        purpose: "Choose the interface and next hop for the destination IP.",
        whatHappens:
          "The kernel consults the routing table. The longest-prefix match wins; the default route is used only when no specific route matches. Selection is per destination, not per application.",
        inspect: {
          command: "ip route get <destination-ip>",
          expected: "The chosen outgoing device and gateway (if any) for that destination.",
          safety: "Read-only: reports the routing decision only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "Routes can change. A route existing does not mean the gateway answers — that is the next layer's question.",
      },
      {
        id: "h3",
        label: "Neighbor discovery (conditional)",
        purpose: "Find the link-layer address for the next hop — only when it is not cached.",
        whatHappens:
          "IPv4 uses ARP and IPv6 uses Neighbor Discovery (ND, part of ICMPv6). They are different protocols doing the same job: mapping a next-hop IP address to a link-layer address. Cached entries skip discovery.",
        inspect: {
          command: "ip neigh show",
          expected: "Neighbor entries with states such as REACHABLE, STALE, or FAILED.",
          safety: "Read-only: reports the neighbor table only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "A FAILED entry means the next hop is not answering at the link layer. ARP and ND must never be conflated: ARP is IPv4-only, ND is IPv6-only.",
      },
      {
        id: "h4",
        label: "Transport security — two distinct paths",
        purpose: "Protect application traffic in transit. One request takes exactly one of these paths.",
        whatHappens:
          "Path A, HTTPS over TCP: a TCP handshake, then a TLS handshake (TLS 1.2 or 1.3 negotiated; the client validates the server certificate), then HTTP/2 or HTTP/1.1 inside the TLS channel. Path B, HTTP/3: QUIC over UDP — QUIC integrates transport reliability with TLS 1.3, so there is no separate TCP handshake. Never imply both happen for one request.",
        inspect: {
          command: "ss -tn",
          expected: "TCP connections and their states. For QUIC, ss -un lists UDP sockets instead. Use -p only for your own processes (other users' process info needs privileges).",
          safety: "Read-only: reports socket state only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "Encryption hides payload from observers but does not prove the server is trustworthy — certificate validation is what that claim rests on. TLS version and cipher are negotiated, not chosen unilaterally.",
      },
      {
        id: "h5",
        label: "Request flow",
        purpose: "The HTTP request travels to the server and the response returns.",
        whatHappens:
          "Encrypted request bytes pass through the socket API, kernel IP and transport processing, driver transmit queues and descriptors, and NIC frames to the local switch; routers forward them toward the destination and the server responds. The response reverses the path.",
        inspect: {
          command: "ip -s link show <iface>",
          expected: "Frame and byte counters that move with traffic. Replace <iface> with your interface name.",
          safety: "Read-only: counters show frames, never decrypted contents.",
        },
        relatedChapters: [NIC, NIC_SIBLING],
        limitation:
          "The real stack is bidirectional, with retransmissions, MTU handling, offloads, and queueing. This linear list is a teaching order, not a literal packet trace.",
      },
    ],
    edges: [
      { from: "h1", to: "h2", type: "data flows to", note: "The resolved IP address is the input to route selection." },
      { from: "h2", to: "h3", type: "data flows to", note: "The chosen next-hop IP is the input to neighbor discovery." },
      { from: "h3", to: "h5", type: "prerequisite", note: "Frames cannot be sent until the next hop's link-layer address is known." },
      { from: "h4", to: "h5", type: "prerequisite", note: "Application bytes travel inside the secured transport." },
      { from: "h1", to: "h4", type: "related", note: "Ordering only: resolution happens before connection setup. It does not cause or secure the transport." },
    ],
  },
  {
    id: "troubleshoot",
    title: "Troubleshoot",
    intro:
      "Layered diagnostic reasoning: work from the link upward, and let each layer's result decide what the next check can mean. The order below is a reasoning order, not a causal chain — a lower layer does not cause the layer above it, it only constrains what its results can prove.",
    nodes: [
      {
        id: "t1",
        label: "Link layer — is the link actually up?",
        purpose: "Rule a physical/link problem in or out first.",
        whatHappens:
          "Check interface state and carrier. Both must agree: administratively up with carrier detected means the local link layer is ready.",
        inspect: {
          command: "ip link show <iface>; ethtool <iface>",
          expected: "State UP with LOWER_UP, and ethtool reporting 'Link detected: yes'. Replace <iface> with your interface name.",
          safety: "Read-only: ethtool without arguments only reports; it changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "Link up does not mean the network works. If LOWER_UP is missing, suspect cable, switch port, or driver — this check alone does not say which.",
      },
      {
        id: "t2",
        label: "Device / driver layer — is the NIC seen and bound?",
        purpose: "Rule a missing-hardware or missing-driver problem in or out.",
        whatHappens:
          "List PCI devices and the driver bound to the Ethernet controller. A present device with a driver line means the OS side of the hardware is claimed.",
        inspect: {
          command: "lspci -k | grep -i -A 3 ethernet",
          expected: "The controller listed with a 'Kernel driver in use:' line.",
          safety: "Read-only: lists hardware and driver state only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "A bound driver can still be buggy or misconfigured, and a device hidden by virtualization may not appear here at all.",
      },
      {
        id: "t3",
        label: "Addressing / routing layer — address and route present?",
        purpose: "Rule a local configuration problem in or out.",
        whatHappens:
          "Check that the interface has an IP address and that a default route exists. A missing default route explains 'no route to host' for outside destinations.",
        inspect: {
          command: "ip addr show <iface>; ip route show default",
          expected: "An address on the interface and a default route via a gateway.",
          safety: "Read-only: reports configuration only, changes nothing.",
        },
        relatedChapters: [NIC],
        limitation:
          "A present route does not mean the gateway answers. That is the reachability layer's question.",
      },
      {
        id: "t4",
        label: "Name resolution layer — does the hostname resolve?",
        purpose: "Isolate resolver/DNS failure from network failure.",
        whatHappens:
          "Resolve the hostname through the system resolver. Compare with a direct-IP test: if the IP works but the name does not, the failure is at this layer.",
        inspect: {
          command: "getent hosts example.com",
          expected: "IP addresses for the name. No output means resolution failed for this name on this system.",
          safety: "Read-only; a lookup may query the configured resolver.",
          networkActive: true,
        },
        relatedChapters: [NIC],
        limitation:
          "Resolution success does not mean the service answers — it only means the name maps to an address.",
      },
      {
        id: "t5",
        label: "Reachability layer — does the path work?",
        purpose: "Test the L3 path to the destination, with its limits understood.",
        whatHappens:
          "Send ICMP echo requests and read the replies. Replies prove the L3 path and a responding peer. No reply proves much less than it appears to.",
        inspect: {
          command: "ping -c 3 <destination-ip>",
          expected: "Replies with round-trip times, or 100% packet loss.",
          safety: "Sends ICMP echo requests (harmless diagnostic traffic); makes no system changes. Prefer an IP address here so DNS is not part of the test.",
          networkActive: true,
        },
        relatedChapters: [NIC],
        limitation:
          "No reply does NOT prove the host is down — ICMP may be filtered anywhere on the path. Ping tests ICMP only, not TCP, TLS, or application health.",
      },
      {
        id: "t6",
        label: "Transport / TLS / application layer — does the service answer securely?",
        purpose: "Separate TLS/certificate/time problems from server-side problems.",
        whatHappens:
          "Perform a real HTTPS request with verbose output. The handshake details show TLS negotiation and certificate handling; the HTTP status shows the server's answer.",
        inspect: {
          command: "curl -v --max-time 10 https://example.com",
          expected: "TLS handshake details, certificate information, then an HTTP status line.",
          safety: "Performs a real HTTPS request to a site you intend to visit; verbose output shows handshake metadata, never decrypted content. Use a real destination, not a placeholder.",
          networkActive: true,
        },
        relatedChapters: [NIC],
        limitation:
          "One site's failure does not mean the network is broken — test a second destination before blaming the path. A handshake failure points at TLS, certificates, or clock time; an HTTP error points at the server.",
      },
    ],
    edges: [
      { from: "t1", to: "t3", type: "prerequisite", note: "An interface without link cannot carry addressed traffic; check the link before interpreting addressing results." },
      { from: "t3", to: "t6", type: "prerequisite", note: "Without a route there is no connection attempt; a TLS result is only meaningful once routing works." },
      { from: "t1", to: "t2", type: "related", note: "Diagnostic order only: check the link before interpreting driver state. Neither causes the other." },
      { from: "t2", to: "t3", type: "related", note: "A bound driver is needed for an interface, but addressing is a separate configuration step." },
      { from: "t3", to: "t4", type: "related", note: "Resolution needs a working local stack, but a resolver failure is its own layer." },
      { from: "t4", to: "t5", type: "related", note: "Resolve first so reachability tests use a known IP. ICMP results themselves do not depend on DNS." },
      { from: "t5", to: "t6", type: "related", note: "A working path is needed before a TLS failure can be blamed on TLS. A TLS failure does not mean the path is broken." },
    ],
  },
];
