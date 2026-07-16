import type { Metadata } from "next";
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";
import { ModeSwitcher } from "@/components/ui/ModeSwitcher";
import { Nav } from "@/components/ui/Nav";
import { SearchBar } from "@/components/ui/SearchBar";

export const metadata: Metadata = { title: "MY E-Commerce COVID Dashboard", description: "TEB3133/TFB3133 Project" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <DashboardProvider>
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-slate-900">🇲🇾 MY E-Commerce Dashboard</h1>
                <p className="text-xs text-slate-500">TEB3133/TFB3133 Data Visualization Project</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <SearchBar />
                <Nav />
                <ModeSwitcher />
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        </DashboardProvider>
      </body>
    </html>
  );
}