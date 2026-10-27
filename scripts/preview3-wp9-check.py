#!/usr/bin/env python3
"""WP9 responsive/a11y/lab check for Atlas Preview 3 (local, lab only).

Serves the build dir on localhost, then for each new page and each width
(320/375/390/768/1024) records: horizontal overflow (scrollWidth vs
innerWidth), console errors, page errors, and navigation timings.
Keyboard check: Tab through the explore page and report the focused
element + whether a visible outline is computed. This is LAB data from a
headless Chromium render, NOT field data and NOT Lighthouse scores.
Field Core Web Vitals require real-user data, which staging does not have.
Usage: wp9-check.py <build-dir> <port>
"""
import json
import sys
import threading
import http.server
import functools
from playwright.sync_api import sync_playwright

BUILD, PORT = sys.argv[1], int(sys.argv[2])
PAGES = ["learning-paths.html", "explore.html", "sources.html", "about.html"]
WIDTHS = [320, 375, 390, 768, 1024]
Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=BUILD)
httpd = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
results = {}
with sync_playwright() as pw:
    browser = pw.firefox.launch()
    # NOTE: Playwright Chromium is not installed in this VM and the system
    # Chromium blocks localhost navigation (Local Network Access checks);
    # Firefox renders the same pages for these layout measurements.
    for page_name in PAGES:
        results[page_name] = {}
        for w in WIDTHS:
            ctx = browser.new_context(viewport={"width": w, "height": 800})
            pg = ctx.new_page()
            errors = []
            pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: errors.append(str(e)))
            pg.goto(f"http://127.0.0.1:{PORT}/{page_name}", wait_until="load")
            data = pg.evaluate("""() => {
              const t = performance.getEntriesByType('navigation')[0];
              return {scrollW: document.documentElement.scrollWidth,
                      innerW: window.innerWidth,
                      dcl: Math.round(t.domContentLoadedEventEnd),
                      load: Math.round(t.loadEventEnd),
                      images: document.images.length,
                      lazy: [...document.images].filter(i => i.loading === 'lazy').length};
            }""")
            data["overflow_px"] = data["scrollW"] - data["innerW"]
            data["console_errors"] = errors
            results[page_name][str(w)] = data
            ctx.close()
    # keyboard/focus check on explore at 390px
    ctx = browser.new_context(viewport={"width": 390, "height": 800})
    pg = ctx.new_page()
    pg.goto(f"http://127.0.0.1:{PORT}/explore.html", wait_until="load")
    focused = []
    for _ in range(6):
        pg.keyboard.press("Tab")
        focused.append(pg.evaluate(
            "() => { const e = document.activeElement; const s = getComputedStyle(e);"
            " return {tag: e.tagName, text: (e.textContent||'').trim().slice(0,40),"
            " outline: s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor}; }"))
    results["keyboard_explore_390"] = focused
    browser.close()
httpd.shutdown()
print(json.dumps(results, indent=2))
