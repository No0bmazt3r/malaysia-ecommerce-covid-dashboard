# Malaysia E-Commerce × COVID Dashboard

An interactive data-visualization dashboard exploring how Malaysian e-commerce performed across the COVID-19 movement-control phases (Pre-MCO, MCO, CMCO, RMCO) from January 2020 to December 2021. Built with Next.js, React, TypeScript, D3.js, and Tailwind CSS for the **TEB3133 / TFB3133 Data Visualization** course project.

> **Full feature documentation:** every chart, view, and user mode is explained and justified against visualization best practice in **[FEATURES.md](./FEATURES.md)**.

## Team — Group 8

| Picture | Name | Student ID |
| :---: | --- | :---: |
| <img src="public/Wardah.svg" width="80" alt="Avatar of Nurul Hawardah" /> | Nurul Hawardah Binti Mohammad Yusoff | 22007264 |
| <img src="public/Ariana3.svg" width="80" alt="Avatar of Wan Nur Ariana Sofea" /> | Wan Nur Ariana Sofea Binti Wan Zaki | 22011056 |
| <img src="public/Zuyyin2.svg" width="80" alt="Avatar of Zuyyin Damia" /> | Zuyyin Damia Binti Norazmi | 22007506 |
| <img src="public/Baim.svg" width="80" alt="Avatar of Muhammad Ibrahim Al-Imran" /> | Muhammad Ibrahim Al-Imran Bin Mohd Isa | 22006656 |
| <img src="public/Sharvin.svg" width="80" alt="Avatar of Sharvin" /> | Sharvin A/L Kanesan | 22006930 |

## Highlights

- **3,500-order dataset** (`public/data/malaysia_ecommerce_covid_clean.csv`) covering revenue, delivery, inventory, marketing, and customer-satisfaction dimensions across Malaysian states and four COVID phases.
- **14 coordinated D3 visualizations** — line, bar, stacked bar, grouped bar, donut, treemap, mosaic, heat map, scatter matrix, and timeline — all driven by one shared filter state.
- **Cross-filtering**: clicking a heat-map cell writes the selection back into the global filters, updating every chart and KPI at once.
- **Three user modes** (user-centered design): **Standard** for adult analysts, **Large Text** for elderly users, and **Simple View** for early-childhood users — switchable at runtime from the header.
- **Light & dark themes**, independently toggleable and persisted, with charts re-coloring live.
- **Colorblind-safe palettes**: the Simple View traffic-light palette was validated computationally for CVD separation, lightness band, and surface contrast — separately for light and dark themes.
- **Accessible by default**: keyboard-focusable marks with ARIA labels, tooltips on hover/tap/focus, ≥44px touch targets in Large Text mode, visible focus rings, and `prefers-reduced-motion` support.

## User Modes

| Mode | Audience | What changes |
| --- | --- | --- |
| **Standard** | Adults / analysts | Full six-filter panel, cross-filtering, drill-down tabs, 6×6 scatter matrix, dense KPI grid — the complete dashboard. |
| **Large Text** | Elderly users | 18px base font, heavier body weight, high-contrast text and borders, ≥44px touch targets, 3 primary filters (+ collapsible advanced section), one large two-variable scatter instead of the scatter matrix. |
| **Simple View** | Early childhood | 4 big question tiles replace the nav, icon-based KPI tiles, pictograms and traffic-light coding always paired with icon + word labels, no filters, one visual and one plain sentence per screen. |

The mode switcher sits in the header next to the theme toggle; both persist to `localStorage`. See [FEATURES.md](./FEATURES.md) for the design justification of each mode.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Charts | D3.js v7 |
| Data | PapaParse (CSV ingestion, cached client-side) |
| UI primitives | Radix UI (slider), lucide-react (icons) |
| CI/CD | GitHub Actions → Vercel (lint, type-check, build, deploy) |

## Getting Started

```bash
pnpm install        # install dependencies
pnpm dev            # start the dev server at http://localhost:3000
pnpm build          # production build
pnpm start          # serve the production build
pnpm lint           # run ESLint
```

The root route redirects to `/overview`.

## Routes

| Route | Purpose |
| --- | --- |
| `/overview` | Hero summary, 6 KPI cards, filter panel, monthly revenue trend, heat map, correlation overview, project timeline |
| `/regional` | Sales by state, delivery-time trends, category distribution by state, State × Phase heat map |
| `/product` | Tabbed: performance (treemap, mosaic, top products) and correlation (6×6 scatter matrix) |
| `/customer` | Segment donut, segment revenue by phase, age vs. order value scatter |
| `/timeline` | Project milestones cross-referenced with MCO/CMCO/RMCO boundaries |
| `/insights` | Written analytical findings (anomalies, clusters, debunked assumptions) |
| `/team` | Project team roster |

## Why These Charts

