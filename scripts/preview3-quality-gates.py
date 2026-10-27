#!/usr/bin/env python3
"""Atlas Preview 3 automated quality gates (WP14).

Usage: quality-gates.py <build-dir>
Exits 0 only when every gate passes. Prints a JSON summary to stdout and
a human-readable FAIL list to stderr. Checks: chapter count, JSON schema,
duplicate slugs, missing assets, broken internal links (new pages strict;
whole-site reported separately), source references, search-index coverage,
route generation, SEO basics, accessibility basics, contrast ratios,
overflow-risk scan, image lazy-loading. Console-error and real-device
checks are NOT automated here; they are staging/manual gates (see report).
"""
import json
import math
import os
import re
import sys

BUILD = sys.argv[1]
NEW = ["learning-paths.html", "explore.html", "sources.html", "about.html"]
fails, warns, info = [], [], {}

def check(name, ok, detail=""):
    (info.__setitem__(name, "PASS" if ok else "FAIL"))
    if not ok:
        fails.append(f"{name}: {detail}")

with open(os.path.join(BUILD, "chapters.json"), encoding="utf-8") as f:
    chapters = json.load(f)
check("chapter_count_57", len(chapters) == 57, f"got {len(chapters)}")
slugs = [c["slug"] for c in chapters]
check("duplicate_slugs", len(slugs) == len(set(slugs)), "duplicates present")
schema_bad = [c["slug"] for c in chapters
              if not all(k in c for k in ("slug", "title", "domain"))]
check("chapter_schema", not schema_bad, f"bad: {schema_bad[:5]}")
with open(os.path.join(BUILD, "release.json"), encoding="utf-8") as f:
    rel = json.load(f)
expected = {"version": "1.0.0-continuing", "contentRelease": "v1-consolidated-001",
            "chapters": 57, "unique_images": 136, "diagrams": 22, "tables": 48,
            "content_sha256": "970489efd3899d29", "status": "research-edition"}
mismatch = {k: (rel.get(k), v) for k, v in expected.items() if rel.get(k) != v}
check("release_manifest_match", not mismatch, str(mismatch))
with open(os.path.join(BUILD, "search.json"), encoding="utf-8") as f:
    search = json.load(f)
check("search_coverage_57", {s["slug"] for s in search} == set(slugs),
      f"search={len(search)} chapters={len(slugs)}")
with open(os.path.join(BUILD, "vercel.json"), encoding="utf-8") as f:
    vercel = json.load(f)
rw = {r["source"].lstrip("/"): r["destination"].lstrip("/") for r in vercel.get("rewrites", [])}
check("routes_57_chapters", all(s in rw for s in slugs),
      f"missing: {[s for s in slugs if s not in rw][:5]}")
for route, dest in [("learning-paths", "learning-paths.html"), ("explore", "explore.html"),
                    ("sources", "sources.html"), ("about", "about.html")]:
    check(f"route_{route}", rw.get(route) == dest, f"got {rw.get(route)}")

# --- link + asset checks ---
def internal_targets():
    targets = set()
    for root, _, files in os.walk(BUILD):
        for fn in files:
            targets.add(os.path.relpath(os.path.join(root, fn), BUILD))
    for src in rw:
        targets.add(rw[src])
        targets.add(src)
    targets.add("")
    return targets

targets = internal_targets()
href_re = re.compile(r'href="(/[^"#]*)"')
src_re = re.compile(r'src="(/[^"#]*)"')
new_broken, site_broken = [], []
for fn in NEW:
    text = open(os.path.join(BUILD, fn), encoding="utf-8").read()
    for href in href_re.findall(text):
        t = href.lstrip("/")
        if t not in targets and t + ".html" not in targets:
            new_broken.append(f"{fn} -> {href}")
    for src in src_re.findall(text):
        if src.lstrip("/") not in targets:
            new_broken.append(f"{fn} src {src}")
check("new_pages_links_assets", not new_broken, str(new_broken[:10]))
# whole-site link scan (informational: pre-existing V1 pages included)
for root, _, files in os.walk(BUILD):
    for fn in files:
        if not fn.endswith(".html"):
            continue
        relp = os.path.relpath(os.path.join(root, fn), BUILD)
        text = open(os.path.join(root, fn), encoding="utf-8", errors="replace").read()
        for href in href_re.findall(text):
            t = href.lstrip("/")
            if t and t not in targets and t + ".html" not in targets \
                    and not t.startswith("http"):
                site_broken.append(f"{relp} -> {href}")
