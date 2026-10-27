# Atlas Batch 1 — Token-based design system (framework-agnostic)

**Status: PROPOSED. Final theme remains the owner's call; no theme is declared final here.**

**Machine-readable tokens:** `design-tokens.json` in this folder (same values; this document is the human-readable record with the verification evidence). The JSON is framework-agnostic: it names colours, type stacks, spacing, radii and component rules without committing to Next.js, Tailwind, or any other framework. That decision belongs to the WP0 framework spike, which this package explicitly does not wait for and does not prejudge.

**Direction (refined): Alternative A foundation WITH Alternative C long-form reading qualities.** In practice: the brief's navy/blue/teal palette and light-default + dark-mode structure, plus editorial's paper-canvas calm, serif long-form article text, generous 1.7 leading, quiet border-defined cards, and labelled provenance panels. The intended feel is a serious research publication combined with an interactive engineering laboratory — not a generic blog, course marketplace, or documentation template. (That sentence is direction only; no copy is taken from any brief.)

## Alternative A — brief tokens (the foundation in `design-tokens.json`)

- **Light (default):** navy `#10233F`, blue `#2563EB`, teal `#0D9488`, canvas `#F8FAFC`, text `#1E293B`.
- **Dark:** background `#0F172A`, surface `#1E293B`, ink `#E2E8F0`, muted `#94A3B8`, blue-light `#60A5FA`, teal-light `#2DD4BF`.
- **Type:** Inter/Geist UI + Source Serif 4 long-form + JetBrains Mono code. Stacks are named, not bundled, here: implementation must self-host any non-system font locally in the repo (never hotlink) or fall back down the stack.
- **Layout:** content max-width 1150px, article measure 720px (inside the brief's 720–800px range), sidebar 240px (see the sidebar note below), header height 75px, mobile breakpoint 800px.

### Verified contrast pairs (WCAG 2.2 relative luminance, computed 2026-10-27)

AA normal text needs ≥ 4.5:1; AA large text / UI components need ≥ 3:1.

| Pair | Ratio | Verdict |
|---|---|---|
| Light text `#1E293B` on canvas `#F8FAFC` | 13.98:1 | AA pass (also AAA) |
| Light text `#1E293B` on white | 14.63:1 | AA pass (also AAA) |
| Light navy `#10233F` on canvas `#F8FAFC` | 15.04:1 | AA pass (also AAA) |
| Light muted `#475569` on canvas `#F8FAFC` | 7.24:1 | AA pass |
| Light muted `#475569` on raised `#F1F5F9` | 6.92:1 | AA pass |
| Light ink `#1E293B` on raised `#F1F5F9` | 13.35:1 | AA pass |
| Light blue `#2563EB` on canvas `#F8FAFC` | 4.94:1 | AA pass (normal text) |
| Light blue `#2563EB` on white | 5.17:1 | AA pass |
| White on light blue `#2563EB` (button label) | 5.17:1 | AA pass |
| Light blue-hover `#1D4ED8` on canvas | 6.41:1 | AA pass |
| White on `#1D4ED8` (button label) | 6.70:1 | AA pass |
| Light teal-text `#0F766E` on canvas `#F8FAFC` | 5.23:1 | AA pass |
| Light teal-text `#0F766E` on white | 5.47:1 | AA pass |
| White on teal-text `#0F766E` | 5.47:1 | AA pass |
| V1 teal `#075F70` on canvas / on white | 6.97:1 / 7.29:1 | AA pass |
| Provenance ink `#175D9C` on panel `#EDF5FF` / on canvas | 6.20:1 / 6.51:1 | AA pass |
| Dark ink `#E2E8F0` on dark bg `#0F172A` | 14.48:1 | AA pass |
| Dark ink `#E2E8F0` on dark surface `#1E293B` | 11.87:1 | AA pass |
| Dark ink `#E2E8F0` on dark raised `#273449` | 10.18:1 | AA pass |
| Dark muted `#94A3B8` on dark bg `#0F172A` | 6.96:1 | AA pass |
| Dark muted `#94A3B8` on dark surface `#1E293B` | 5.71:1 | AA pass |
| Dark muted `#94A3B8` on dark raised `#273449` | 4.89:1 | AA pass |
| Dark blue `#60A5FA` on dark bg `#0F172A` | 7.02:1 | AA pass |
| Dark blue `#60A5FA` on dark surface `#1E293B` | 5.75:1 | AA pass |
| Dark teal `#2DD4BF` on dark bg `#0F172A` | 9.59:1 | AA pass |
| Dark teal `#2DD4BF` on dark surface `#1E293B` | 7.86:1 | AA pass |
| Dark text `#0F172A` on dark teal `#2DD4BF` (button) | 9.59:1 | AA pass |
| Focus blue `#2563EB` on canvas (UI component) | 4.94:1 | Passes 3:1 UI-component bar |
| Focus blue-light `#60A5FA` on dark bg (UI component) | 7.02:1 | Passes 3:1 UI-component bar |

### FAILED pairs — the one brief token that does not pass, and how the system handles it

| Pair | Ratio | Verdict |
|---|---|---|
| Brief teal `#0D9488` on canvas `#F8FAFC` (normal text) | 3.58:1 | **AA FAIL** (passes large-text 3:1 only) |
| Brief teal `#0D9488` on white (normal text) | 3.74:1 | **AA FAIL** (passes large-text 3:1 only) |
| White on brief teal `#0D9488` (button label) | 3.74:1 | **AA FAIL** (passes large-text 3:1 only) |

**Consequence (a token rule, not a footnote):** `#0D9488` is restricted to large text (≥ 18.66px bold or ≥ 24px), decorative elements, borders, and icons. It must never be used for body text, links, or button labels. Teal body text and links use `#0F766E` (5.23:1, pass); teal buttons in light mode use white on `#0F766E` (5.47:1) or on the V1 teal `#075F70` (7.29:1); teal buttons in dark mode use dark text `#0F172A` on `#2DD4BF` (9.59:1). The brief token is therefore kept as a brand/decorative colour, and the text-safe teal is a derived token recorded as such — the brief value itself was not silently darkened and re-labelled as the brief value.

### Explicitly unverified / restricted (do not use for body text until checked)

- **Alternative B paper-gradient stops:** not recovered in this pass (see below) — flagged, not guessed.
- **Border colours** (`#CBD5E1` light, `#334155` dark, provenance border golds `#C28D3E` / `#C18D35` / `#42A987`): borders and left-border accents only. As text they fail AA (gold accents measure 2.62–2.80:1); panel text always uses ink/muted/accent tokens.
- **No per-domain colours** are assigned: inventing seven domain colours now would create an unapproved legend. Domain colour, if wanted, is a separate proposed + contrast-checked + approved decision.
- **Dark-mode completeness** beyond the pairs above (e.g. code-block syntax colours, diagram palettes in dark mode) is not claimed verified; an implementation must check each dark surface it actually renders.

## Alternative B — V1 evolution (documented, not built here)

Keep the live identity — dark `#0c2030` header, paper gradient, teal `#075f70` — and modernise it (reader chrome, tokens, mobile drawer/strip, dark/light polish). Evidence for it: `#0c2030` on canvas measures 15.87:1 and `#075f70` measures 6.97:1 on canvas / 7.29:1 on white (both AA pass), so the V1 teal is actually the more text-safe teal of the two palettes. Case for it: continuity with the identity the owner already uses. Case against it: the briefs call V1 a redesign-from, not a tweak, so an evolution must still read as a deliberate step forward. **Open item:** the exact paper-gradient stops were not recovered from the reference prototypes in this pass; they must be sampled from the live V1 CSS at implementation time, not guessed here. (Live production was not changed to obtain this; the sampling is a future read-only step.)

## Alternative C — editorial paper (documented; its reading qualities are adopted into A)

Light paper `#FAF8F2`, surface `#FFFEFA`, ink `#26342F`, muted `#63726B`, line `#DDDCD3`, accent `#176B58`, hero `#E7EEE6` — the editorial prototype's own values, verified: ink on paper 12.25:1, accent on paper 6.03:1, muted on paper 4.77:1 (all AA pass). Case for it: the best long-form reading feel of the three. Case against it as a whole theme: weakest for interactive/Explorer surfaces, which would need a companion component style. What this package takes from C into A (not the whole palette): serif long-form article text, 1.7 leading, 720px article measure, quiet border-defined cards (no drop shadows), paper-toned original-image backgrounds (`#F4EFE5`, contain fit, 580px max height), and the labelled provenance-panel language. What it does not take: the paper palette as the theme, or the editorial prototype's provisional chapter mappings (its README states those mappings are provisional and no full exact transcription is claimed).

## Shared skeleton carried from the reference prototypes (evidence, not preference)

All three reference designs share one skeleton, and the token file encodes it:

- Sticky header (75px), brand + a sources/originals action.
- 240px sidebar switcher (sticky, scrollable) → horizontal strip below 800px. The brief plan's 260–280px collapsible range is recorded in `design-tokens.json` as an open implementation option; 240px is the token because it is the width proven in every prototype. Changing it later is a one-token change.
- Step flows: bordered steps, max-width 760px, centred accent connector between steps.
- Labelled provenance panels: Original (gold left border) / Enhancement/Added (blue) / Diagram (green) / Verification (amber) — with the rule that added material is always labelled and original scans are reproduced unchanged.
- Sources grid: 160px-minimum columns, 210px images on paper backgrounds, captions.
- Cards/panels: 15px radius, 20px padding, 1px border, no drop shadow; hero 22px radius, 30px padding; eyebrow labels 11px, uppercase, letter-spaced.
- Hybrid's two sentences are carried as design principles, not copy to paste: "Read as a story, inspect as an engineer" (story-first reading with an engineering-inspection layer) and "What is original, and what is added?" (the provenance question every reader surface must answer visibly).
- Root prototype's path chooser ("Choose your learning path") is carried as the learning-path pattern: a chooser over real chapters, never mockup titles as chapters.

## What is not in this package

- No font files, no images, no chapter content, no page code, no framework choice. Tokens only.
- No dark-mode screenshot or rendered preview: tokens were verified arithmetically (contrast ratios), not visually. A rendered token sheet on staging is still owed before the owner approves a theme.
- No claim that WCAG 2.2 AA is fully met by the future site: contrast is one AA input. Keyboard navigation, focus visibility, semantics, and non-text contrast still need the implementation pass.
