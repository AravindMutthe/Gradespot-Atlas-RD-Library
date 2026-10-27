import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { ATLAS_V2_CHAPTERS } from "@/lib/atlas-v2/chapters";

// Sitemap correction (DES-03 mandatory correction; Step 1) + Step 2
// reconciliation: lists every public route this branch actually serves —
// home, Explore, Library, Learning Paths, Search, Sources, About, and all
// 57 chapter slugs — with trailing-slash canonicals matching the
// static-export layout. Routes NOT listed because they do not exist yet:
// /system-explorer (Step 3), /feed.xml and /data/v1/* (proposed, not
// existing); listing non-existent routes would be incorrect. V1 fallback
// slugs (Step 2, DES-03 section 5): measured 2026-10-27, all 30 V1 slugs
// coincide with canonical chapter slugs, so every fallback URL is already
// listed once, as its chapter URL — they add 0 distinct sitemap URLs.
// V1 fallback pages carry canonical URLs in [slug] metadata (Step 2);
// canonical metadata is not a functioning HTTP redirect, and no redirect
// is claimed or implemented (static export serves each URL directly).
// Reconciled inventory: 7 static routes + 57 chapter URLs = 64 sitemap
// URLs.
const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

const STATIC_ROUTES: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "explore", changeFrequency: "weekly", priority: 0.8 },
  { path: "library", changeFrequency: "weekly", priority: 0.9 },
  { path: "learning-paths", changeFrequency: "weekly", priority: 0.8 },
  { path: "search", changeFrequency: "monthly", priority: 0.5 },
  { path: "sources", changeFrequency: "monthly", priority: 0.8 },
  { path: "about", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${BASE}/${r.path}${r.path ? "/" : ""}`,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...ATLAS_V2_CHAPTERS.map((c) => ({
      url: `${BASE}/${c.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
