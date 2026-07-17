"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/overview", label: "Overview", icon: "◎" },
  { href: "/regional", label: "Regional", icon: "◈" },
  { href: "/product", label: "Product", icon: "◆" },
  { href: "/customer", label: "Customer", icon: "◒" },
  { href: "/timeline", label: "Timeline", icon: "◇" },
  { href: "/insights", label: "Insights", icon: "◉" },
  { href: "/team", label: "Team", icon: "◫" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 rounded-xl bg-[var(--surface-muted)] p-1.5" role="tablist">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            role="tab"
            aria-selected={active}
            className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${
              active
                ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-900/5 dark:bg-slate-800 dark:text-indigo-400 dark:ring-white/10"
                : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
            }`}
          >
            <span className={`text-[11px] ${active ? "opacity-100" : "opacity-50"}`}>{l.icon}</span>
            {l.label}
            {active && (
              <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-t-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
