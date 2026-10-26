"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { V1_SECTIONS } from "./atlas-v1-data";

export default function AtlasSidebar() {
  const pathname = usePathname();
  return (
    <aside>
      <Link href="/" className={pathname === "/" ? "active" : ""}>🏠 Overview</Link>
      {V1_SECTIONS.map((s, i) => {
        const href = `/${s.slug}`;
        return (
          <Link key={s.slug} href={href} className={pathname === href ? "active" : ""}>
            {String(i + 1).padStart(2, "0")} · {s.title}
          </Link>
        );
      })}
    </aside>
  );
}
