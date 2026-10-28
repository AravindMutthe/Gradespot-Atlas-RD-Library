import type { Metadata } from "next";
import Link from "next/link";
import { ATLAS_V2_CHAPTERS } from "@/lib/atlas-v2/chapters";
import { displayTitle } from "@/lib/atlas-v2/display-title";
import WorkspaceClient from "@/components/atlas-v2/WorkspaceClient";

const BASE = process.env.ATLAS_BASE_URL ?? "https://aravind-systems-atlas.vercel.app";

export const metadata: Metadata = {
  title: "Your workspace — Aravind Systems Atlas",
  description:
    "Bookmarks and reading progress saved only in this browser. No account, no server, nothing transmitted: export and import move a local file you control.",
  alternates: { canonical: `${BASE}/workspace/` },
};

// Server-rendered shell only: the workspace list itself renders after mount
// (see WorkspaceClient), so without JavaScript there is no dead list — the
// noscript note below says so plainly.
export default function WorkspacePage() {
  const validSlugs = ATLAS_V2_CHAPTERS.map((c) => c.slug);
  const titles: Record<string, string> = {};
  for (const c of ATLAS_V2_CHAPTERS) titles[c.slug] = displayTitle(c.title);
  return (
    <main style={{ maxWidth: 780, margin: "0 auto", padding: "16px" }}>
      <p>
        <Link href="/">Home</Link> / Your workspace
      </p>
      <h1>Your workspace</h1>
      <p>
        Everything here lives only in this browser. There is no account, no
        sign-in, and no server copy: section bookmarks (saved from chapter
        pages) and per-chapter reading progress (furthest scroll depth
        reached) are stored in this browser&apos;s local storage. Export
        downloads them as a JSON file you control; import reads a file you
        choose. Nothing on this page is transmitted anywhere.
      </p>
      <p>
        Deleting workspace data clears bookmarks and reading progress only.
        Reader display settings, the theme choice, and correction drafts are
        separate stores with their own controls and are not cleared here.
      </p>
      <noscript>
        <p>
          The workspace list needs JavaScript, because the data lives in this
          browser. Without JavaScript this page cannot list your bookmarks or
          progress — nothing is shown as if it were your data, and reading
          itself is unaffected.
        </p>
      </noscript>
      <WorkspaceClient validSlugs={validSlugs} titles={titles} />
    </main>
  );
}
