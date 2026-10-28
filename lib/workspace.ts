// Browser-local research workspace: pure helpers with NO DOM dependency,
// so the export/import logic is unit-testable without a browser.
// Storage keys (browser localStorage only; nothing is transmitted):
//   atlas-v2-bookmarks        — section bookmarks [{slug, anchor, heading}]
//                               (written by the Reader; read here)
//   atlas-v2-reading-progress — per-chapter max scroll depth
//                               [{slug: {percent, updatedAt}}]
// The workspace page manages ONLY these two keys. Reader display prefs
// (atlas-v2-reader-prefs), the theme choice (atlas-theme), and correction
// drafts (atlas-v2-correction-draft) are separate stores with their own
// controls and are NEVER cleared by workspace delete-all.

export const WORKSPACE_FORMAT = "atlas-v2-workspace";
export const WORKSPACE_VERSION = 1;

export type WorkspaceBookmark = {
  slug: string;
  anchor: string;
  heading: string;
};

export type ProgressEntry = {
  percent: number;
  updatedAt: string;
};

export type WorkspaceData = {
  bookmarks: WorkspaceBookmark[];
  progress: Record<string, ProgressEntry>;
};

export type WorkspaceExportFile = {
  format: typeof WORKSPACE_FORMAT;
  version: typeof WORKSPACE_VERSION;
  exportedAt: string;
  bookmarks: WorkspaceBookmark[];
  progress: Record<string, ProgressEntry>;
};

export function buildWorkspaceExport(
  data: WorkspaceData,
  exportedAt: string,
): string {
  const file: WorkspaceExportFile = {
    format: WORKSPACE_FORMAT,
    version: WORKSPACE_VERSION,
    exportedAt,
    bookmarks: data.bookmarks,
    progress: data.progress,
  };
  return JSON.stringify(file, null, 2);
}

export type ParsedExport = {
  data: WorkspaceData;
  skippedBookmarks: number;
  skippedProgress: number;
};

// Strict at the top level, lenient per entry: a file with the wrong format
// or version, unparseable JSON, or a non-array bookmarks / non-object
// progress field is rejected whole (it is not a workspace export at all).
// A malformed single entry is skipped and counted, so one bad entry never
// destroys an otherwise valid export.
export function parseWorkspaceExport(text: string): (
  | { ok: true; parsed: ParsedExport }
  | { ok: false; error: string }
) {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "File is not a workspace export object." };
  }
  const obj = raw as Record<string, unknown>;
  if (obj.format !== WORKSPACE_FORMAT) {
    return { ok: false, error: "File format is not atlas-v2-workspace." };
  }
  if (obj.version !== WORKSPACE_VERSION) {
    return { ok: false, error: "File version is not 1." };
  }
  if (!Array.isArray(obj.bookmarks)) {
    return { ok: false, error: "File bookmarks field is not an array." };
  }
  if (!obj.progress || typeof obj.progress !== "object" || Array.isArray(obj.progress)) {
    return { ok: false, error: "File progress field is not an object." };
  }
  const bookmarks: WorkspaceBookmark[] = [];
  let skippedBookmarks = 0;
  for (const b of obj.bookmarks) {
    if (
      b && typeof b === "object" && !Array.isArray(b) &&
      typeof (b as Record<string, unknown>).slug === "string" &&
      (b as Record<string, unknown>).slug !== "" &&
      typeof (b as Record<string, unknown>).anchor === "string" &&
      (b as Record<string, unknown>).anchor !== "" &&
      typeof (b as Record<string, unknown>).heading === "string"
    ) {
      const rec = b as Record<string, unknown>;
      bookmarks.push({
        slug: rec.slug as string,
        anchor: rec.anchor as string,
        heading: rec.heading as string,
      });
    } else {
      skippedBookmarks += 1;
    }
  }
  const progress: Record<string, ProgressEntry> = {};
  let skippedProgress = 0;
  for (const [slug, entry] of Object.entries(obj.progress as Record<string, unknown>)) {
    if (
      entry && typeof entry === "object" && !Array.isArray(entry) &&
      typeof (entry as Record<string, unknown>).percent === "number" &&
      Number.isInteger((entry as Record<string, unknown>).percent) &&
      (entry as Record<string, unknown>).percent as number >= 0 &&
      (entry as Record<string, unknown>).percent as number <= 100 &&
      typeof (entry as Record<string, unknown>).updatedAt === "string"
    ) {
      const rec = entry as Record<string, unknown>;
      progress[slug] = {
        percent: rec.percent as number,
        updatedAt: rec.updatedAt as string,
      };
    } else {
      skippedProgress += 1;
    }
  }
  return { ok: true, parsed: { data: { bookmarks, progress }, skippedBookmarks, skippedProgress } };
}

// Import resolution against the canonical slug set. A bookmark is kept
// only if its slug is a canonical chapter slug; its heading is kept as
// exported (the export is the visitor's own file; a stale heading is
// display text only, and the link still lands on the chapter). A progress
// entry is kept only for a canonical slug. Unknown slugs are skipped and
// counted, never invented into chapters.
export function resolveImport(
  parsed: ParsedExport,
  validSlugs: ReadonlySet<string>,
): {
  bookmarks: WorkspaceBookmark[];
  progress: Record<string, ProgressEntry>;
  skippedBookmarks: number;
  skippedProgress: number;
} {
  const bookmarks: WorkspaceBookmark[] = [];
  let skippedBookmarks = parsed.skippedBookmarks;
  for (const b of parsed.data.bookmarks) {
    if (validSlugs.has(b.slug)) bookmarks.push(b);
    else skippedBookmarks += 1;
  }
  const progress: Record<string, ProgressEntry> = {};
  let skippedProgress = parsed.skippedProgress;
  for (const [slug, entry] of Object.entries(parsed.data.progress)) {
    if (validSlugs.has(slug)) progress[slug] = entry;
    else skippedProgress += 1;
  }
  return { bookmarks, progress, skippedBookmarks, skippedProgress };
}

// Merge rule (documented on the workspace page): bookmarks union by
// (slug, anchor) — existing entries win on conflict; progress takes the
// MAXIMUM percent per slug, because progress records the furthest scroll
// depth reached, and an older export must not rewind it.
export function mergeWorkspace(
  current: WorkspaceData,
  imported: { bookmarks: WorkspaceBookmark[]; progress: Record<string, ProgressEntry> },
): { merged: WorkspaceData; addedBookmarks: number; progressUpdated: number } {
  const seen = new Set(current.bookmarks.map((b) => `${b.slug}#${b.anchor}`));
  const bookmarks = [...current.bookmarks];
  let addedBookmarks = 0;
  for (const b of imported.bookmarks) {
    const key = `${b.slug}#${b.anchor}`;
    if (!seen.has(key)) {
      seen.add(key);
      bookmarks.push(b);
      addedBookmarks += 1;
    }
  }
  const progress: Record<string, ProgressEntry> = { ...current.progress };
  let progressUpdated = 0;
  for (const [slug, entry] of Object.entries(imported.progress)) {
    const prev = progress[slug]?.percent ?? -1;
    if (entry.percent > prev) {
      progress[slug] = entry;
      progressUpdated += 1;
    }
  }
  return { merged: { bookmarks, progress }, addedBookmarks, progressUpdated };
}
