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
                ? "bg-[var(--surface-strong)] shadow-md ring-1 ring-[var(--border)]"
                : "hover:bg-[var(--border)]"
            }`}
            style={
              active
                ? { color: "var(--accent)" }
                : { color: "var(--foreground)", opacity: 0.6 }
            }
          >
            <span className={`text-[11px] ${active ? "opacity-100" : "opacity-50"}`}>{l.icon}</span>
            {l.label}
            {active && (
              <span
                className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-t-full"
                style={{ background: "var(--accent)" }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
