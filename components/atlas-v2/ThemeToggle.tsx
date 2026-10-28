"use client";
import { useEffect, useState } from "react";

// Site-wide dark-mode toggle (Phase 1 Commit D, D-07 binding rule).
// Stored choice ("light" | "dark") wins; with no stored choice the system
// preference applies. Without JS, the toggle does nothing and the CSS
// prefers-color-scheme fallback applies the system preference instead —
// the honest degraded state, recorded in the Phase 1 acceptance report.
// The toggle itself adds only this tiny client component to the shared
// layout chunk; every page stays server-rendered otherwise.
type Theme = "light" | "dark" | "system";

function resolve(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const stored = window.localStorage.getItem("atlas-theme");
    const initial: Theme = stored === "light" || stored === "dark" ? stored : "system";
    setTheme(initial);
    document.documentElement.dataset.theme = resolve(initial);
    setMounted(true);
  }, []);
  function toggle() {
    const next: Theme = resolve(theme) === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("atlas-theme", next);
    document.documentElement.dataset.theme = next;
  }
  const active = mounted ? resolve(theme) : null;
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle dark mode"
      aria-pressed={mounted ? active === "dark" : undefined}
    >
      {mounted ? (active === "dark" ? "Light" : "Dark") : "Theme"}
    </button>
  );
}
