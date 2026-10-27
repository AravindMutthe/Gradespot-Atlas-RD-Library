#!/usr/bin/env python3
"""Generate Atlas Preview 3 static pages (WP6/WP7/WP8) from shared JSON data.

Usage: generate_static.py <src-dir> <build-dir>
The build dir is expected to already contain the 57-chapter staging site
(copied, never moved) whose chapters.json / release.json / search.json are
preserved byte-for-byte. This script only ADDS preview3 files and rewrites
vercel.json to add the four new clean-URL routes (existing 57 kept).
Canonical domain is the production domain; staging is login-gated and is
only a preview, so canonicals deliberately point at production.
"""
import html
import json
import os
import sys

SRC, BUILD = sys.argv[1], sys.argv[2]
CANON = "https://aravind-systems-atlas.vercel.app"


def load(name):
    with open(os.path.join(SRC, "data", name), encoding="utf-8") as f:
        return json.load(f)


paths_data = load("learning-paths.json")
explorer_data = load("explorer-nic-journey.json")
sources_data = load("sources.json")
with open(os.path.join(BUILD, "chapters.json"), encoding="utf-8") as f:
    chapters = json.load(f)
titles = {c["slug"]: c["title"] for c in chapters}
NAV = [("/", "Home"), ("/learning-paths", "Learning Paths"),
       ("/explore", "System Explorer"), ("/sources", "Sources"),
       ("/about", "About")]


def esc(s):
    return html.escape(str(s), quote=True)


