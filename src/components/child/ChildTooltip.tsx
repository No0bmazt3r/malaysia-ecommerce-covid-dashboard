"use client";
import { useCallback, useState, type ReactNode } from "react";

type TipState = { x: number; y: number; title: string; value: string; color: string };

const TIP_WIDTH = 240;

/* Shared Simple View tooltip: one big readable box that follows the
   pointer (or anchors under the mark on keyboard focus). The mark's color
   lives on the border and dot — text stays in text tokens. */
export function useChildTooltip() {
  const [tip, setTip] = useState<TipState | null>(null);

  const show = useCallback(
    (e: { clientX: number; clientY: number }, title: string, value: string, color: string) => {
      setTip({ x: e.clientX, y: e.clientY, title, value, color });
    },
    []
  );

  const showForElement = useCallback((el: Element, title: string, value: string, color: string) => {
    const r = el.getBoundingClientRect();
    setTip({ x: r.left + r.width / 2, y: r.bottom, title, value, color });
  }, []);

  const hide = useCallback(() => setTip(null), []);

  let node: ReactNode = null;
  if (tip) {
    const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
    const left = Math.max(8, Math.min(tip.x + 14, viewportW - TIP_WIDTH - 8));
    node = (
      <div
        className="pointer-events-none fixed z-50 rounded-[2px] border-2 px-3.5 py-2.5"
        style={{
          left,
          top: tip.y + 14,
          width: "max-content",
          maxWidth: TIP_WIDTH,
          borderColor: tip.color,
          background: "var(--surface-strong)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex items-center gap-2 text-[15px] font-bold" style={{ color: "var(--foreground)" }}>
          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[2px]" style={{ background: tip.color }} />
          {tip.title}
        </div>
        <div className="mt-0.5 text-lg font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--foreground)" }}>
          {tip.value}
        </div>
      </div>
    );
  }

  return { show, showForElement, hide, node };
}
