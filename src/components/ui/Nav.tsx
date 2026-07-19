"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUserMode } from "@/hooks/useUserMode";

// Lucide icon paths from public/Icons/*.svg, inlined so they inherit the
// tab's text color (an <img> can't pick up currentColor).
const icons: Record<string, React.ReactNode> = {
  "layout-dashboard": (
    <>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
  package: (
    <>
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <path d="m7.5 4.27 9 5.15" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  "calendar-range": (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
      <path d="M17 14h-6" />
      <path d="M13 18H7" />
      <path d="M7 14h.01" />
      <path d="M17 18h.01" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  "id-card-lanyard": (
    <>
      <path d="M13.5 8h-3" />
      <path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" />
      <path d="M16.899 22A5 5 0 0 0 7.1 22" />
      <path d="m9 2 3 6" />
      <circle cx="12" cy="15" r="3" />
    </>
  ),
};

function NavIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

const links = [
  { href: "/overview", label: "Overview", icon: "layout-dashboard" },
  { href: "/regional", label: "Regional", icon: "globe" },
  { href: "/product", label: "Product", icon: "package" },
  { href: "/customer", label: "Customer", icon: "users" },
  { href: "/timeline", label: "Timeline", icon: "calendar-range" },
  { href: "/insights", label: "Insights", icon: "lightbulb" },
  { href: "/team", label: "Team", icon: "id-card-lanyard" },
];

export function Nav() {
  const pathname = usePathname();
  const userMode = useUserMode();
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

  // Simple View replaces this nav with the large ChildNav tiles in-page.
  if (userMode === "child") return null;

  return (
    <nav ref={navRef} className="relative flex flex-wrap items-center gap-1 rounded-[2px] bg-[var(--surface-muted)] p-1.5 shadow-inner" role="tablist">
      {/* Sliding Pill Background */}
      <div 
        className="absolute rounded-[2px] bg-[var(--surface-strong)] shadow-sm transition-all duration-300 ease-out"
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
            className="relative z-10 flex items-center gap-1.5 rounded-[2px] px-3.5 py-2 text-sm font-medium transition-colors duration-200"
            style={
              active
                ? { color: "var(--foreground)" }
                : { color: "var(--secondary, #5D8FA3)" }
            }
          >
            <span className={active ? "opacity-100" : "opacity-55"}>
              <NavIcon name={l.icon} />
            </span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
