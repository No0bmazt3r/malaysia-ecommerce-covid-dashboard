# Malaysia E-Commerce COVID Dashboard

An interactive Next.js dashboard for exploring Malaysia e-commerce performance across COVID-19 phases. The app combines cross-filtering, KPI summaries, D3 visualizations, and a light/dark theme to support analysis of revenue, delivery, stockout, and customer sentiment patterns.

Built for the TEB3133 / TFB3133 Data Visualization project (Group 8).

## What This App Does

- Loads the cleaned dataset from `public/data/malaysia_ecommerce_covid_clean.csv`.
- Filters data by date, COVID phase, state, category, segment, and free-text search, with active filters shown as removable pills.
- Renders KPI summaries, a monthly revenue trend, a state-by-phase heat map, scatter plot matrices, category/segment breakdowns, and a project timeline.
- Supports light and dark themes, persisted to `localStorage` and synced across all charts.
- Uses shared dashboard state so filter and theme changes apply across the whole experience.
- Some charts (the regional heat map) support click-to-cross-filter, writing the selection back into the shared filter state.

## Tech Stack

- Next.js App Router (v16)
- React 19
- TypeScript
- Tailwind CSS v4
- D3.js for chart rendering
- PapaParse for CSV ingestion

## Project Structure

- `src/app` contains the routes and the root layout (nav, theme toggle, header, footer).
- `src/components/ui` contains the top-level dashboard controls: filter panel, KPI cards, phase glossary, nav, theme toggle.
- `src/components/charts` contains the D3 visualizations (one component per chart, each owning its own `<svg>` ref and render effect).
- `src/context/DashboardContext.tsx` stores the shared filters, loading state, raw dataset, and derived filtered dataset.
- `src/hooks/useDashboardTheme.ts` reads the active light/dark theme from the DOM and re-syncs when `ThemeToggle` broadcasts a change, so charts can re-color without subscribing to the whole dashboard context.
- `src/lib/data.ts` loads and parses the CSV (cached after first load).
- `src/lib/filters.ts` applies filters and computes KPI values.
- `src/lib/types.ts` defines the dataset model and filter state.

## Routes

- `/overview` — the main dashboard: hero summary, KPI cards, filter panel, monthly revenue trend, regional heat map, mini scatter matrix, and project timeline.
- `/regional` — state and phase revenue heat map, state sales bar chart, category-by-state stacked bar, and state delivery time trend.
- `/product` — tabbed view for product performance (category treemap, category mosaic, top products by revenue) and correlation analysis (full scatter matrix).
- `/customer` — customer segment donut chart, segment-by-phase grouped bar chart, and customer age scatter plot.
- `/timeline` — project milestone timeline, cross-referenced against MCO/CMCO/RMCO phase boundaries.
- `/insights` — written findings from the analysis (anomalies, clusters, and debunked assumptions).
- `/team` — project team roster.

The root route redirects to `/overview`.

## Data Flow

1. `DashboardProvider` loads and caches the CSV once on the client.
2. Filters are stored in shared React context state.
3. `filteredData` is derived via `useMemo` from the raw dataset and current filters.
4. Chart components consume `filteredData` directly and re-render their D3 SVG on every relevant change.
5. Some charts (the heat map) support cross-filtering by writing back into the shared filter state on click.

## Design System

- Colors, typography, and spacing are defined as CSS custom properties in `src/app/globals.css`, with a full dark-mode override set under `:root[data-theme="dark"]`.
- Palette: Deep Navy `#0B2A4A` (primary), Dusty Blue `#5D8FA3` (secondary), Soft Turquoise `#63B7B2` (accent), Warm Grey `#C6C1BC` (neutral), Soft Cream `#F6F3EC` (decorative), plus status colors for success/warning/critical states. See `public/SUGGESTED COLOR CODE.png` for the source palette.
- Typography: Archivo for display headings, Inter for body text, and IBM Plex Mono for data values, labels, and figure numbers.
- Shared surface utilities (`.dashboard-card`, `.dashboard-surface`) and radius/shadow tokens keep cards consistent across every page.
- A statistical-report identity: 2px corner radii, a faint graph-paper background, auto-numbered `FIG.` tags on every chart card, skeleton loading states, and a page fade-in animation.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Deployment

Deploys to Vercel through the manual GitHub Actions workflow in
`.github/workflows/production-deployment.yml`. The workflow runs `eslint` and
`tsc --noEmit` before building, so a broken build never reaches production.

## Team

Group 8:

| Name | Student ID |
|---|---|
| Nurul Hawardah Binti Mohammad Yusoff | 22007264 |
| Wan Nur Ariana Sofea Binti Wan Zaki | 22011056 |
| Zuyyin Damia Binti Norazmi | 22007506 |
| Muhammad Ibrahim Al-Imran Bin Mohd Isa | 22006656 |
| Sharvin A/L Kanesan | 22006930 |

## Future Improvements

- Extract the shared D3 boilerplate (margins, axis styling, tooltip lifecycle) in the 14 chart components into a common hook.
- Move the Google Fonts `@import` to `next/font` so fonts are self-hosted.
- Persist filter state in the URL so a filtered view can be shared as a link.
