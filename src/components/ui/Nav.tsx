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
    <nav className="flex gap-1 bg-white/80 backdrop-blur rounded-lg p-1 shadow-sm border">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
            pathname === l.href
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
