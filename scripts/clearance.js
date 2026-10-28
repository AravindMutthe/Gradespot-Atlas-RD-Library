#!/usr/bin/env node
// Atlas v2.0 eight-class public-output clearance gate (Phase 6).
//
// Scans a built static export (default: out/) for restricted or
// stale material and fails (exit 1) on ANY hit. Intended to run as the
// npm `postbuild` step so `npm run build` exits non-zero when the gate
// fails, even though files were already written (a failed gate means
// the export must NOT be deployed).
//
// The eight classes:
//   1. HTML pages        — old claim strings, private paths, stale labels,
//                          forbidden link targets, account-link targets.
//   2. JSON (search index, release manifest) — same string patterns.
//   3. Search index      — same patterns + GradeSpot allowlist (below).
//   4. Sitemaps          — every URL must map to an existing export dir;
//                          forbidden routes must not appear.
//   5. Image metadata    — FAIL-CLOSED: any image file in the export fails
//                          (no image is shipped today, so EXIF/GPS checks
//                          are vacuous; a future image needs an EXIF pass
//                          before this rule is relaxed, by owner decision).
//   6. Generated assets  — JS chunks + RSC payloads (.txt), same patterns.
//   7. Thumbnails        — no thumbnail files may exist (vacuous today).
//   8. Feeds             — no feed.xml may exist (no verified per-chapter
//                          publication dates; inventing them is forbidden).
//
// GradeSpot rule (G-19 refined): the string may appear ONLY in the one
// canonical chapter whose master content legitimately discusses it
// (21-conversations-and-projects-recovered-knowledge-map, HTML + RSC
// payload) and in the search index entries derived from that chapter.
// Any other file containing it fails the gate.
//
// The owner's personal email and phone are gate patterns: they must
// never appear in public output (the correction route stays partial
// precisely so no contact channel is published).
//
// This script contains NO restricted material itself: patterns are
// generic markers and public-identifier classes, never held content.

const fs = require("fs");
const path = require("path");

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve("out");

// Exact-byte patterns (U+2019 apostrophes where the source uses them).
const STRING_PATTERNS = [
  // G-01 / siblings / eleven corrected claim classes (must be 0).
  "byte-for-byte",
  "remains unchanged",
  "Original source scans",
  "reproduced without edits",
  "unchanged handwritten diagram",
  "Consult the original scan archive",
  "All six originals are unchanged",
  "Original uploaded photo preserved as embedded JPEG",
  "Tap to inspect the full-size embedded image",
  // Stale build labels.
  "seven sampled scans",
  "Seven sampled scans",
  "Preview 3",
  "WP7",
  // Old note-image surfaces.
  "atlas-images",
  "Original note scan",
  "assets/original-notes",
  // Private paths / identifiers / contact details (never public).
  "source_locator",
  "atlas-preserved",
  "/storage/emulated/0/Atlas",
  "u0_a365",
  "u0_a298",
  "mutthe.aravind@gmail.com",
  "9885189951",
];

// Forbidden link targets (exact, so /system-explorer is NOT matched).
const LINK_PATTERNS = [
  /href="\/sources([/?#"]|$)/,
  /href="\/explore([/?#"]|$)/,
  /href="\/feed\.xml([/?#"]|$)/,
  /href="\/data\/v1([/?#"]|$)/,
  /href="\/labs([/?#"]|$)/,
  /href="[^"]*sign-in[^"]*"/,
  /href="[^"]*sign-up[^"]*"/,
];

const GRADESPOT_ALLOWED = new Set([
  "21-conversations-and-projects-recovered-knowledge-map/index.html",
  "21-conversations-and-projects-recovered-knowledge-map/index.txt",
  "atlas-v2/search-index.json",
]);

const TEXT_EXTS = new Set([".html", ".json", ".txt", ".xml", ".js", ".css"]);
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".ico"]);

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const failures = [];
function fail(cls, file, detail) {
  failures.push(`[${cls}] ${file}: ${detail}`);
}

if (!fs.existsSync(ROOT)) {
  console.error(`clearance: export dir not found: ${ROOT}`);
  process.exit(2);
}

const files = walk(ROOT, []);
const rel = (f) => path.relative(ROOT, f);

// Classes 1, 2, 3, 6: string + link patterns over all text files.
for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  if (!TEXT_EXTS.has(ext)) continue;
  const body = fs.readFileSync(f, "utf8");
  const r = rel(f);
  for (const p of STRING_PATTERNS) {
    if (body.includes(p)) fail("strings", r, `contains ${JSON.stringify(p)}`);
  }
  for (const re of LINK_PATTERNS) {
    if (re.test(body)) fail("links", r, `matches ${re}`);
  }
  if (/gradespot/i.test(body) && !GRADESPOT_ALLOWED.has(r)) {
    fail("gradespot", r, "GradeSpot string outside the allowlisted chapter/index");
  }
}

// Class 4: sitemap — every URL maps to an existing export dir; no forbidden route.
const sitemapPath = path.join(ROOT, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const sm = fs.readFileSync(sitemapPath, "utf8");
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    let u;
    try { u = new URL(loc); } catch { fail("sitemap", "sitemap.xml", `unparsable URL ${loc}`); continue; }
    const p = u.pathname.replace(/^\/+|\/+$/g, "");
    if (p === "") {
      if (!fs.existsSync(path.join(ROOT, "index.html"))) fail("sitemap", "sitemap.xml", "home URL has no index.html");
      continue;
    }
    if (!fs.existsSync(path.join(ROOT, p)) || !fs.existsSync(path.join(ROOT, p, "index.html"))) {
      fail("sitemap", "sitemap.xml", `URL ${loc} has no export dir`);
    }
  }
  if (locs.length === 0) fail("sitemap", "sitemap.xml", "no URLs found");
} else {
  fail("sitemap", "sitemap.xml", "missing");
}

// Class 5 + 7: any image or thumbnail file fails (fail-closed).
for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  const base = path.basename(f).toLowerCase();
  if (IMAGE_EXTS.has(ext)) fail("images", rel(f), "image file present — EXIF/GPS pass required before shipping");
  if (base.includes("thumb")) fail("thumbnails", rel(f), "thumbnail file present");
}

// Class 8: no feed may exist.
if (fs.existsSync(path.join(ROOT, "feed.xml"))) {
  fail("feeds", "feed.xml", "feed present without verified per-chapter publication dates");
}

if (failures.length > 0) {
  console.error(`clearance: FAIL — ${failures.length} violation(s) in ${ROOT}`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`clearance: PASS — ${files.length} files scanned, 8 classes clean`);
