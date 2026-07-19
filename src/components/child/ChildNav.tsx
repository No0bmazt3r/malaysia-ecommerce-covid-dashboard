"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Truck, ShoppingCart, Smile } from "lucide-react";

const tiles = [
  { href: "/overview", label: "How Much Did We Sell?", icon: ShoppingBag, color: "var(--viz-good, #0CA678)" },
  { href: "/regional", label: "Did Packages Arrive?", icon: Truck, color: "var(--secondary, #5D8FA3)" },
  { href: "/product", label: "What Did People Buy?", icon: ShoppingCart, color: "var(--viz-ok, #D98A00)" },
  { href: "/customer", label: "Are Customers Happy?", icon: Smile, color: "var(--accent, #63B7B2)" },
];

export function ChildNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Simple view pages" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((t) => {
        const Icon = t.icon;
        const active = pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`dashboard-card flex min-h-[112px] flex-col items-center justify-center gap-2.5 rounded-[var(--card-radius)] p-4 text-center transition active:scale-95 ${
              active ? "ring-2" : "hover:ring-1"
            }`}
            style={{ ["--tw-ring-color" as string]: t.color }}
          >
            <Icon aria-hidden="true" className="h-10 w-10" strokeWidth={2} style={{ color: t.color }} />
            <span className="text-base font-bold leading-snug" style={{ color: "var(--foreground)" }}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
