export const PHASE_DEFINITIONS: Record<string, string> = {
  "Pre-MCO": "Before the Movement Control Order — business as usual (before 18 Mar 2020)",
  MCO: "Movement Control Order — full lockdown, only essential services (18 Mar – 3 May 2020)",
  CMCO: "Conditional MCO — partial reopening under strict SOPs (4 May – 9 Jun 2020)",
  RMCO: "Recovery MCO — most activity resumed with light restrictions (from 10 Jun 2020)",
};

const phases = [
  {
    code: "Pre-MCO",
    period: "Jan – 17 Mar 2020",
    detail: "Before the Movement Control Order. Business as usual, before COVID-19 restrictions.",
  },
  {
    code: "MCO",
    period: "18 Mar – 3 May 2020",
    detail: "Movement Control Order. Full lockdown: only essential travel and services allowed.",
  },
  {
    code: "CMCO",
    period: "4 May – 9 Jun 2020",
    detail: "Conditional MCO. Partial reopening: most businesses resumed under strict SOPs.",
  },
  {
    code: "RMCO",
    period: "from 10 Jun 2020",
    detail: "Recovery MCO. Most activity resumed with light restrictions through 2021.",
  },
];

export function PhaseGlossary() {
  return (
    <details className="rounded-[2px] border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
      <summary
        className="cursor-pointer select-none text-[11px] font-semibold uppercase"
        style={{ color: "var(--secondary, #5D8FA3)" }}
      >
        What do the phase names mean?
      </summary>
      <dl className="mt-3 space-y-2.5">
        {phases.map((p) => (
          <div key={p.code}>
            <dt className="text-[11px] font-semibold uppercase" style={{ color: "var(--foreground)" }}>
              {p.code}
              <span className="ml-1.5 font-normal" style={{ color: "var(--secondary, #5D8FA3)" }}>
                {p.period}
              </span>
            </dt>
            <dd className="mt-0.5 text-xs leading-5" style={{ color: "var(--secondary, #5D8FA3)" }}>
              {p.detail}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
