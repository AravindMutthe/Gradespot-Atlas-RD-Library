"use client";

import { useState } from "react";

type Node = { id: string; label: string };

/** Progressive enhancement over the server-rendered journey list:
 *  Prev/Next moves focus to the current step and announces it.
 *  Without JavaScript the full list and diagram remain usable. */
export default function NicJourney({ nodes }: { nodes: Node[] }) {
  const [current, setCurrent] = useState(0);
  const go = (i: number) => {
    const next = Math.max(0, Math.min(nodes.length - 1, i));
    setCurrent(next);
    document
      .getElementById(`node-${nodes[next].id}`)
      ?.querySelector("a, h3")
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    (document.getElementById(`node-${nodes[next].id}`) as HTMLElement | null)?.focus();
  };
  return (
    <div>
      <p>
        <button
          className="btn"
          type="button"
          disabled={current === 0}
          onClick={() => go(current - 1)}
        >
          ← Previous step
        </button>{" "}
        <button
          className="btn"
          type="button"
          disabled={current === nodes.length - 1}
          onClick={() => go(current + 1)}
        >
          Next step →
        </button>
      </p>
      <p role="status" aria-live="polite">
        Step {current + 1} of {nodes.length}: {nodes[current].label}.
      </p>
    </div>
  );
}
