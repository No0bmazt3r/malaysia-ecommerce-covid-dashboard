import type { Metadata } from "next";
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";
import { Nav } from "@/components/ui/Nav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Malaysia E-Commerce × COVID Dashboard",
  description:
    "Interactive dashboard exploring Malaysia e-commerce performance across COVID-19 phases. TEB3133/TFB3133 Data Visualization Project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="ambient-bg min-h-screen antialiased">
        <DashboardProvider>
          {/* Animated accent bar */}
          <div className="header-gradient-bar" />

          <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3">
              {/* Left: brand + nav */}
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                    MY
                  </span>
                  <div className="hidden sm:block">
                    <h1 className="display-heading text-base text-slate-950 dark:text-white">
                      E-Commerce × COVID
                    </h1>
                    <p className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400">
                      Group 8 • TEB3133 / TFB3133
                    </p>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Nav />
                </div>
              </div>

              {/* Right: controls */}
              <div className="flex items-center gap-2.5">
                <ThemeToggle />
              </div>
            </div>
            {/* Mobile nav */}
            <div className="border-t border-[var(--border)] px-5 py-2 lg:hidden">
              <Nav />
            </div>
          </header>

          <main className="page-enter mx-auto max-w-[1400px] px-5 py-6 space-y-8">
            {children}
          </main>

          <footer className="border-t border-[var(--border)] mt-12">
            <div className="mx-auto max-w-[1400px] px-5 py-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Group 8 • Malaysia E-Commerce COVID Dashboard</span>
              <span>TEB3133 / TFB3133 Data Visualization</span>
            </div>
          </footer>
        </DashboardProvider>
      </body>
    </html>
  );
}