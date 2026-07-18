"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const navRef = useRef<HTMLElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  useEffect(() => {
    function updatePill() {
      if (!navRef.current) return;
      
      const activeEl = navRef.current.querySelector('[aria-selected="true"]') as HTMLElement;
      if (activeEl) {
        setPillStyle({
          left: activeEl.offsetLeft,
          top: activeEl.offsetTop,
          width: activeEl.offsetWidth,
          height: activeEl.offsetHeight,
          opacity: 1
        });
      } else {
        setPillStyle(prev => ({ ...prev, opacity: 0 }));
      }
    }

    // Run immediately
    updatePill();
    
    // Also run after a tiny delay to ensure layout has painted (fonts loading, etc)
    const timeout = setTimeout(updatePill, 50);
    window.addEventListener("resize", updatePill);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updatePill);
    };
  }, [pathname]);

  return (
    <nav ref={navRef} className="relative flex flex-wrap items-center gap-1 rounded-lg bg-[var(--surface-muted)] p-1.5 shadow-inner" role="tablist">
      {/* Sliding Pill Background */}
      <div 
        className="absolute rounded-md bg-[var(--surface-strong)] shadow-sm transition-all duration-300 ease-out"
        style={{
          left: `${pillStyle.left}px`,
          top: `${pillStyle.top}px`,
          width: `${pillStyle.width}px`,
          height: `${pillStyle.height}px`,
          opacity: pillStyle.opacity
        }}
      />
      
      {links.map((l) => {
        // More robust active checking just in case
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            role="tab"
            aria-selected={active}
            className="relative z-10 flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors duration-200"
            style={
              active
                ? { color: "var(--foreground)" }
                : { color: "var(--secondary, #5D8FA3)" }
            }
          >
            <span className={`text-[11px] ${active ? "opacity-100" : "opacity-60"}`}>{l.icon}</span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
