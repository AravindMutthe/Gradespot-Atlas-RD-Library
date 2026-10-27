# Atlas Batch 1 — Work-package notes (content extraction + seven-domain mapping + design tokens)

**Branch:** `feat/atlas-platform-v2` (from `main`, see commit record in the delivery report).
**Scope of this package only:** content extraction, seven-domain mapping, and a framework-agnostic token-based design system. It does **not** wait for, prejudge, or replace the WP0 framework spike, and it builds no pages, no search index, no Explorer, and no staging deploy.

## Standing rules honoured (and how each was checked)

- **Production unchanged:** no production deploy, no merge to `main`. This branch is docs-only (`docs/batch1/`); it touches no existing site file, no app code, and no deployment configuration.
- **No content-repo changes:** phone `~/atlas-content/` was read only (tar streamed over SSH; nothing written back). The phone Atlas archive `/storage/emulated/0/Atlas` was read only (head/grep/hash commands; nothing moved, deleted, or committed there).
- **No portfolio / GradeSpot changes:** nothing in this package touches either.
- **No sensitive records:** the 2 privacy-excluded internship/onboarding items and the 4 former-employer records appear nowhere in this package — not as content, not as titles, not as summaries. (They are recorded here only as counts, because the task names the exclusion; no detail about them is included.)
- **No archive deletion or git-history rewrite:** none performed anywhere.
- **JSON as source of truth:** no MDX migration, no content rewrite. The inventory and mapping are derived artifacts, not new content.

## Design decisions + rationale

### 1. Inventory: report the file, not a cleaned-up version of it

- Counts come from the chapter JSON fields, cross-checked three ways: chapter `paragraph_count` vs sum of block paragraphs vs manifest counts — all agree for all 57 chapters (1,040 paragraphs, 187 image references, 22 diagrams, 48 tables). The one disagreement found (release arithmetic 733 + 283 = 1,016 vs chapter total 1,040) is reported as an open gap, not resolved by redefinition.
- Chapter `diagrams[]` and `tables[]` are lists in the files and integers in the manifest; the inventory treats list length as the count. An earlier naive pass that summed the fields as integers would have crashed/miscounted — this is recorded so a later implementer does not repeat it.
- Related chapters: the inventory reports `related_concepts[]` as found. 29 chapters have an empty list. That is a **missing-data finding for the reader work** (related links cannot be shown on those chapters until the data exists), not a reason to invent links. The 132 existing related entries all resolve to real slugs.
- Original notes: filename is the link key (136/136 filename-set match between `illustrations[]` and `original_notes[]`), but SHA verification is explicitly **not** claimed (standing finding: 0/136 SHA matches against stored files). Any reader UI built from this package must show filename + stored SHA labelled as stored, never as verified.

### 2. Mapping: one primary domain per chapter, subject over default, flags over force-fits

- The domain-level defaults were followed where the subject supports them (all 10 hardware chapters → Computing and Hardware; most infrastructure chapters → Networks and Infrastructure).
- Where subject evidence departs from the default, the row departs and says so: the two OS-kernel chapters and the computers-and-OS chapter move to Computing and Hardware; the Web-eras chapter moves to Evolution and History; the scheduling chapter moves to Ecosystems and Relationships (the pure-operations case the brief names). Each such row is flagged AMBIGUOUS so the owner sees the departure, not just the result.
- Systems-evolution was the hardest current domain: its numbered chapters (19, 20, 21) and the knowledge-map/source-gallery chapters are not era narratives, but the brief's default sends them to Evolution and History. They are proposed there and flagged, with the two hardest cases (`source-photographs`, `21-conversations…`) given explicit owner options in the mapping document — including the option of no single domain (Sources home / cross-reference only). Dropping either chapter from the library to make the taxonomy tidy would be a worse outcome than an honest flag, so neither is dropped.
- Thin domains are reported, not padded: Economics and Markets (2) and Industries and Sectors (2). Padding them by re-labelling ecosystem chapters would misdescribe the content. If the owner wants fuller shelves, that is new-research work, not a labelling decision.
- Identifier preservation is structural, not aspirational: the mapping artifact contains no URL changes, and the mapping document states the redirect-map precondition for any future domain-prefixed routes.

### 3. Tokens: Alternative A foundation + Alternative C reading qualities; teal handled by rule, not by hope

- The single most important token finding is that the brief's teal `#0D9488` fails AA for normal text (3.58:1 on canvas, 3.74:1 on white; white on it also 3.74:1). A design system that used it for links or buttons would ship an accessibility defect on day one. The system therefore restricts `#0D9488` to large text/decoration and supplies a verified text teal (`#0F766E`, 5.23:1), recorded as derived — the brief value is not rewritten and re-labelled as the brief value.
- Alternative B's paper-gradient stops are flagged unverified rather than approximated: the prototypes do not contain them (blueprint/editorial/hybrid use flat paper/dark backgrounds), and guessing gradient stops would create a false "V1 evolution" reference.
- Sidebar 240px (prototype-proven) vs the brief plan's 260–280px: the token takes the proven value and records the plan's range as an open option. This is a one-token change later either way; what matters is that the choice is visible.
- No domain colours, no font files, no shadows: each absence is a deliberate non-invention. Shadows in particular are absent because the prototype language is border-defined; adding them later must go through the token file first.
- Contrast verification here is arithmetic (WCAG luminance), not a rendered check. A rendered token sheet is still owed before theme approval.

