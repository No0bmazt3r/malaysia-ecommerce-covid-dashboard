"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/overview", label: "Overview", icon: "◎" },
  { href: "/regional", label: "Regional", icon: "◈" },
  { href: "/product", label: "Product", icon: "◆" },
  { href: "/timeline", label: "Timeline", icon: "◇" },
  { href: "/insights", label: "Insights", icon: "◉" },
  { href: "/team", label: "Team", icon: "◫" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-0.5 rounded-xl bg-[var(--surface-muted)] p-1" role="tablist">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            role="tab"
            aria-selected={active}
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
              active
                ? "bg-[var(--surface-strong)] text-slate-950 shadow-sm dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span className="text-[10px] opacity-60">{l.icon}</span>
            {l.label}
            {active && (
              <span className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
