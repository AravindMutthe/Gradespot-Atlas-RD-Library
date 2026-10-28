"use client";
import { useEffect, useState } from "react";

// Correction draft recorder (Phase 2, G-15 part). PARTIAL by design: the
// draft is saved to this browser's localStorage, and can be downloaded or
// copied. NOTHING is transmitted — no submission channel (endpoint, email,
// issue tracker) has been approved, so none is wired in and none is claimed.
// The transmission channel is an owner decision owed, not assumed here.
const DRAFT_KEY = "atlas-v2-correction-draft";

export default function CorrectionForm() {
  const [page, setPage] = useState("");
  const [section, setSection] = useState("");
  const [kind, setKind] = useState("Factual correction");
  const [wrong, setWrong] = useState("");
  const [should, setShould] = useState("");
  const [source, setSource] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Record<string, string>;
        if (typeof d.page === "string") setPage(d.page);
        if (typeof d.section === "string") setSection(d.section);
        if (typeof d.kind === "string") setKind(d.kind);
        if (typeof d.wrong === "string") setWrong(d.wrong);
        if (typeof d.should === "string") setShould(d.should);
        if (typeof d.source === "string") setSource(d.source);
        if (typeof d.name === "string") setName(d.name);
        setStatus("Restored your saved draft from this browser.");
      }
    } catch { setStatus("Could not read a saved draft (browser storage unavailable)."); }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ page, section, kind, wrong, should, source, name }));
    } catch { /* storage unavailable: draft simply is not persisted */ }
  }, [page, section, kind, wrong, should, source, name]);

  const text = [
    "Aravind Systems Atlas — correction report (draft, not submitted)",
    `Page: ${page || "(not given)"}`,
    `Section: ${section || "(not given)"}`,
    `Type: ${kind}`,
    `What is wrong: ${wrong || "(not given)"}`,
    `What it should say: ${should || "(not given)"}`,
    `Source for the correction: ${source || "(not given)"}`,
    `Your name (optional): ${name || "(not given)"}`,
  ].join("\n");

  function download() {
    try {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "atlas-correction-draft.txt"; a.click();
      URL.revokeObjectURL(url);
      setStatus("Downloaded as atlas-correction-draft.txt. Nothing was sent anywhere.");
    } catch { setStatus("Download failed in this browser — use Copy instead."); }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard. Nothing was sent anywhere.");
    } catch { setStatus("Copy failed in this browser — select the preview text below and copy it manually."); }
  }

  function clear() {
    try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    setPage(""); setSection(""); setKind("Factual correction"); setWrong(""); setShould(""); setSource(""); setName("");
    setStatus("Draft cleared from this browser.");
  }

  const field = { display: "block", width: "100%", padding: "8px 10px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", marginTop: 4 } as const;
  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gap: 12, marginTop: 16 }}>
      <label>Page (URL or chapter title)<input value={page} onChange={(e) => setPage(e.target.value)} style={field} placeholder="/from-silicon-to-a-working-nic" /></label>
      <label>Section<input value={section} onChange={(e) => setSection(e.target.value)} style={field} placeholder="e.g. Beat 02, paragraph 3" /></label>
      <label>Type<select value={kind} onChange={(e) => setKind(e.target.value)} style={field}>
        <option>Factual correction</option><option>Typo</option><option>Broken link</option><option>Other</option>
      </select></label>
      <label>What is wrong<textarea value={wrong} onChange={(e) => setWrong(e.target.value)} rows={3} style={field} /></label>
      <label>What it should say<textarea value={should} onChange={(e) => setShould(e.target.value)} rows={3} style={field} /></label>
      <label>Source for the correction (optional)<input value={source} onChange={(e) => setSource(e.target.value)} style={field} /></label>
      <label>Your name (optional)<input value={name} onChange={(e) => setName(e.target.value)} style={field} /></label>
      <p aria-live="polite" style={{ fontSize: "0.9rem" }}>{status || "Your draft saves in this browser as you type. Nothing is sent."}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button type="button" onClick={download} style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--navy)", color: "#fff", cursor: "pointer", minHeight: 44 }}>Download draft</button>
        <button type="button" onClick={copy} style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", cursor: "pointer", minHeight: 44 }}>Copy draft</button>
        <button type="button" onClick={clear} style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", cursor: "pointer", minHeight: 44 }}>Clear draft</button>
      </div>
      <details>
        <summary>Draft preview (what download/copy contains)</summary>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, padding: 12 }}>{text}</pre>
      </details>
    </form>
  );
}
