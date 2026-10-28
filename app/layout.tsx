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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const diagrams = ATLAS_V2_CHAPTERS.reduce((n, c) => n + c.diagrams.length, 0);
  const tables = ATLAS_V2_CHAPTERS.reduce((n, c) => n + c.tables.length, 0);
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            Aravind Systems Atlas
            <small>Knowledge Hub</small>
          </Link>
          <nav className="site-nav" aria-label="Global">
            <NavItems />
          </nav>
          <form className="site-search" action="/search" method="get" role="search">
            <label htmlFor="site-search" className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
              Search the Atlas
            </label>
            <input id="site-search" name="q" type="search" placeholder="Search the Atlas…" />
            <button type="submit">Search</button>
          </form>
        </header>
        <main className="site-main">
          {children}
          <footer className="site-footer">
            Aravind Systems Atlas · release {ATLAS_V2_RELEASE.contentRelease} · version{" "}
            {ATLAS_V2_RELEASE.version} · {ATLAS_V2_CHAPTERS.length} chapters · 136 unique images ·{" "}
            {diagrams} diagrams · {tables} tables
            <nav aria-label="Footer">
              <NavItems />
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
            </nav>
          </footer>
        </main>
      </body>
    </html>
  );
}
