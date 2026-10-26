import type { Metadata, Viewport } from "next";
import Link from "next/link";
import AtlasSidebar from "@/components/AtlasSidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Systems Knowledge Atlas V1",
  description: "Aravind Systems Knowledge Atlas V1 — Hybrid & Research Editions, as a standalone website.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link className="brand" href="/">
            ✦ SYSTEMS / KNOWLEDGE ATLAS
            <small>Aravind · technical knowledge library · V1</small>
          </Link>
          <Link className="btn" href="/">📕 V1 · Hybrid &amp; Research</Link>
        </header>
        <div className="layout">
          <AtlasSidebar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
