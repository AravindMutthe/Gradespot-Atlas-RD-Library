# Atlas Preview 3 — Batch 1 work packages WP6/WP7/WP8/WP9/WP10/WP14

Branch: `feat/atlas-platform-v2` (from `main` afd8c0e). Main untouched.
No production deploy, no content-repo change, no portfolio/GradeSpot change.

## What this adds (new files/directories only)

- `app/learning-paths/page.tsx` (WP6) — chooser + 5 starter paths, 34 steps,
  every step a real chapter from the 57-chapter master. No mockup title
  became a chapter. Data: `lib/preview3/learning-paths.json`.
- `app/explore/page.tsx` + `components/explorer/NicJourney.tsx` (WP8) —
  NIC packet path: PCIe device discovery → Driver binding → Kernel
  interface → Addressing and routes → Packet transfer, all from the
  “Step-by-step system view” of chapter `from-silicon-to-a-working-nic`.
  Data + reusable node/edge framework: `lib/preview3/explorer-nic-journey.json`.
  No 3D, no GPU rendering, no large dependencies; the stepper is
  progressive enhancement over a server-rendered list.
- `app/sources/page.tsx` (WP7) — sampled original-note scans viewer (7 scans,
  lazy-loaded, captioned), provenance/editorial labels, release manifest,
  research limitations. SHA honesty: recorded SHAs are NOT claimed verified
  (master audit: 0/136 match stored files; filename is the working link key).
- `app/about/page.tsx` (WP7) — purpose, methodology, release info, what the
  Atlas is not. Timelines: design-system only; full interactive timeline is
  a later batch and no timeline page is advertised as completed.
- Labs: hidden / “planned” only. AI: not in navigation.
- `lib/preview3/chapter-titles.json` — the 57 master titles (from the
  consolidated manifest), so TSX link text never falls back to raw slugs.
- `preview3/` — the static-HTML rendering of the same pages + design tokens
  (`preview3.css`, `explorer.js`, `generate_static.py`) used for the staging
  preview, since the WP0 framework decision was unknown to this agent.
  Assumption (stated): portable static HTML + modern CSS/JS for the preview;
  the TSX pages above are static-export-compatible (static JSON imports,
  no server data fetching) so the coordinator can adopt them once WP0 lands.
- `scripts/preview3-quality-gates.py` (WP14) and
  `scripts/preview3-wp9-check.py` (WP9) — automated gates + viewport checks.

## Verified in this batch

- Quality gates: ALL PASS (57 chapters, schema, no duplicate slugs, release
  manifest match incl. SHA 970489efd3899d29, search coverage 57/57, routes
  57+4, new-page links/assets, 136 original notes, SEO, a11y basics,
  contrast AA on all body-text pairs). One pre-existing warning: the copied
  V1 hub `index.html` contains a literal `/${e.slug}` template string counted
  by the link scanner — not a page built by this batch, left for the
  coordinator/hub owner.
- Viewports 320/375/390/768/1024 (headless Firefox lab render): 0 px
  horizontal overflow on all 4 new pages; 0 console errors; keyboard focus
  visible (solid 3 px #2563EB outline); all 7 Sources images lazy-loaded
  with width/height (CLS reservation). Lighthouse scores were NOT obtained
  (no Lighthouse/Chrome lab in this VM; Playwright Chromium is not
  installed and system Chromium blocks localhost navigation) — lab timings
  from Firefox localhost loads are reported instead, and are NOT field data.
  Field Core Web Vitals do not exist for staging (no real-user data) — the
  targets (LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at p75) are stated as targets
  only, not as measured results.
- TSX pages were NOT typechecked/built locally (no repo checkout or
  node_modules in this environment); the static rendering of the same data
  is what was fully verified. The coordinator should run `tsc`/`next build`
  before adopting the TSX pages.
- Owner real-device (iPhone/Android) review was NOT claimed; it is requested
  as the owner gate step.
