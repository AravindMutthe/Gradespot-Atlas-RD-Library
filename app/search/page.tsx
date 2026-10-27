import type { Metadata } from "next";
import SearchClient from "@/components/atlas-v2/SearchClient";

export const metadata: Metadata = {
  title: "Search — Aravind Systems Atlas",
  description: "Full-text search across all 57 chapters of the Aravind Systems Atlas.",
  alternates: { canonical: "https://aravind-systems-atlas.vercel.app/search" },
};

export default function SearchPage() {
  return <SearchClient />;
}
