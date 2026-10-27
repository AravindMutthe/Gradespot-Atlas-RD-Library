/**
 * Atlas public data contracts — typed schemas (DESIGN ONLY).
 *
 * Publication status: NOT PUBLISHED. This file is NOT imported by any
 * page, so it contributes no runtime code and no public JSON to the
 * static export. It exists so a future publication decision starts from
 * reviewed shapes instead of ad-hoc JSON. See contracts.md in this
 * directory for versioning, provenance, and static-export behavior.
 * Nothing here is a live API: no endpoint, no query handling, no auth.
 */

// ---------------------------------------------------------------------------
// Shared envelope: every emitted document carries both identities.
// schemaVersion = shape compatibility. contentRelease = content snapshot.
// The two are independent and must never be conflated.
// ---------------------------------------------------------------------------
export type DataProvenance = "canonical-chapter" | "editorial" | "proposed";

export interface DataDocumentBase {
  /** Shape compatibility version, e.g. "1.0". Breaking shape changes bump major. */
  schemaVersion: string;
  /** Content snapshot identity, e.g. "v1-consolidated-001" (from /release.json). */
  contentRelease: string;
  /** Build time (UTC ISO 8601) of the document generation. */
  generatedAt: string;
  /** Base URL that canonical URLs resolve against. */
  canonicalBase: string;
  /** Publication status — must read "published" only after an explicit decision. */
  publicationStatus: "draft-contract" | "published";
}

// ---------------------------------------------------------------------------
// /data/v1/manifest.json — release identifier + approved content inventory.
// ---------------------------------------------------------------------------
export interface DataManifest extends DataDocumentBase {
  atlas: "Aravind Systems Atlas";
  status: "research-edition";
  chapters: number;
  uniqueImages: number;
  diagrams: number;
  tables: number;
  /** Chapter slugs in canonical order. Every slug must resolve to a chapter page. */
  chapterSlugs: string[];
  /** Release manifest reference (already public at /release.json). */
  releaseManifest: "/release.json";
}

// ---------------------------------------------------------------------------
// /data/v1/chapters/{slug}.json — sanitized chapter data (OPTIONAL surface).
// Only if external machine-readable access is genuinely needed. Never
// includes note images, scans, transcriptions, or private identifiers.
// ---------------------------------------------------------------------------
export interface DataChapterBlock {
  heading: string;
  paragraphs: string[];
  provenance: DataProvenance;
}

export interface DataChapter extends DataDocumentBase {
  slug: string;
  title: string;
  canonicalUrl: string;
  /** Grouping/filter metadata only — never a URL segment. */
  sourceDomain: string;
  proposedDomain: string;
  blocks: DataChapterBlock[];
  /** Counts only — image files themselves are NOT embedded or linked here
      until their publication and privacy flags are cleared by the owner. */
  imageCount: number;
  diagramCount: number;
  tableCount: number;
  /** Chapter-level associations only — never paragraph verification. */
  relatedChapterSlugs: string[];
}

// ---------------------------------------------------------------------------
// /data/v1/relationships.json — approved relationships, sanitized.
// Typed edges only; no note provenance claims.
// ---------------------------------------------------------------------------
export type DataEdgeType = "prerequisite" | "data flows to" | "configured by" | "related";

export interface DataRelationship {
  from: string;
  to: string;
  type: DataEdgeType;
  /** Teaching order, prerequisite, configuration, or data flow — stated, never implied. */
  note: string;
  provenance: DataProvenance;
}

export interface DataRelationships extends DataDocumentBase {
  edges: DataRelationship[];
}

// ---------------------------------------------------------------------------
// /data/v1/learning-paths.json — approved learning paths.
// Every step must resolve to an existing canonical chapter slug.
// No invented steps, no mockup or example titles as chapters.
// ---------------------------------------------------------------------------
export interface DataPathStep {
  slug: string;
  /** Why this chapter belongs at this position in this path. */
  why: string;
}

export interface DataLearningPath {
  id: string;
  title: string;
  focus: string;
  steps: DataPathStep[];
}

export interface DataLearningPaths extends DataDocumentBase {
  paths: DataLearningPath[];
}
