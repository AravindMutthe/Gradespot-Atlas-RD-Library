import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { ATLAS_V2_CHAPTERS } from "@/lib/atlas-v2/chapters";

const BASE = "https://aravind-systems-atlas.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/library`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/search`, changeFrequency: "monthly", priority: 0.5 },
    ...ATLAS_V2_CHAPTERS.map((c) => ({ url: `${BASE}/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