Each visualization was chosen against established data-visualization guidance:
Cleveland & McGill's ranking of visual encodings (position and length are decoded
most accurately; color/saturation least), ColorBrewer's sequential color schemes
for magnitude, Tufte's data-ink ratio (remove decoration that carries no data),
and Shneiderman's information-seeking mantra ("overview first, zoom and filter,
then details-on-demand") — which is the structure of the whole dashboard:
the overview page summarizes, the filter panel narrows, and tooltips give details.

| Chart | Page | Why this chart / best practice applied |
|---|---|---|
| KPI cards | Overview | Headline figures deserve plain numbers, not charts — a stat tile is the highest data-ink form for a single value. |
| Monthly revenue line chart | Overview | Time series → position on a common scale, the most accurately decoded encoding (Cleveland & McGill). Line shows trend; area fill adds magnitude context. |
| Revenue heat map (state × phase) | Overview, Regional | Two categorical dimensions × one measure → matrix. Magnitude uses the ColorBrewer YlOrRd sequential ramp (light→dark = low→high, perceptually ordered). Cells click to cross-filter (details-on-demand). |
| Sales by state bar chart | Regional | Ranking → sorted horizontal bars: length on a common baseline is decoded almost as accurately as position. The Sabah anomaly is pre-attentively highlighted in a contrast hue. |
| Delivery time line chart | Regional | Trend comparison limited to the top 5 states — capping series count avoids an unreadable "spaghetti" chart. |
| Category × state stacked bar | Regional | Part-to-whole composition per state; 2px gaps separate segments so adjacent colors never touch. |
| Category treemap | Product | Part-to-whole across many categories → area encoding scales better than a pie beyond ~5 slices; direct labels avoid a color-lookup legend. |
| Category mosaic plot | Product | Two categorical dimensions as proportional areas — shows joint distribution that two separate bar charts would hide. |
| Top products bar chart | Product | Ranking → sorted bars (length encoding), cut to top 10 to keep labels legible. |
| Scatter plot matrix | Product | Correlation across 6 numeric variables → scatter plots are the canonical bivariate-relationship form; points are sampled per cell for responsiveness, with color = COVID phase and a legend. |
| Segment donut chart | Customer | Part-to-whole with only 3 segments (safe range for a pie form); the center shows the total so the hole carries data; legend lists exact values because the soft brand hues are low-contrast. |
| Segment grouped bar chart | Customer | Comparing segments *within* each phase → grouped bars keep every value on a common baseline, unlike stacking. |
| Customer age scatter plot | Customer | Distribution/spread of individual orders across age groups — shows outliers that averages would hide. |
| Project timeline | Timeline, Overview | Temporal milestones → position along a time axis, with the dataset's real MCO phase boundaries as context. |

Cross-cutting practices: every multi-series chart has a legend, color is never
the only carrier of identity (labels and tooltips repeat it), grids and axes are
kept recessive, all charts share hover details-on-demand, and empty/loading
states are designed rather than blank. See [FEATURES.md](./FEATURES.md) for the
chart-by-chart deep dive.

## Project Structure

```
src/
├── app/                  # routes, root layout, global CSS tokens
├── components/
│   ├── charts/           # 14 D3 chart components (one <svg> each)
│   ├── ui/               # filter panel, KPI cards, nav, theme & mode toggles
│   ├── child/            # Simple View components (tiles, pictograms, shared tooltip)
│   └── elderly/          # Large Text components (collapsed filters, single scatter)
├── context/              # DashboardContext: filters, dataset, filteredData
├── hooks/                # useDashboardTheme, useUserMode (DOM-synced globals)
└── lib/                  # CSV loading, filter logic, KPI math, types
```

## Data Flow

1. `DashboardProvider` loads and caches the CSV once on the client.
2. Filters live in shared React context; `filteredData` is derived with `useMemo`.
3. Every chart consumes `filteredData` and re-renders its SVG on change.
4. The heat map writes click selections back into the filters (cross-filtering).
5. Theme and user mode are broadcast via DOM attributes + events, so charts re-style without re-mounting.

## Design System

- **Palette**: Deep Navy `#0B2A4A`, Dusty Blue `#5D8FA3`, Soft Turquoise `#63B7B2`, Warm Grey `#C6C1BC`, Soft Cream `#F6F3EC`, plus reserved status colors — a printed-statistical-report identity with 2px radii, auto-numbered `FIG.` tags, and a faint graph-paper background.
- **Typography**: Archivo (display), Inter (body), IBM Plex Mono (data values, axis labels, figure numbers).
- **Tokens**: all colors are CSS custom properties in `src/app/globals.css`, with override sets for `[data-theme="dark"]`, `[data-usermode="elderly"]`, and `[data-usermode="child"]`.

## Deployment

Production deploys run through the manual GitHub Actions workflow in `.github/workflows/production-deployment.yml`: lint → type-check → Vercel build → deploy, on Node.js 24 with all actions targeting the Node 24 runtime. A broken build never reaches production.

## Future Improvements

- Extract the shared D3 boilerplate (margins, axis styling, tooltip lifecycle) into a common hook.
- Move the Google Fonts `@import` to `next/font` so fonts are self-hosted.
- Persist filter state in the URL so a filtered view can be shared as a link.
