#!/usr/bin/env node
// Atlas v2.0 structural accessibility audit (Phase 6).
//
// Automated checks over the built export (default: out/). This is a
// STRUCTURAL audit, not an axe run: it verifies document structure,
// labelling, and focusability from the emitted HTML + CSS. It does not
// replace manual keyboard / screen-reader / touch spot checks, which
// remain pre-deploy gates. Any failure exits 1.
//
// Checks per HTML file:
//   A1 exactly one <h1>
//   A2 heading order never skips a level (h1->h3 without h2 fails)
//   A3 every <img> has a non-empty alt (vacuous today: 0 images shipped)
//   A4 every <a> has non-empty link text or aria-label
//   A5 every <button> has non-empty text or aria-label
//   A6 every <input>/<select>/<textarea> has an associated <label> or
//      aria-label (sr-only labels count)
//   A7 document has <html lang>
//   A8 a skip link to #main exists and <main id="main"> exists
// Global: the global stylesheet contains a :focus-visible rule.

const fs = require("fs");
const path = require("path");

const ROOT = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve("out");

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const failures = [];
const fail = (f, detail) => failures.push(`${path.relative(ROOT, f)}: ${detail}`);
const stripTags = (s) => s.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

const htmlFiles = walk(ROOT, []).filter((f) => f.endsWith(".html"));
let imgCount = 0, linkCount = 0, buttonCount = 0, inputCount = 0;

for (const f of htmlFiles) {
  const body = fs.readFileSync(f, "utf8");
  const h1 = (body.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(f, `A1: ${h1} <h1> elements (want exactly 1)`);
  let level = 0;
  for (const m of body.matchAll(/<h([1-6])[\s>]/g)) {
    const lv = Number(m[1]);
    if (level > 0 && lv > level + 1) fail(f, `A2: heading jumps h${level} -> h${lv}`);
    level = lv;
  }
  for (const m of body.matchAll(/<img[^>]*>/g)) {
    imgCount += 1;
    const alt = m[0].match(/alt="([^"]*)"/);
    if (!alt || alt[1].trim() === "") fail(f, "A3: <img> without non-empty alt");
  }
  for (const m of body.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) {
    linkCount += 1;
    const hasLabel = /aria-label="[^"]+"/.test(m[0].slice(0, m[0].indexOf(">") + 1));
    if (stripTags(m[1]) === "" && !hasLabel) fail(f, "A4: <a> without text or aria-label");
  }
  for (const m of body.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
    buttonCount += 1;
    const open = m[0].slice(0, m[0].indexOf(">") + 1);
    if (stripTags(m[1]) === "" && !/aria-label="[^"]+"/.test(open)) fail(f, "A5: <button> without text or aria-label");
  }
  const labels = new Set([...body.matchAll(/<label[^>]+for="([^"]+)"/g)].map((m) => m[1]));
  // Wrapping labels: <label>Text<input></label> is valid implicit association.
  const labelRanges = [...body.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/g)].map((m) => [m.index, m.index + m[0].length]);
  const inLabel = (idx) => labelRanges.some(([a, b]) => idx >= a && idx < b);
  for (const m of body.matchAll(/<(input|select|textarea)\b[^>]*>/g)) {
    const tag = m[0];
    if (/type="hidden"/.test(tag)) continue;
    inputCount += 1;
    const id = (tag.match(/id="([^"]+)"/) || [])[1];
    if (!/aria-label="[^"]+"/.test(tag) && !(id && labels.has(id)) && !inLabel(m.index)) {
      fail(f, `A6: <${m[1]}> without label or aria-label (${tag.slice(0, 80)})`);
    }
  }
  if (!/<html[^>]+lang="/.test(body)) fail(f, "A7: no <html lang>");
  if (!/href="#main"/.test(body)) fail(f, "A8: no skip link to #main");
  if (!/<main[^>]+id="main"/.test(body)) fail(f, "A8: no <main id=\"main\">");
}

const css = path.join(ROOT, "_next", "static", "css");
let focusRule = false;
if (fs.existsSync(css)) {
  for (const f of walk(css, []).filter((x) => x.endsWith(".css"))) {
    if (fs.readFileSync(f, "utf8").includes(":focus-visible")) focusRule = true;
  }
}
if (!focusRule) failures.push("global: no :focus-visible rule in emitted CSS");

if (failures.length > 0) {
  console.error(`a11y-check: FAIL — ${failures.length} violation(s) across ${htmlFiles.length} HTML files`);
  for (const x of failures.slice(0, 40)) console.error(`  ${x}`);
  if (failures.length > 40) console.error(`  ... and ${failures.length - 40} more`);
  process.exit(1);
}
console.log(`a11y-check: PASS — ${htmlFiles.length} HTML files, ${imgCount} images, ${linkCount} links, ${buttonCount} buttons, ${inputCount} labelled controls, :focus-visible present`);
