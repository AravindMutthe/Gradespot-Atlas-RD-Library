# Atlas v2.0 — Dead-Input Dispositions (Phase 6)

Status: DECIDED 2026-10-28 under the delegated v2.0 mandate (design/technical
dispositions only; no content decision is made here). Nothing in this file
deletes anything: every disposition below is RETAIN unless it says LIVE.
A retained dead input must never be re-imported into a shipped page without
a fresh owner decision, and a retained dead input is never evidence that
its content is approved for publication.

## G-18 — preview3 data (`lib/preview3/`)

- `learning-paths.json` — **LIVE.** Imported by `app/learning-paths/page.tsx`.
  Re-verified in Phase 6: 5 paths, 34 steps, 25 distinct chapters, 6 reused
  chapters, every step slug canonical, steps render as title + link + "why"
  only (no chapter bodies duplicated onto the paths page).
- `chapter-titles.json` — **LIVE.** Imported by the same page for step titles.
- `explorer-nic-journey.json` — **DEAD, RETAINED.** Zero importers. The
  shipped Explorer is server-rendered anchor navigation from
  `lib/explorer-nic.ts` (+ Phase 4 review evidence), not this file.
- `sources.json` — **DEAD, RETAINED.** Zero importers. It stays dead because
  the Sources route is excluded from initial v2.0 scope (D-03) and its
  underlying assets were never reconciled (Phase 0: 187 missing branch
  assets + unresolved privacy). Re-importing it would re-open both gates.

## NicJourney (`components/explorer/NicJourney.tsx`)

**DEAD, RETAINED.** The component is defined but has zero importers; the
shipped Explorer does not use it. Retained as design history only.

## V1 fallback data (`components/atlas-v1-data.ts`)

**LIVE-IMPORTED, DEAD-BRANCH, RETAINED.** Imported by `app/[slug]/page.tsx`
for the V1 fallback branch, which is unreachable: all 57 canonical slugs
resolve through the v2 branch first (verified in Step 2; all 30 V1 slugs
coincide with canonical slugs). Verified in Phase 6: the string
"Systems Knowledge Atlas V1" occurs 0 times in the built export, so the
fallback renders nothing. It is kept so any future V1-only slug still gets
a canonical URL instead of none; it must not be extended.

## G-19 — GradeSpot strings (REFINED, not just "dead fallback")

Phase 0 recorded GradeSpot strings as "only in dead-code V1 fallback, never
rendered". Phase 6 measurement refines this: the built export contains 39
GradeSpot occurrences, and they are NOT the fallback leaking — they are the
canonical chapter `21-conversations-and-projects-recovered-knowledge-map`
whose v1-consolidated-001 master content legitimately discusses GradeSpot
architecture (its own provenance lines), plus the search-index entries
derived from that chapter, plus the chapter's RSC payload duplicate.
No other file in the export contains the string, and the fallback's
GradeSpot strings ship nowhere. The chapter content is baseline master
content, not a new case-study insertion (that insertion still awaits the
owner's naming/placement/evidence decisions). The clearance gate
(`scripts/clearance.js`) allowlists exactly those three files for this
string and fails on any other occurrence.

## proposedDomain (search index + domains map + Reader props)

**RETAINED as a schema field with documented non-display status.** The
field occurs once per chapter in `atlas-v2/search-index.json` (57/57) and
in `lib/atlas-v2/domains.ts` (`ATLAS_V2_DOMAIN_MAP`). Display status:
- USED, labelled, in the Reader lead paragraph only:
  "Proposed grouping (pending reconciliation): <value>".
- NOT used for search-result display (Phase 3) and NOT used for library
  grouping (Phase 2, G-05: library groups by the verified five-domain
  master only).
- The related-label logic branches on verified-domain agreement
  (468/586 pairs share a verified domain; 118 mismatched are labelled as
  proposed-grouping, never "same verified domain").
Consequences of removing the field: the Reader lead paragraph and the
related-label mismatch wording would need rework, and the reconciliation
audit trail (which proposed grouping each chapter was filed under) would
be lost. Removal is therefore a future reconciliation decision, not a
cleanup step.

## `ATLAS_V2_DOMAINS` (seven proposed labels, `lib/atlas-v2/domains.ts`)

**UNUSED REFERENCE DATA, RETAINED.** The seven-label array has zero
importers outside its own file; the live data is the per-slug MAP, not the
array. The array is kept as the proposed-label vocabulary for the future
taxonomy-reconciliation pass (owner decision). It must never be used for
grouping display until that reconciliation lands; the library's grouping
banner still says "configurable / pending reconciliation", committing to
neither five nor seven.

## DES-03 editorial descriptions

**RECORDED HONESTLY, NOT INVENTED.** `app/[slug]/page.tsx` `generateMetadata`
uses an editorial description for exactly one chapter (NIC,
`NIC_EDITORIAL_DESCRIPTION`); the other 56 chapters use the first paragraph
sliced to 160 characters. Those 56 descriptions are auto-slices, not
editorial copy, and are reported as such. Writing 56 editorial descriptions
without source text would be fabrication; real editorial descriptions are
future editorial work, not a Phase 6 cleanup.

## Contract design (`lib/data-v1/schemas.ts`)

**DESIGN ONLY, NOT A PUBLICATION.** The file documents the proposed
`/data/v1/*` contracts. Verified in Phase 6: no `data/` directory exists in
the built export and no page links to `/data/v1/*`. Contract publication
remains its own owner-gated decision.

## Never-regenerate rule (restated)

`scripts/atlas-v2/generate-data.py` must NEVER be re-run from the content
master: it would revert the owner-authorized G-01, sibling, and eleven
corrections in `chapters.ts`. Master correction + a new tagged release is
a separate owner decision. `scripts/preview3-*.py` and
`scripts/atlas-v2/checks.py` are audit tooling, not build inputs, and are
not shipped.
