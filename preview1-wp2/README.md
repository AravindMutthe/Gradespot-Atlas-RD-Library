# WP2 — Preview 1: homepage + global navigation + design references

**Branch:** `feat/atlas-platform-v2` · **Directory:** `preview1-wp2/` (kept separate so
parallel work-package agents sharing the branch do not overwrite each other).
**Main is untouched. Production is untouched. No content-repo changes.**

## Assumption (stated explicitly, per the task)

At build time the WP0 framework decision was not visible on this branch — the
branch still pointed at the V1 `main` commit (`afd8c0e`), whose tree is the
existing Next.js V1 site. So this package is **clean static HTML + modern
CSS/JS with the same token system**, structured for the spike to adopt:
tokens live in `assets/tokens.css` as CSS custom properties (lift verbatim
into a Next.js/Tailwind theme), pages are semantic HTML with one `h1` each,
and data is plain JSON (`data/chapters.json`, `data/chapter-details.json`,
`release.json`). No build step, no framework lock-in, no hotlinked assets.

## What is in here

- `index.html` — homepage: identity + value proposition, search entry,
  five master domains, seven-domain explorer (proposed), featured topics,
  learning-path entry points, historical/industry-evolution entry points,
  relationship preview, provenance introduction, release badge.
- `library.html` — the full verified 57-chapter index grouped by the five
  master domains (the homepage links here; full chapter readers are WP3/WP4).
- `learning-paths.html`, `explorer.html` (preview only), `sources.html`,
  `about.html`, `search.html` (WP5 route contract), `themes.html`.
- Global navigation on every page: Home, Library, Learning Paths,
  System Explorer, Sources, About. **Labs is not in the navigation**
  (planned only, stated on About); **AI is not in the navigation**.
- Design references: header switcher + `?variant=a|b|c` + `?mode=dark`
  re-skins every page. **A is the preview default; the final theme is the
  owner's call — none is declared here.**
  - A: navy `#10233F`, blue `#2563EB`, teal `#0D9488`, canvas `#F8FAFC`,
    text `#1E293B`; Inter/Geist UI + Source Serif 4 + JetBrains Mono,
    with C's long-form reading qualities (measure, serif headings).
  - B: V1 evolution — dark `#0c2030` header, paper gradient, teal `#075f70`.
  - C: editorial paper, serif-forward.
  Fonts are local stacks (named families render when installed); no webfont
  is downloaded or hotlinked.
- `vercel.json` — clean-URL rewrites (`/library` → `/library.html`, etc.)
  for the files-API staging deploy. No production use.
- `assets/original-notes/` — 3 sample scans from “From silicon to a working
  NIC”, local copies, byte-identical to the phone content archive
  (verified by SHA-256 + size against the archive files).

## Honesty rules applied

- Every chapter title, count, domain and source comes from the consolidated
  master (`data/chapters.json` + `release.json`, release
  `v1-consolidated-001`, version `1.0.0-continuing`, 57 chapters, 136 images,
  22 diagrams, 48 tables, SHA-256 `970489efd3899d29`). The generator
  (`~/workspace/atlas-wp2/build.py` in the agent workspace, not in the repo)
  asserts every curated slug resolves and every related link resolves
  (132 related links, 0 unresolved).
- The seven-domain grouping is **proposed, pending owner approval** — no
  chapter mapping and no counts are shown for it.
- Learning-path names are navigation labels only, never chapters. The mockup
  title “How the Internet Actually Works” appears nowhere as a chapter.
- Search: homepage submits `GET search.html?q=…`. Full search is WP5; until
  then `search.html` matches chapter titles only and says so.
- Missing fields show as missing (“0 images recorded”, “Source: not recorded”).
- The unverified number “83 chapters” appears nowhere.
- Privacy-excluded items and former-employer records never appear.

## Known caveat (flagged, not hidden)

For the three sample original-note images, the SHA-256 recorded in the
chapter JSON's `original_notes` entries does **not** match the files' actual
SHA-256, although the files match the archive byte-for-byte. No checksum is
claimed for these images on the site; the content audit should re-check
those recorded hashes. See `sources.html`.

## Responsive / accessibility / SEO

- Mobile-first CSS; grids use `minmax(min(100%, …), 1fr)`; images/SVG
  `max-width: 100%`; no fixed-width element above 320 px (static audit — see
  report; live-browser viewport rendering was not available in the build
  session and is owed by the coordinator before the gate).
- Sticky header, drawer navigation below 768 px (`aria-expanded`, keyboard
  focus visible), skip link, semantic landmarks, one `h1` per page, alt text
  on all images, unique title/description/canonical per page.

## Regenerating

Edit `build.py` / `assets-src/` in the agent workspace and re-run
`python3 ~/workspace/atlas-wp2/build.py`. The repo copy is the built output;
do not hand-edit generated pages without regenerating, or titles/counts
will drift from the master.
