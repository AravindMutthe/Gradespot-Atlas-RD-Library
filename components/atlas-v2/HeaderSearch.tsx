"use client";
import { useEffect, useRef } from "react";

// Global header search (Phase 3, G-10). Markup, classes, and ids are identical
// to the previous server-rendered form, so the site-search styles apply
// unchanged and the form still submits via GET without JavaScript. The only
// JavaScript enhancement is the "/" keyboard shortcut (focus the input) and
// Escape-to-blur. The shortcut is skipped while the visitor is already typing
// in any input, textarea, select, or editable element (including the /search
// page input and chapter search), and skipped with meta/ctrl/alt held.
export default function HeaderSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <form className="site-search" action="/search" method="get" role="search">
      <label htmlFor="site-search" className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
        Search the Atlas
      </label>
      <input ref={inputRef} id="site-search" name="q" type="search" placeholder="Search the Atlas…" onKeyDown={(e) => { if (e.key === "Escape") (e.target as HTMLInputElement).blur(); }} />
      <button type="submit">Search</button>
    </form>
  );
}
