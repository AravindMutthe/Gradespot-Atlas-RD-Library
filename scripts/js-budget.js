#!/usr/bin/env node
// Atlas v2.0 §8.1 JS-budget measurement (D-08 binding metric).
//
// Measures, per initial-scope route, the TOTAL JS bytes transferred on
// initial navigation, gzip-compressed (level 9), from the script tags
// and preload-as-script links actually present in the route's built
// HTML. Shared + route chunks fetched before first paint / interaction
// readiness are included; lazy-loaded modules (not referenced by the
// initial HTML) are excluded by construction, including deferred
// Explorer code until invoked.
//
// The budget applies to the MAXIMUM initial-route figure across the
// measured routes; the target is ~150KB gzip. Build-report "First Load
// JS" figures are a DIFFERENT measure and are never substituted here.
//
// Usage: node scripts/js-budget.js [out-dir] [routes...]
// Default routes: home, one chapter, library, search, system-explorer,
// learning-paths, timelines, diagrams, about, corrections, workspace.

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve("out");
const ROUTES = process.argv.slice(3).length > 0 ? process.argv.slice(3) : [
  "",
  "from-silicon-to-a-working-nic",
  "library",
  "search",
  "system-explorer",
  "learning-paths",
  "timelines",
  "diagrams",
  "about",
  "corrections",
  "workspace",
];

function gzipBytes(file) {
  return zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length;
}

const results = [];
let missing = 0;
for (const route of ROUTES) {
  const htmlPath = route === "" ? path.join(ROOT, "index.html") : path.join(ROOT, route, "index.html");
  if (!fs.existsSync(htmlPath)) {
    console.error(`js-budget: missing HTML for route ${route || "/"}: ${htmlPath}`);
    missing += 1;
    continue;
  }
  const html = fs.readFileSync(htmlPath, "utf8");
  const refs = new Set();
  for (const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)) refs.add(m[1]);
  for (const m of html.matchAll(/<link[^>]+as="script"[^>]+href="([^"]+)"/g)) refs.add(m[1]);
  for (const m of html.matchAll(/<link[^>]+href="([^"]+)"[^>]+as="script"/g)) refs.add(m[1]);
  let total = 0;
  const parts = [];
  for (const ref of refs) {
    const clean = decodeURIComponent(ref.split("?")[0]).replace(/^\/+/, "");
    const file = path.join(ROOT, clean);
    if (!fs.existsSync(file)) {
      console.error(`js-budget: referenced JS missing for /${route}: ${ref}`);
      missing += 1;
      continue;
    }
    const gz = gzipBytes(file);
    total += gz;
    parts.push(`${path.basename(file)}:${gz}`);
  }
  results.push({ route: route === "" ? "/" : `/${route}`, files: parts.length, bytes: total, parts });
}

for (const r of results) {
  console.log(`${r.route}\t${r.files} files\t${r.bytes} B gzip\t(${(r.bytes / 1024).toFixed(1)} KB)`);
  console.log(`    ${r.parts.join(" ")}`);
}
const max = results.reduce((m, r) => Math.max(m, r.bytes), 0);
console.log(`MAX initial-route JS (gzip): ${max} B (${(max / 1024).toFixed(1)} KB) vs target ~150 KB (${(150 * 1024).toFixed(0)} B)`);
console.log(max <= 150 * 1024 ? "js-budget: WITHIN TARGET" : "js-budget: OVER TARGET");
if (missing > 0) {
  console.error(`js-budget: ${missing} missing reference(s)`);
  process.exit(2);
}