info["site_wide_broken_links"] = len(site_broken)
if site_broken:
    warns.append(f"site-wide broken links: {len(site_broken)} e.g. {site_broken[:5]}")

# --- source references: every original-note file referenced anywhere exists ---
note_files = set(os.listdir(os.path.join(BUILD, "assets", "original-notes")))
check("original_notes_count_136", len(note_files) == 136, f"got {len(note_files)}")
missing_refs = []
for root, _, files in os.walk(BUILD):
    for fn in files:
        if fn.endswith(".html"):
            text = open(os.path.join(root, fn), encoding="utf-8", errors="replace").read()
            for m in re.findall(r"assets/original-notes/([A-Za-z0-9_.\-]+)", text):
                if m not in note_files:
                    missing_refs.append(m)
check("source_refs_exist", not missing_refs, str(sorted(set(missing_refs))[:10]))

# --- SEO + a11y basics on new pages ---
for fn in NEW:
    text = open(os.path.join(BUILD, fn), encoding="utf-8").read()
    check(f"{fn}_title", bool(re.search(r"<title>[^<]{10,}</title>", text)), "missing/short title")
    check(f"{fn}_description", 'name="description" content="' in text and len(re.search(r'name="description" content="([^"]*)"', text).group(1)) > 20, "missing/short description")
    check(f"{fn}_canonical", 'rel="canonical"' in text, "missing canonical")
    check(f"{fn}_lang", text.startswith('<!DOCTYPE html>\n<html lang="en">'), "lang missing")
    check(f"{fn}_skip_link", 'class="skip"' in text, "skip link missing")
    check(f"{fn}_single_h1", text.count("<h1>") == 1, f"h1 count {text.count('<h1>')}")
    check(f"{fn}_viewport", 'name="viewport"' in text, "viewport missing")
    imgs = re.findall(r"<img [^>]*>", text)
    check(f"{fn}_img_alt", all("alt=" in i for i in imgs), "img without alt")
    check(f"{fn}_img_lazy", all("loading=\"lazy\"" in i for i in imgs), "img without lazy")
    check(f"{fn}_no_ai_nav", ">AI<" not in text and "ai-tutor" not in text.lower(), "AI in nav?")
sm = open(os.path.join(BUILD, "sitemap.xml"), encoding="utf-8").read()
check("sitemap_urls", sm.count("<url>") == 62, f"got {sm.count('<url>')} expected 62 (hub+57+4)")
check("robots_sitemap", "Sitemap:" in open(os.path.join(BUILD, "robots.txt"), encoding="utf-8").read(), "robots lacks sitemap")

# --- contrast ratios (WCAG relative luminance) ---
def lum(hexc):
    h = hexc.lstrip("#")
    rgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    rgb = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

pairs = {"text_on_canvas": ("#1E293B", "#F8FAFC"), "link_on_white": ("#075f70", "#FFFFFF"),
         "white_on_navy": ("#FFFFFF", "#10233F"), "white_on_blue": ("#FFFFFF", "#2563EB"),
         "white_on_darkteal": ("#FFFFFF", "#075f70"), "teal_on_white_decorative_only": ("#0D9488", "#FFFFFF")}
info["contrast"] = {k: round(ratio(*v), 2) for k, v in pairs.items()}
for k in ("text_on_canvas", "link_on_white", "white_on_navy", "white_on_blue", "white_on_darkteal"):
    check(f"contrast_{k}_AA", info["contrast"][k] >= 4.5, str(info["contrast"][k]))
if info["contrast"]["teal_on_white_decorative_only"] < 4.5:
    warns.append("teal #0D9488 on white is %.2f (below AA) — used decoratively/borders only, never for small text" % info["contrast"]["teal_on_white_decorative_only"])

# --- overflow-risk scan of Preview 3 CSS ---
css = open(SRC_CSS, encoding="utf-8").read() if (SRC_CSS := os.environ.get("PREVIEW3_CSS")) else ""
if css:
    wide = re.findall(r"(?<!max-)width:\s*(\d+)px", css)
    check("css_no_wide_fixed_widths", all(int(w) <= 320 for w in wide), f"fixed widths: {wide}")
    check("css_focus_visible", ":focus-visible" in css, "no focus-visible rule")
    check("css_reduced_motion", "prefers-reduced-motion" in css, "no reduced-motion rule")
    check("css_touch_targets", "min-height:44px" in css, "no 44px touch target rule")

print(json.dumps({"gates": info, "fails": fails, "warnings": warns}, indent=2))
if fails:
    print("FAILURES:", *fails, sep="\n", file=sys.stderr)
    sys.exit(1)
print("ALL GATES PASS")
