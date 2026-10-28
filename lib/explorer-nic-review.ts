// Per-command technical review evidence for the System Explorer (Phase 4, G-11).
// This file is the evidence behind the Explorer page's "technically reviewed"
// claim: a command is called reviewed ONLY because it has a row here.
// Reviewer: Phase 4 builder technical review, 2026-10-28. No invented person
// is named. Method: static review of command text, flags, placeholders, and
// stated expected output against documented tool behavior. NO live execution
// on a target host is claimed; this is not a record of observed runs.
// Criteria: (1) state-change audit — does any verb or flag write, configure,
// or delete? (2) network audit — does the command send traffic or only read
// local state? (3) placeholder audit — are reader-supplied values marked?
// (4) privilege audit — are privilege notes accurate? (5) expected-output
// accuracy against documented tool behavior. (6) example-domain safety —
// example.com is an RFC 2606 reserved example domain.
// Scope: 15 distinct published commands across 16 node slots (getent hosts
// example.com appears in two nodes). Destructive-token scan over all 15:
// no rm, mkfs, dd, iptables, ip link set, ip addr add/del, ip route add/del,
// ethtool -s/-K, sysctl -w, systemctl, sudo, shell redirection, or other
// write verb. Semicolons separate read-only report commands only.
// Expected-text mentions (not separately published commands): ethtool -i
// <iface> (read-only report variant), resolvectl query example.com
// (read-only resolver query), ss -un (read-only UDP socket listing).
// All three are read-only and consistent with their surrounding safety text.

export type TrafficClass =
  | "Read-only"
  | "Network-active (conditional)"
  | "Network-active";

export type CommandReview = {
  command: string;
  trafficClass: TrafficClass;
  nodes: string[];
  note: string;
};

export const REVIEW_METHOD =
  "Phase 4 builder technical review, 2026-10-28. Criteria: (1) state-change audit, (2) network audit, (3) placeholder audit, (4) privilege audit, (5) expected-output accuracy against documented tool behavior, (6) example-domain safety (example.com is an RFC 2606 reserved example domain).";

export const COMMAND_REVIEWS: CommandReview[] = [
  {
    command: "lspci -nn | grep -i ethernet",
    trafficClass: "Read-only",
    nodes: ["s1"],
    note: "Lists PCI devices; -nn adds numeric vendor:device IDs in brackets; grep only filters output. No write flag.",
  },
  {
    command: "lspci -k",
    trafficClass: "Read-only",
    nodes: ["s2"],
    note: "Lists devices with kernel driver lines. The expected text's ethtool -i mention is a read-only report variant, not a second published command.",
  },
  {
    command: "ip link show",
    trafficClass: "Read-only",
    nodes: ["s3"],
    note: "Reports interface state only. UP plus LOWER_UP reading matches iproute2 output.",
  },
  {
    command: "ip addr show; ip route show; resolvectl status",
    trafficClass: "Read-only",
    nodes: ["s4"],
    note: "Three report/status verbs only. resolvectl status queries the local resolver daemon; it changes no configuration.",
  },
  {
    command: "ip link show; ip route show default",
    trafficClass: "Read-only",
    nodes: ["s5"],
    note: "Report verbs only; the default-route filter narrows output and sends nothing.",
  },
  {
    command: "getent hosts example.com",
    trafficClass: "Network-active (conditional)",
    nodes: ["h1", "t4"],
    note: "System-resolver lookup; a cached answer sends no query, otherwise it queries the configured resolver. example.com is an RFC 2606 reserved example domain. No system change.",
  },
  {
    command: "ip route get <destination-ip>",
    trafficClass: "Read-only",
    nodes: ["h2"],
    note: "Kernel routing lookup only; sends no traffic. Placeholder must be replaced with a real destination IP.",
  },
  {
    command: "ip neigh show",
    trafficClass: "Read-only",
    nodes: ["h3"],
    note: "Reports the neighbor table only; states REACHABLE, STALE, and FAILED match iproute2 output.",
  },
  {
    command: "ss -tn",
    trafficClass: "Read-only",
    nodes: ["h4"],
    note: "Lists TCP sockets numerically. The -p privilege note in expected text is accurate: other users' process info needs privileges, and -p is not in the published command.",
  },
  {
    command: "ip -s link show <iface>",
    trafficClass: "Read-only",
    nodes: ["h5"],
    note: "Reports frame and byte counters only; counters move with traffic but the command sends none. Placeholder must be replaced.",
  },
  {
    command: "ip link show <iface>; ethtool <iface>",
    trafficClass: "Read-only",
    nodes: ["t1"],
    note: "ethtool with no action argument reports only. No -s/-K settings flag is present, so the command cannot change settings as written. Placeholder must be replaced.",
  },
  {
    command: "lspci -k | grep -i -A 3 ethernet",
    trafficClass: "Read-only",
    nodes: ["t2"],
    note: "Report plus filter only; -A 3 shows context lines and changes nothing.",
  },
  {
    command: "ip addr show <iface>; ip route show default",
    trafficClass: "Read-only",
    nodes: ["t3"],
    note: "Report verbs only. Placeholder must be replaced.",
  },
  {
    command: "ping -c 3 <destination-ip>",
    trafficClass: "Network-active",
    nodes: ["t5"],
    note: "Sends exactly 3 ICMP echo requests (-c bounds the count; no flood). No system change. Safety text correctly prefers an IP address so DNS is not part of the test.",
  },
  {
    command: "curl -v --max-time 10 https://example.com",
    trafficClass: "Network-active",
    nodes: ["t6"],
    note: "Performs a real HTTPS request; --max-time 10 bounds duration; -v shows handshake metadata, never decrypted content. Safety text correctly tells the reader to use a real destination in practice; example.com is the worked example (RFC 2606 reserved).",
  },
];
