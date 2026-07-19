"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type TipState = { x: number; y: number; title: string; value: string; color: string };

const TIP_WIDTH = 240;

/* Shared Simple View tooltip: one big readable box that follows the
   pointer, anchors under the mark on keyboard focus, and on touch works
   as tap-to-toggle (tap shows, tap again hides, tap elsewhere or scroll
   dismisses). The mark's color lives on the border and dot — text stays
   in text tokens. */
export function useChildTooltip() {
  const [tip, setTip] = useState<TipState | null>(null);
  // Which mark's tooltip is pinned open by a tap (null = hover/focus only)
  const pinnedRef = useRef<string | null>(null);

  const show = useCallback(
    (e: { clientX: number; clientY: number }, title: string, value: string, color: string) => {
      pinnedRef.current = null;
      setTip({ x: e.clientX, y: e.clientY, title, value, color });
    },
    []
  );

  const anchorToElement = (el: Element, title: string, value: string, color: string): TipState => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.bottom, title, value, color };
  };

  const showForElement = useCallback((el: Element, title: string, value: string, color: string) => {
    pinnedRef.current = null;
    setTip(anchorToElement(el, title, value, color));
  }, []);

  /* Touch: call from onPointerDown (pointerType === "touch") with
     preventDefault + stopPropagation so the outside-tap listener below
     doesn't immediately dismiss what this tap opened. */
  const toggleForElement = useCallback(
    (el: Element, key: string, title: string, value: string, color: string) => {
      if (pinnedRef.current === key) {
        pinnedRef.current = null;
        setTip(null);
        return;
      }
      pinnedRef.current = key;
      setTip(anchorToElement(el, title, value, color));
    },
    []
  );

  const hide = useCallback(() => {
    pinnedRef.current = null;
    setTip(null);
  }, []);

  // A pinned tooltip dismisses on a tap anywhere else or on scroll
  useEffect(() => {
    if (!tip) return;
    const dismissPinned = () => {
      if (pinnedRef.current !== null) {
        pinnedRef.current = null;
        setTip(null);
      }
    };
    document.addEventListener("pointerdown", dismissPinned);
    window.addEventListener("scroll", dismissPinned, true);
    return () => {
      document.removeEventListener("pointerdown", dismissPinned);
      window.removeEventListener("scroll", dismissPinned, true);
    };
  }, [tip]);

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

  return { show, showForElement, toggleForElement, hide, node };
}

/* Builds the shared handler set for a tappable/hoverable mark. */
export function childTipHandlers(
  tip: ReturnType<typeof useChildTooltip>,
  key: string,
  title: string,
  value: string,
  color: string
) {
  return {
    tabIndex: 0,
    "aria-label": `${title}: ${value}`,
    onMouseEnter: (e: React.MouseEvent) => tip.show(e, title, value, color),
    onMouseMove: (e: React.MouseEvent) => tip.show(e, title, value, color),
    onMouseLeave: tip.hide,
    onFocus: (e: React.FocusEvent) => tip.showForElement(e.currentTarget, title, value, color),
    onBlur: tip.hide,
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "touch") {
        e.preventDefault();
        e.stopPropagation();
        tip.toggleForElement(e.currentTarget, key, title, value, color);
      }
    },
  };
}
