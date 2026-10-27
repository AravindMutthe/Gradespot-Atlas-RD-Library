import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { ATLAS_V2_CHAPTERS, ATLAS_V2_RELEASE } from "@/lib/atlas-v2/chapters";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aravind Systems Atlas",
  description:
    "Professional Cross-Industry Technology and Economic Knowledge Hub.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5 };

// Single global navigation (DES-03). System Explorer is intentionally NOT
// listed: its /system-explorer route does not exist yet (Step 3), and
// planned features must not appear as functional destinations before they
// exist. The legacy V1 sidebar is retired with this layout.
const NAV: { href: string; label: string }[] = [
  { href: "/explore", label: "Explore" },
  { href: "/library", label: "Library" },
  { href: "/learning-paths", label: "Learning Paths" },
  { href: "/search", label: "Search" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

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
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
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
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link href="/">Home</Link>
            </nav>
          </footer>
        </main>
      </body>
    </html>
  );
}