### 4. Reference designs: what was actually verified on the phone

- `aravind-library-two-designs/blueprint/` (dark: bg `#080F1b`, ink `#E7F2FF`, accent `#6DD5E8`) and `.../editorial/` (paper: bg `#FAF8F2`, ink `#26342F`, accent `#176B58`) share the identical skeleton and differ (in the sampled head/CSS) essentially in palette tokens — the editorial README describes it as a re-skin; both READMEs warn that chapter mappings are provisional and no full exact transcription is claimed. Neither README's warning is overridden anywhere in this package.
- `aravind-systems-atlas-hybrid-final/aravind-systems-atlas-hybrid/` (43KB index + external originals) carries the hybrid editorial conventions (original / enhancement / diagram / verification labels) and the two principle sentences. Its README states it is a private review prototype, not a publication-ready research edition.
- **Mobile-fixed is NOT a separate design (verified by hash):** the mobile-fixed zip's `index.html` (32,609,800 bytes, SHA-256 `795dbdbb2ae40a352f444dc4fb8986888220ff5f16e4e7c12858c420f5ee30c3`) is byte-identical to the root `aravind-systems-atlas-hybrid-self-contained.html` (same size, same SHA-256). It is counted once, as the self-contained hybrid, in every design reference in this package. Note the distinction: the hybrid-final *folder* index (43KB, external originals) is a different file from the self-contained single file; only the self-contained file equals mobile-fixed.
- Root `index.html` (learning-path chooser prototype): heading "Choose your learning path" confirmed present; its chapter cards are prototype sample titles, **not** master chapters, and are treated here only as a chooser pattern — no prototype title is carried into the inventory or mapping.

## Files in this package (all under `docs/batch1/` on this branch)

| File | Contents |
|---|---|
| `content-inventory-57.md` | Human-readable inventory: method, SHA caveat, domain counts, all 57 chapters, verbatim file notes, special cases |
| `content-inventory-57.json` | Machine-readable companion: per-chapter headings, illustration/original-note filenames, related slugs, industry titles |
| `seven-domain-mapping.md` | 57-row mapping table (PROPOSED, pending owner approval), counts, 16 ambiguous + 12 borderline rows, thin-domain warning |
| `seven-domain-mapping.json` | Machine-readable mapping (same 57 rows) |
| `design-tokens.json` | Framework-agnostic tokens: light + dark colour, type, spacing, radius, components, layout, Alternatives B/C as data |
| `design-tokens.md` | Token documentation with the full verified/failed contrast table and the Alternatives B/C comparison |
| `NOTES.md` | This file |

## Outstanding issues / risks (owner-visible, not buried)

1. **Mapping approval gate:** the seven-domain table is proposed only. Migration must not proceed on it until the owner rules on the 16 ambiguous rows (above all `source-photographs` and `21-conversations…`) and confirms the thin Economics/Industries shelves are acceptable.
2. **Paragraph-count gap:** chapter total 1,040 vs release arithmetic 1,016 (24 paragraphs). Unresolved; a later reconciliation pass must explain it before any UI quotes a single "total paragraphs" figure.
3. **Original-note SHA:** 0/136 matches (standing finding, re-stated not re-verified here — image bytes were not re-hashed in this pass because the image tar truncated over SSH; see checks below). No SHA-verified original-note link may be claimed until a re-hash pass completes.
4. **Missing related links:** 29 chapters have empty `related_concepts[]`. The reader's related-links requirement cannot be met for those chapters from current data.
5. **Theme not approved:** no theme (A/B/C) is final. A rendered token sheet on staging is still owed; contrast arithmetic alone does not approve a theme.
6. **Fonts not bundled:** Inter/Geist/Source Serif 4/JetBrains Mono are named stacks only. Implementation must self-host locally or fall back; hotlinking would break the local-only rule.
7. **Alt-B gradient unverified:** V1 paper-gradient stops still to be sampled read-only from live V1 CSS if Alternative B is pursued.
8. **Image transfer truncation (process note):** the first phone tar (chapters + manifests + assets, ~36MB) truncated with a broken pipe over SSH; the chapters+manifests tar (208KB) transferred cleanly and was verified by count (63 files: 57 chapters + 6 manifests). Image bytes were therefore not re-hashed in this pass — which is why the SHA finding is re-stated from the standing audit rather than re-claimed as a fresh measurement.
9. **Repo visibility note:** the task brief describes the website repo as private; the GitHub API response for `AravindMutthe/aravind-systems-atlas` (id 1434868891) reports `"private": false`. This package changed nothing about visibility and makes no claim about which record is current — the owner may wish to confirm the intended visibility. Branch work proceeded regardless, since branch creation does not depend on it.

## Next actions (for the parent orchestrator, not taken here)

1. Owner review of `seven-domain-mapping.md` (16 ambiguous rows) + theme direction (A-foundation vs B vs C) — both are approval gates, not defaults.
2. WP0 framework spike (separate package) before any page building; these tokens are written to survive either spike outcome.
3. Later passes (not this package): original-note SHA re-hash; related-links completion for the 29 empty chapters; paragraph-count reconciliation (24); rendered token sheet; staging build.
