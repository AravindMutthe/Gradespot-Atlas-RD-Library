import type { Metadata } from "next";
import CorrectionForm from "@/components/atlas-v2/CorrectionForm";

export const metadata: Metadata = {
  title: "Report a problem — Aravind Systems Atlas",
  description: "Record a factual correction, typo, or broken link for the Aravind Systems Atlas. Drafts are kept in your browser only until a submission channel is approved.",
};

export default function CorrectionsPage() {
  return (
    <main style={{ maxWidth: 780, margin: "0 auto", padding: "16px" }}>
      <p><a href="/">Home</a> / Report a problem</p>
      <h1>Report a problem / suggest a correction</h1>
      <p>
        Use this page to record a factual correction, a typo, or a broken link
        anywhere on the Atlas. A good report names the page, the section, what
        is wrong, what it should say, and the source for the correction, if any.
        Corrections are how this research library stays honest: a correction
        never silently rewrites history — a corrected release is published as a
        new tagged release, and the change is recorded.
      </p>
      <p>
        <strong>What this page does and does not do.</strong> Your draft is
        saved in this browser only (localStorage). Nothing is transmitted from
        this page: no submission channel has been approved yet, so no email
        address or form endpoint is published here. Download your draft or copy
        it, and keep it until a submission channel is announced. This is a
        partial implementation by design — claiming end-to-end submission
        would be false.
      </p>
      <CorrectionForm />
    </main>
  );
}
