"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/overview", label: "Overview" },
  { href: "/regional", label: "Regional" },
  { href: "/product", label: "Product" },
  { href: "/timeline", label: "Timeline" },
  { href: "/insights", label: "Insights" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 rounded-full border border-white/60 bg-white/70 p-1.5 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            pathname === l.href
              ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
