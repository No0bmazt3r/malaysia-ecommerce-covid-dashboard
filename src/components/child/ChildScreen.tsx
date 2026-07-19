"use client";
import { ReactNode } from "react";
import { ChildNav } from "./ChildNav";

/* Shared shell for every Simple View screen: big nav tiles on top,
   one big visual, one plain-language sentence. */
export function ChildScreen({
  title,
  sentence,
  children,
}: {
  title: string;
  sentence: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <ChildNav />
      <section className="dashboard-card rounded-[var(--section-radius)] p-6 md:p-8">
        <h2 className="display-heading text-center text-3xl" style={{ color: "var(--foreground)" }}>
          {title}
        </h2>
        <div className="mt-6">{children}</div>
        <p className="mx-auto mt-6 max-w-xl text-center text-xl font-semibold leading-relaxed" style={{ color: "var(--foreground)" }}>
          {sentence}
        </p>
      </section>
    </div>
  );
}
