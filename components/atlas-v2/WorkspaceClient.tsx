"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  buildWorkspaceExport,
  mergeWorkspace,
  parseWorkspaceExport,
  resolveImport,
  type ProgressEntry,
  type WorkspaceBookmark,
  type WorkspaceData,
} from "@/lib/workspace";

const BOOKMARKS_KEY = "atlas-v2-bookmarks";
const PROGRESS_KEY = "atlas-v2-reading-progress";

function readJson(key: string): unknown {
  try {
    const v = window.localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function readBookmarks(): WorkspaceBookmark[] {
  const raw = readJson(BOOKMARKS_KEY);
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (b): b is WorkspaceBookmark =>
      !!b &&
      typeof b === "object" &&
      typeof (b as { slug?: unknown }).slug === "string" &&
      typeof (b as { anchor?: unknown }).anchor === "string" &&
      typeof (b as { heading?: unknown }).heading === "string",
  );
}

function readProgress(): Record<string, ProgressEntry> {
  const raw = readJson(PROGRESS_KEY);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, ProgressEntry> = {};
  for (const [slug, entry] of Object.entries(raw as Record<string, unknown>)) {
    if (
      entry &&
      typeof entry === "object" &&
      typeof (entry as { percent?: unknown }).percent === "number" &&
      typeof (entry as { updatedAt?: unknown }).updatedAt === "string"
    ) {
      out[slug] = {
        percent: (entry as { percent: number }).percent,
        updatedAt: (entry as { updatedAt: string }).updatedAt,
      };
    }
  }
  return out;
}

// Mounted-only rendering (like ChapterSearch): without JavaScript there is
// no workspace list to show, so the server shell carries a noscript note
// instead of a dead list. Nothing here is transmitted anywhere: export is a
// local file download, import reads a local file you choose.
export default function WorkspaceClient({
  validSlugs,
  titles,
}: {
  validSlugs: string[];
  titles: Record<string, string>;
}) {
  const [mounted, setMounted] = useState(false);
  const [bookmarks, setBookmarks] = useState<WorkspaceBookmark[]>([]);
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({});
  const [message, setMessage] = useState("");
  const [storageFailed, setStorageFailed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBookmarks(readBookmarks());
    setProgress(readProgress());
    setMounted(true);
  }, []);

  const saveBookmarks = (next: WorkspaceBookmark[]) => {
    setBookmarks(next);
    if (!writeJson(BOOKMARKS_KEY, next)) setStorageFailed(true);
  };

  const saveProgress = (next: Record<string, ProgressEntry>) => {
    setProgress(next);
    if (!writeJson(PROGRESS_KEY, next)) setStorageFailed(true);
  };

  const removeBookmark = (slug: string, anchor: string) => {
    saveBookmarks(bookmarks.filter((b) => !(b.slug === slug && b.anchor === anchor)));
    setMessage("Bookmark removed.");
  };

  const removeProgress = (slug: string) => {
    const next = { ...progress };
    delete next[slug];
    saveProgress(next);
    setMessage("Reading progress entry removed.");
  };

  const exportAll = () => {
    const data: WorkspaceData = { bookmarks, progress };
    const blob = new Blob([buildWorkspaceExport(data, new Date().toISOString())], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atlas-v2-workspace.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage(
      `Exported ${bookmarks.length} bookmark${bookmarks.length === 1 ? "" : "s"} and ${Object.keys(progress).length} reading-progress ${Object.keys(progress).length === 1 ? "entry" : "entries"} as atlas-v2-workspace.json. The file stays on your device; nothing was uploaded.`,
    );
  };

  const importFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseWorkspaceExport(text);
    if (!parsed.ok) {
      setMessage(`Import failed: ${parsed.error} Nothing was changed.`);
      return;
    }
    const resolved = resolveImport(parsed.parsed, new Set(validSlugs));
    const { merged, addedBookmarks, progressUpdated } = mergeWorkspace(
      { bookmarks, progress },
      resolved,
    );
    saveBookmarks(merged.bookmarks);
    saveProgress(merged.progress);
    setMessage(
      `Import complete: ${addedBookmarks} new bookmark${addedBookmarks === 1 ? "" : "s"} added, ${progressUpdated} reading-progress ${progressUpdated === 1 ? "entry" : "entries"} updated, ${resolved.skippedBookmarks} bookmark${resolved.skippedBookmarks === 1 ? "" : "s"} skipped (unknown chapter or malformed), ${resolved.skippedProgress} progress ${resolved.skippedProgress === 1 ? "entry" : "entries"} skipped. Existing bookmarks were kept; progress keeps the furthest depth reached.`,
    );
  };

  const deleteAll = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      window.localStorage.removeItem(BOOKMARKS_KEY);
      window.localStorage.removeItem(PROGRESS_KEY);
    } catch {
      setStorageFailed(true);
      return;
    }
    setBookmarks([]);
    setProgress({});
    setConfirmDelete(false);
    setMessage(
      "All workspace data deleted: bookmarks and reading progress are gone. Reader display settings, the theme choice, and correction drafts were NOT cleared — they have their own controls.",
    );
  };

  if (!mounted) return null;

  const byChapter = new Map<string, WorkspaceBookmark[]>();
  for (const b of bookmarks) {
    const list = byChapter.get(b.slug) ?? [];
    list.push(b);
    byChapter.set(b.slug, list);
  }
  const progressSlugs = Object.keys(progress).sort();

  return (
    <div>
      {storageFailed ? (
        <p role="status">
          Browser storage is unavailable, so workspace changes will last only for this visit.
        </p>
      ) : null}
      {message ? (
        <p role="status" aria-live="polite">
          {message}
        </p>
      ) : null}

      <section aria-labelledby="workspace-bookmarks-heading">
        <h2 id="workspace-bookmarks-heading">
          Bookmarks ({bookmarks.length})
        </h2>
        {bookmarks.length === 0 ? (
          <p>
            No bookmarks yet. Open any chapter and use “Bookmark section” beside a section
            heading — bookmarks live only in this browser.
          </p>
        ) : (
          [...byChapter.entries()].map(([slug, list]) => (
            <div key={slug}>
              <h3>
                <Link href={`/${slug}/`}>{titles[slug] ?? slug}</Link>
              </h3>
              <ul>
                {list.map((b) => (
                  <li key={b.anchor}>
                    <Link href={`/${slug}/#${b.anchor}`}>{b.heading}</Link>{" "}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => removeBookmark(b.slug, b.anchor)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      <section aria-labelledby="workspace-progress-heading">
        <h2 id="workspace-progress-heading">
          Reading progress ({progressSlugs.length})
        </h2>
        <p>
          Progress is the furthest scroll depth reached in each chapter, saved as you read.
          It is a scroll-depth record, not a claim about what was understood.
        </p>
        {progressSlugs.length === 0 ? (
          <p>
            No reading progress yet. Open a chapter and scroll — progress saves when you pass
            each 5% step or reach 100%.
          </p>
        ) : (
          <ul>
            {progressSlugs.map((slug) => (
              <li key={slug}>
                <Link href={`/${slug}/`}>{titles[slug] ?? slug}</Link> —{" "}
                {progress[slug].percent}% reached
                <span>
                  {" "}
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => removeProgress(slug)}
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="workspace-transfer-heading">
        <h2 id="workspace-transfer-heading">Export, import, delete</h2>
        <p>
          <button type="button" className="btn" onClick={exportAll}>
            Export workspace as JSON
          </button>
        </p>
        <p>
          <label htmlFor="workspace-import">Import a workspace JSON file: </label>
          <input
            ref={fileRef}
            id="workspace-import"
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importFile(f);
              e.target.value = "";
            }}
          />
        </p>
        <p>
          Import keeps your existing bookmarks, adds new ones, and keeps the furthest reading
          depth per chapter. Entries for chapters that do not exist in this release are
          skipped, never invented into chapters.
        </p>
        <p>
          <button type="button" className="btn-secondary" onClick={deleteAll}>
            {confirmDelete
              ? "Confirm: delete all bookmarks and reading progress"
              : "Delete all workspace data"}
          </button>
        </p>
        <p>
          Delete-all clears bookmarks and reading progress only. It does not clear reader
          display settings, the theme choice, or correction drafts.
        </p>
      </section>
    </div>
  );
}
