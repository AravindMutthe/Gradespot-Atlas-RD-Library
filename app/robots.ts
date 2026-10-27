import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
