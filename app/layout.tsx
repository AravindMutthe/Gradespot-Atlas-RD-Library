import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/source-serif-4/400-italic.css";
import "@fontsource/source-serif-4/600.css";
import "@fontsource/source-serif-4/700.css";
import Link from "next/link";
import { ATLAS_V2_CHAPTERS, ATLAS_V2_RELEASE } from "@/lib/atlas-v2/chapters";
import "./globals.css";
import ThemeToggle from "@/components/atlas-v2/ThemeToggle";
import HeaderSearch from "@/components/atlas-v2/HeaderSearch";

export const metadata: Metadata = {
  title: "Aravind Systems Atlas",
  description:
    "Professional Cross-Industry Technology and Economic Knowledge Hub.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5 };

// Converged global navigation (blueprint §4.5, D-02 delegated decision).
// One stable model on every page: Library · Learning Paths · Timelines ·
// Diagrams · Explorer · Sources-gated-label. "Sources" is a gated label
// (plain text, not a link) per D-03 — the Sources route is NOT emitted in
// initial v2.0 scope. Explorer lives only at /system-explorer (G-03).
// Labs and AI do NOT appear as destinations, not even as disabled items.
// About is reachable from the footer (it carries the release honesty
// position) rather than the header model; Search is reachable from the
// header search form on every page. The legacy V1 sidebar stays retired.
type NavItem = { href?: string; label: string; gated?: boolean };

const NAV: NavItem[] = [
  { href: "/library", label: "Library" },
  { href: "/learning-paths", label: "Learning Paths" },
  { href: "/timelines", label: "Timelines" },
  { href: "/diagrams", label: "Diagrams" },
  { href: "/system-explorer", label: "Explorer" },
  { label: "Sources", gated: true },
];

function NavItems() {
  return (
    <>
      {NAV.map((item) =>
        item.gated ? (
          <span
            key={item.label}
            className="nav-gated"
            title="Sources route is gated — not published in initial v2.0 scope"
          >
            Sources <span className="gated-tag">gated</span>
          </span>
        ) : (
          <Link key={item.href} href={item.href as string}>
            {item.label}
          </Link>
        ),
      )}
    </>
  );
}

// Theme init (Phase 1 Commit D): runs before first paint so the stored
// or system theme applies without a flash. No-JS clients never run this
// and fall back to the CSS prefers-color-scheme block in globals.css.
const THEME_INIT = `(function(){try{var t=localStorage.getItem("atlas-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}else{document.documentElement.dataset.theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const diagrams = ATLAS_V2_CHAPTERS.reduce((n, c) => n + c.diagrams.length, 0);
  const tables = ATLAS_V2_CHAPTERS.reduce((n, c) => n + c.tables.length, 0);
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <header className="site-header">
          <Link className="brand" href="/">
            Aravind Systems Atlas
            <small>Knowledge Hub</small>
          </Link>
          <nav className="site-nav" aria-label="Global">
            <NavItems />
          </nav>
          <ThemeToggle />
          <HeaderSearch />
        </header>
        <main className="site-main">
          {children}
          <footer className="site-footer">
            <p>Original research: Aravind Mutthe · Aravind Systems Atlas · © 2026 · All rights reserved unless explicitly licensed otherwise.</p>
            <p>Publication state: research-edition · release {ATLAS_V2_RELEASE.contentRelease} · version{" "}
            {ATLAS_V2_RELEASE.version} · {ATLAS_V2_CHAPTERS.length} chapters · 136 unique images ·{" "}
            {diagrams} diagrams · {tables} tables · last-modified is tied to this release; no per-chapter publication dates are claimed.</p>
            <nav aria-label="Footer">
              <NavItems />
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/corrections">Report a problem</Link>
              <Link href="/release.json">Release manifest</Link>
            </nav>
          </footer>
        </main>
      </body>
    </html>
  );
}
