import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { ATLAS_V2_CHAPTERS } from "@/lib/atlas-v2/chapters";

// Sitemap (v2.0 initial scope, Phase 2): lists every public route this
// branch actually serves — home, System Explorer, Library, Learning Paths,
// Search, About, Timelines, Diagrams, Corrections, and all 57 chapter
// slugs — with trailing-slash canonicals matching the static-export layout.
// Routes NOT listed because they do not exist in initial scope: /explore
// (removed, G-03 — Explorer lives only at /system-explorer), /sources
// (excluded per D-03 — gated label only, never a live route), /feed.xml
// and /data/v1/* (proposed, not existing); listing non-existent routes
// would be incorrect. V1 fallback slugs: measured 2026-10-27, all 30 V1
// slugs coincide with canonical chapter slugs, so every fallback URL is
// already listed once, as its chapter URL — they add 0 distinct sitemap
// URLs. Canonical metadata is not a functioning HTTP redirect, and no
// redirect is claimed or implemented (static export serves each URL
// directly). Inventory: 9 static routes + 57 chapter URLs = 66 sitemap
// URLs.
const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

const STATIC_ROUTES: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "system-explorer", changeFrequency: "weekly", priority: 0.8 },
  { path: "library", changeFrequency: "weekly", priority: 0.9 },
  { path: "learning-paths", changeFrequency: "weekly", priority: 0.8 },
  { path: "search", changeFrequency: "monthly", priority: 0.5 },
  { path: "about", changeFrequency: "monthly", priority: 0.8 },
  { path: "timelines", changeFrequency: "weekly", priority: 0.8 },
  { path: "diagrams", changeFrequency: "weekly", priority: 0.8 },
  { path: "corrections", changeFrequency: "monthly", priority: 0.5 },
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
