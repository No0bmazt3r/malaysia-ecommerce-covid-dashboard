import type { Metadata } from "next";
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";
import { ModeSwitcher } from "@/components/ui/ModeSwitcher";
import { Nav } from "@/components/ui/Nav";
import { SearchBar } from "@/components/ui/SearchBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = { title: "MY E-Commerce COVID Dashboard", description: "TEB3133/TFB3133 Project" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased text-slate-900 dark:text-slate-100">
        <DashboardProvider>
          <header className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/60">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
                  Malaysia E-Commerce Analysis
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Modern COVID dashboard for sales, supply chain, and customer signals
                </h1>
                <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                  TEB3133/TFB3133 Data Visualization Project with shared filters, D3 analysis, and multi-mode presentation.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                  <SearchBar />
                  <ThemeToggle />
                </div>
                <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                  <Nav />
                  <ModeSwitcher />
                </div>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </DashboardProvider>
      </body>
    </html>
  );
}