def page(route, title, desc, body, extra_js=""):
    nav = "".join(
        f'<a href="{href}"{" aria-current=\"page\"" if href == route else ""}>{label}</a>'
        for href, label in NAV)
    ld = {
        "@context": "https://schema.org", "@type": "WebPage",
        "name": title, "description": desc,
        "url": CANON + route,
        "isPartOf": {"@type": "WebSite", "name": "Aravind Systems Atlas",
                     "url": CANON},
    }
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} — Aravind Systems Atlas</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{CANON}{route}">
<link rel="stylesheet" href="/preview3.css">
<script type="application/ld+json">{json.dumps(ld)}</script>
</head><body>
<a class="skip" href="#main">Skip to main content</a>
<header class="site"><a class="brand" href="/">Aravind Systems Atlas</a><br>
<span>Research edition · Release v1-consolidated-001</span></header>
<nav class="main" aria-label="Main navigation">{nav}<span class="planned">Labs — planned</span></nav>
<main id="main">
{body}
<footer><p>Aravind Systems Atlas · Research edition · Release v1-consolidated-001 · Version 1.0.0-continuing · 57 chapters · 136 original-note images · Content SHA-256 970489efd3899d29. No AI tutor in navigation. Labs is labelled planned only.</p></footer>
</main>
{extra_js}
</body></html>
"""


def chapter_link(slug):
    return f'<a href="/{esc(slug)}">{esc(titles.get(slug, slug))}</a>'


# ---------- WP6: Learning Paths ----------
cards = []
sections = []
for p in paths_data["paths"]:
    cards.append(
        f'<article class="card"><a href="#path-{esc(p["id"])}">'
        f'<h3>{esc(p["title"])}</h3><p>{esc(p["focus"])}</p>'
        f'<p><strong>{len(p["steps"])} steps · all real chapters</strong></p></a></article>')
    steps = "".join(
        f"<li>{chapter_link(s['slug'])} — {esc(s['why'])}</li>"
        for s in p["steps"])
    sections.append(
        f'<section class="panel" id="path-{esc(p["id"])}" aria-labelledby="h-{esc(p["id"])}">'
        f'<h2 id="h-{esc(p["id"])}">{esc(p["title"])}</h2><p>{esc(p["focus"])}</p>'
        f'<ol class="steps">{steps}</ol>'
        f'<p><a class="btn secondary" href="#chooser">Back to chooser</a></p></section>')
lp_body = f"""<p class="badge">Preview 3 · WP6 · Release <code>v1-consolidated-001</code></p>
<h1>Choose your learning path</h1>
<p class="lead">Five starter paths. Every step is a real chapter from the 57-chapter consolidated master — no mockup or example title has been turned into a chapter, and no chapter has been invented for a path.</p>
<div class="note"><p><strong>How to use this chooser.</strong> Pick a path card to jump to its ordered reading sequence, then follow the chapter links in order. You can also read any chapter on its own from the library hub.</p></div>
<section id="chooser" aria-label="Learning path chooser"><div class="grid">{''.join(cards)}</div></section>
{''.join(sections)}"""
with open(os.path.join(BUILD, "learning-paths.html"), "w", encoding="utf-8") as f:
    f.write(page("/learning-paths", "Learning Paths",
                  "Five starter learning paths sequencing real chapters of the Aravind Systems Atlas only.",
                  lp_body))

# ---------- WP8: System Explorer ----------
j = explorer_data["journey"]
nodes_html = []
for n in j["nodes"]:
    also = ""
    if n.get("alsoIn"):
        also = "<p>Further reading: " + "; ".join(
            f'{chapter_link(a["slug"])} — {esc(a["note"])}' for a in n["alsoIn"]) + "</p>"
    nodes_html.append(
        f'<li id="node-{esc(n["id"])}" data-node data-label="{esc(n["label"])}" tabindex="-1">'
        f'<h3>Step {n["order"]}: {esc(n["label"])}</h3>'
        f'<p><em>Chapter wording:</em> “{esc(n["chapterText"])}”</p>'
        f'<p>{esc(n["explanation"])}</p>'
        f'<p>Source: {chapter_link(j["chapter"]["slug"])} · Section: {esc(j["chapterSection"])}</p>{also}</li>')
# Static SVG: five stacked nodes (vertical = mobile-safe by construction).
svg_nodes = []
y = 30
for n in j["nodes"]:
    svg_nodes.append(
        f'<g><rect class="jnode" x="10" y="{y}" width="580" height="64" rx="12"/>'
        f'<text class="jnode-label" x="26" y="{y + 27}">Step {n["order"]}: {esc(n["label"])}</text>'
        f'<text class="jnode-sub" x="26" y="{y + 48}">{esc(n["chapterText"][:72])}</text></g>')
    if n["order"] < 5:
        svg_nodes.append(
            f'<text x="300" y="{y + 82}" text-anchor="middle" font-size="20" fill="#075f70" aria-hidden="true">↓</text>')
    y += 92
svg = (f'<svg class="diagram" viewBox="0 0 600 {y}" role="img" '
       f'aria-labelledby="svg-title svg-desc"><title id="svg-title">NIC packet path diagram</title>'
       f'<desc id="svg-desc">Five steps in order: PCIe device discovery, driver binding, '
       f'kernel interface, addressing and routes, packet transfer. The ordered list below '
       f'is the full text alternative.</desc>{"".join(svg_nodes)}</svg>')
worked = "".join(f"<li>{esc(s)}</li>" for s in j["workedExample"]["steps"])
ex_body = f"""<p class="badge">Preview 3 · WP8 · Release <code>v1-consolidated-001</code></p>
<h1>System Explorer</h1>
<p class="lead">One complete end-to-end journey, built only from verified chapter material. The framework below it is reusable: a future journey is one JSON file, not new diagram code.</p>
<section class="panel" aria-labelledby="nic-h"><h2 id="nic-h">{esc(j["title"])}</h2>
<p>Source chapter: {chapter_link(j["chapter"]["slug"])} · Section: {esc(j["chapterSection"])}. {esc(j["scopeNote"])}</p>
<div><p><button class="btn secondary" id="journey-prev" type="button">← Previous step</button> <button class="btn" id="journey-next" type="button">Next step →</button></p>
<p id="journey-status" role="status" aria-live="polite"></p></div>
{svg}
<ol class="journey" id="nic-journey-list">{''.join(nodes_html)}</ol>
</section>
<section class="panel"><h2>{esc(j["workedExample"]["title"])}</h2>
<p>{esc(j["workedExample"]["caveat"])}</p><ol>{worked}</ol>
<p>The chapter adds that the real stack is bidirectional and contains additional details such as ARP/neighbor discovery, MTU, offloads and retransmissions — those are not separate journey nodes here because the chapter's step flow does not list them as steps.</p></section>
<section class="panel"><h2>How the Explorer framework works</h2>
<ul>{''.join(f'<li>{esc(r)}</li>' for r in explorer_data["framework"]["rules"])}</ul>
<p>{esc(explorer_data["framework"]["model"])}</p>
<p><strong>Not yet journeys:</strong> packet journeys in other chapters (for example the port-to-service journey) are linked as further reading above. They are not presented as completed Explorer journeys until a journey file is built and verified for them.</p></section>"""
with open(os.path.join(BUILD, "explore.html"), "w", encoding="utf-8") as f:
    f.write(page("/explore", "System Explorer: NIC packet path",
                  "System Explorer: the NIC packet path end-to-end, from PCIe discovery to packet transfer, grounded in the NIC chapter.",
                  ex_body, '<script src="/explorer.js" defer></script>'))

# ---------- WP7: Sources ----------
rel = sources_data["release"]
figs = []
for n in sources_data["sampleNotes"]:
    wh = ""
    try:
        from PIL import Image
        with Image.open(os.path.join(BUILD, "assets", "original-notes", n["file"])) as im:
            wh = f' width="{im.width}" height="{im.height}"'
    except Exception:
        pass
    figs.append(
        f'<figure><img src="/assets/original-notes/{esc(n["file"])}" alt="{esc(n["caption"])}" loading="lazy" decoding="async"{wh}>'
        f'<figcaption>{esc(n["caption"])} · Chapter: {chapter_link(n["chapter"])} · File: <code>{esc(n["file"])}</code> · '
        f'Recorded SHA-256: <code>{esc(n["sha256"][:16])}…</code> (full value in the content manifest; see honesty note below).</figcaption></figure>')
labels = "".join(
    f"<li><strong>{esc(x['label'])}.</strong> {esc(x['meaning'])}</li>"
    for x in sources_data["provenanceLabels"])
limits = "".join(f"<li>{esc(x)}</li>" for x in sources_data["limitations"])
so_body = f"""<p class="badge">Preview 3 · WP7 · Release <code>v1-consolidated-001</code></p>
<h1>Sources</h1>
<p class="lead">Original notebook scans, provenance labels, the release manifest and the limits of this research edition — in one place.</p>
<section class="panel"><h2>Original notebook scans viewer</h2>
<p>Seven sampled scans are shown here from the two chapters behind the System Explorer journey. The full set is 136 unique original-note images; every chapter page in this site already embeds its own scans, and the <a href="/source-photographs">Source photographs chapter</a> collects them. Images load lazily and open at full size in the browser when tapped or clicked.</p>
{''.join(figs)}</section>
<section class="panel"><h2>Provenance and editorial-synthesis labels</h2><ul>{labels}</ul></section>
<div class="warn"><h2 style="margin-top:0">SHA honesty note — read before citing a hash</h2><p>{esc(sources_data["shaHonesty"])}</p></div>
<section class="panel"><h2>Release manifest (must match the master)</h2>
<div class="tablewrap"><table><caption>Release manifest for this preview</caption>
<tr><th scope="col">Field</th><th scope="col">Value</th></tr>
<tr><th scope="row">Atlas</th><td>{esc(rel["atlas"])}</td></tr>
<tr><th scope="row">Version</th><td>{esc(rel["version"])}</td></tr>
<tr><th scope="row">Content release</th><td>{esc(rel["contentRelease"])}</td></tr>
<tr><th scope="row">Status</th><td>{esc(rel["status"])}</td></tr>
<tr><th scope="row">Chapters</th><td>{rel["chapters"]}</td></tr>
<tr><th scope="row">Unique original-note images</th><td>{rel["unique_images"]}</td></tr>
<tr><th scope="row">Diagrams</th><td>{rel["diagrams"]}</td></tr>
<tr><th scope="row">Tables</th><td>{rel["tables"]}</td></tr>
<tr><th scope="row">Baseline paragraphs kept</th><td>{rel["baseline_paragraphs_kept"]}</td></tr>
<tr><th scope="row">Industry paragraphs added</th><td>{rel["industry_paragraphs_added"]}</td></tr>
<tr><th scope="row">Duplicate paragraphs dropped</th><td>{rel["duplicate_paragraphs_dropped"]}</td></tr>
<tr><th scope="row">Content SHA-256</th><td><code>{esc(rel["content_sha256"])}</code></td></tr>
</table></div>
<p>The manifest file itself is served unchanged at <a href="/release.json">/release.json</a>.</p></section>
<section class="panel"><h2>Research limitations and verification status</h2><ul>{limits}</ul>
<p>Private material is excluded by count only in this site. Nothing private is displayed merely because it exists in the archive.</p></section>"""
with open(os.path.join(BUILD, "sources.html"), "w", encoding="utf-8") as f:
    f.write(page("/sources", "Sources",
                  "Sources for the Aravind Systems Atlas: original notebook scans, provenance labels, release manifest and research limitations.",
                  so_body))

# ---------- WP7: About ----------
ab_body = """<p class="badge">Preview 3 · WP7 · Release <code>v1-consolidated-001</code></p>
<h1>About the Atlas</h1>
<p class="lead">A research library built from one person's handwritten systems notes, preserved first and explained second.</p>
<section class="panel"><h2>What it is</h2>
<p>The Aravind Systems Atlas is a 57-chapter research library covering computing and hardware, networks and infrastructure, institutions and markets, systems evolution, and industrial and business networks. Its source is a set of handwritten notebook pages, preserved as scans, plus editorial synthesis that organizes those notes into readable chapters.</p></section>
<section class="panel"><h2>What it is not</h2>
<ul>
<li>Not a certified history and not a textbook: transcription verification is still in progress, and paraphrases are never presented as verbatim quotations.</li>
<li>Not a second copy of anything else: this standalone site is the canonical full library. The portfolio, if it links here at all, links in — it does not duplicate chapters.</li>
<li>Not an AI tutor and not a labs product: there is no AI in the navigation, and Labs is labelled “planned” only until a real lab exists.</li>
</ul></section>
<section class="panel"><h2>Methodology</h2>
<p>Preservation first: original scans are reproduced unchanged. Explanation second: redraws, syntheses and corrections are labelled as added material, never silently merged into the original wording. Consolidation: the 57 chapters reconcile a research-edition baseline (733 paragraphs kept) with industry-evolution material (283 paragraphs added), dropping 14 duplicate paragraphs. The full rules live on the <a href="/sources">Sources</a> page.</p></section>
<section class="panel"><h2>Timelines — status note</h2>
<p>Timelines are represented in the design system only in this preview. A full interactive timeline is a later batch. No timeline page is advertised here as completed.</p></section>
<section class="panel"><h2>Release</h2>
<p>Release <code>v1-consolidated-001</code> · Version <code>1.0.0-continuing</code> · Status: research-edition · 57 chapters · 136 unique original-note images · 22 diagrams · 48 tables · Content SHA-256 <code>970489efd3899d29</code>. Manifest: <a href="/release.json">/release.json</a>.</p>
<p>Start reading: <a href="/learning-paths">Choose your learning path</a> · <a href="/explore">System Explorer</a> · <a href="/sources">Sources</a></p></section>"""
with open(os.path.join(BUILD, "about.html"), "w", encoding="utf-8") as f:
    f.write(page("/about", "About",
                  "About the Aravind Systems Atlas: purpose, methodology, release information and what this research edition is not.",
                  ab_body))

# ---------- vercel.json: keep 57 chapter rewrites, add 4 new routes ----------
with open(os.path.join(BUILD, "vercel.json"), encoding="utf-8") as f:
    v = json.load(f)
seen = {r["source"] for r in v.get("rewrites", [])}
for route, dest in [("/learning-paths", "/learning-paths.html"),
                    ("/explore", "/explore.html"),
                    ("/sources", "/sources.html"),
                    ("/about", "/about.html")]:
    if route not in seen:
        v.setdefault("rewrites", []).append({"source": route, "destination": dest})
with open(os.path.join(BUILD, "vercel.json"), "w", encoding="utf-8") as f:
    json.dump(v, f, indent=2)

# ---------- sitemap + robots (new in this preview; staging had none) ----------
urls = [""] + [c["slug"] for c in chapters] + \
    ["learning-paths", "explore", "sources", "about"]
sm = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u in urls:
    sm.append(f"<url><loc>{CANON}/{u}</loc></url>")
sm.append("</urlset>")
with open(os.path.join(BUILD, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write("\n".join(sm))
with open(os.path.join(BUILD, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(f"User-agent: *\nAllow: /\nSitemap: {CANON}/sitemap.xml\n")
print("wrote 4 pages + vercel.json rewrites:", len(v["rewrites"]),
      "+ sitemap urls:", len(urls))
