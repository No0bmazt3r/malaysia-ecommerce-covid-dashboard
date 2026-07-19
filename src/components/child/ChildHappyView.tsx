"use client";
import { useMemo } from "react";
import { Smile, Meh, Frown, Star } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { ChildScreen } from "./ChildScreen";
import { useChildTooltip } from "./ChildTooltip";

/* Icon array of 10 faces built from the rating distribution:
   happy = rating 4–5, okay = 3, sad = 1–2. Face shape + word chip carry
   the state alongside color. */
export function ChildHappyView() {
  const { rawData, loading } = useDashboard();
  const tip = useChildTooltip();

  const { faces, pct, avg } = useMemo(() => {
    if (rawData.length === 0)
      return { faces: { happy: 0, okay: 0, sad: 0 }, pct: { happy: 0, okay: 0, sad: 0 }, avg: 0 };
    const total = rawData.length;
    const happyShare = rawData.filter((r) => r.customer_rating >= 4).length / total;
    const okayShare = rawData.filter((r) => r.customer_rating === 3).length / total;
    const happy = Math.round(happyShare * 10);
    const okay = Math.min(Math.round(okayShare * 10), 10 - happy);
    const happyPct = Math.round(happyShare * 100);
    const okayPct = Math.round(okayShare * 100);
    return {
      faces: { happy, okay, sad: 10 - happy - okay },
      pct: { happy: happyPct, okay: okayPct, sad: 100 - happyPct - okayPct },
      avg: rawData.reduce((s, r) => s + r.customer_rating, 0) / total,
    };
  }, [rawData]);

  if (loading) {
    return (
      <ChildScreen title="Are Customers Happy?" sentence="Asking everyone…">
        <div className="h-[220px] w-full rounded-[2px] skeleton-shimmer" />
      </ChildScreen>
    );
  }

  const sentence =
    faces.happy >= 6 ? "Most customers are happy!" : faces.happy >= 4 ? "Some customers are happy, some are not." : "Many customers are not happy.";

  const row = [
    ...Array.from({ length: faces.happy }, () => "happy" as const),
    ...Array.from({ length: faces.okay }, () => "okay" as const),
    ...Array.from({ length: faces.sad }, () => "sad" as const),
  ];
  const faceStyle = {
    happy: { Icon: Smile, color: "var(--viz-good, #0CA678)", word: "Happy" },
    okay: { Icon: Meh, color: "var(--viz-ok, #D98A00)", word: "Okay" },
    sad: { Icon: Frown, color: "var(--viz-bad, #E03131)", word: "Sad" },
  };

  return (
    <ChildScreen title="Are Customers Happy?" sentence={sentence}>
      <div className="flex items-center justify-center gap-2 text-5xl font-bold" style={{ fontFamily: "var(--font-mono)", color: "var(--foreground)" }}>
        {avg.toFixed(1)}
        <Star aria-label="stars out of 5" className="h-10 w-10" fill="var(--viz-ok, #D98A00)" style={{ color: "var(--viz-ok, #D98A00)" }} />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3" role="img" aria-label={`Out of every 10 customers: ${faces.happy} happy, ${faces.okay} okay, ${faces.sad} sad.`}>
        {row.map((kind, i) => {
          const { Icon, color, word } = faceStyle[kind];
          const value = `${pct[kind]}% of customers`;
          return (
            <span
              key={i}
              tabIndex={0}
              className="focus:outline-none"
              aria-label={`${word}: ${value}`}
              onMouseEnter={(e) => tip.show(e, word, value, color)}
              onMouseMove={(e) => tip.show(e, word, value, color)}
              onMouseLeave={tip.hide}
              onFocus={(e) => tip.showForElement(e.currentTarget, word, value, color)}
              onBlur={tip.hide}
            >
              <Icon aria-hidden="true" className="h-14 w-14 md:h-16 md:w-16" strokeWidth={2} style={{ color }} />
            </span>
          );
        })}
      </div>
      {tip.node}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
        {(["happy", "okay", "sad"] as const).map((kind) => {
          const { Icon, color, word } = faceStyle[kind];
          return (
            <span key={kind} className="inline-flex items-center gap-2 rounded-[2px] px-3 py-2 text-base font-bold text-white" style={{ background: color }}>
              <Icon aria-hidden="true" className="h-5 w-5" /> {word}
            </span>
          );
        })}
      </div>
    </ChildScreen>
  );
}
