import type { Metadata } from "next";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";
import SearchClient from "@/components/atlas-v2/SearchClient";

export const metadata: Metadata = {
  title: "Search — Aravind Systems Atlas",
  description: "Full-text search across all 57 chapters of the Aravind Systems Atlas.",
  alternates: { canonical: `${BASE}/search/` },
};

export default function SearchPage() {
  return (
    <>
      <h1 style={{ fontFamily: "\"Source Serif 4\", Georgia, serif", color: "var(--heading)" }}>Search the Atlas</h1>
      <SearchClient />
      <noscript>
        <p>
          Search needs JavaScript to load the index. Without JavaScript, browse the{" "}
          <a href="/library">library by domain</a> instead.
        </p>
      </noscript>
    </>
  );
}
