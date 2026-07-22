# Malaysia E-Commerce × COVID Dashboard

![Standard Mode](public/image/Standard.png)
![Elderly Mode](public/image/Large.png)
![Child Mode](public/image/Simple.png)

An interactive data-visualization dashboard exploring how Malaysian e-commerce performed across the COVID-19 movement-control phases (Pre-MCO, MCO, CMCO, RMCO) from January 2020 to December 2021. Built with Next.js, React, TypeScript, D3.js, and Tailwind CSS for the **TEB3133 / TFB3133 Data Visualization** course project.

## Problem Definition & Objectives

The objective of this dashboard is to allow specific e-commerce stakeholders—namely the **Chief Marketing Officer (CMO)**, **Director of Supply Chain Logistics**, and **Customer Retention Manager**—to identify supply chain vulnerabilities and marketing inefficiencies caused by COVID-19 movement control orders. 

### Key Measurable Metrics
- **Logistics SLA Optimization:** Identify localized fulfillment bottlenecks to reduce average delivery time SLA breaches by **15%**.
- **Marketing ROI:** Optimize ad spend allocation across the 14 states to improve regional return on ad spend (ROAS) by **20%** during localized lockdown phases.
- **Customer Churn Prevention:** Correlate delivery delays with negative customer ratings to mitigate churn-risk for high-LTV cohorts.

By analyzing transaction-level data across different pandemic phases, the dashboard uncovers actionable insights into customer behavior, logistical pressure, and revenue drivers.

## Team — Group 8

| Picture | Name | Student ID |
| :---: | --- | :---: |
| <img src="public/Wardah.svg" width="80" alt="Avatar of Nurul Hawardah" /> | Nurul Hawardah Binti Mohammad Yusoff | 22007264 |
| <img src="public/Ariana3.svg" width="80" alt="Avatar of Wan Nur Ariana Sofea" /> | Wan Nur Ariana Sofea Binti Wan Zaki | 22011056 |
| <img src="public/Zuyyin2.svg" width="80" alt="Avatar of Zuyyin Damia" /> | Zuyyin Damia Binti Norazmi | 22007506 |
| <img src="public/Baim.svg" width="80" alt="Avatar of Muhammad Ibrahim Al-Imran" /> | Muhammad Ibrahim Al-Imran Bin Mohd Isa | 22006656 |
| <img src="public/Sharvin.svg" width="80" alt="Avatar of Sharvin" /> | Sharvin A/L Kanesan | 22006930 |

## Highlights & Core Architecture

- **Generative BI (Dynamic Insights Engine)**: The Insights page is powered by a custom deterministic mathematical orchestrator. It uses `d3-array` to calculate Z-scores, Pearson correlations, and standard deviations in real-time. When you click a filter (e.g., "Penang"), the engine recalculates all thresholds and dynamically generates prescriptive, causal business recommendations injected into smart text templates instantly (0ms latency, 0 API keys).
- **15 Coordinated D3 Visualizations**: Line, bar, stacked bar, grouped bar, donut, treemap, mosaic, heat map, scatter matrix, project timeline, and dataset context timeline. All use a shared D3 tooltip boilerplate (`src/lib/d3-utils.ts`) with smart collision bounds for extreme DRY efficiency.
- **Cross-Filtering & URL State**: Every chart reads from `DashboardContext`. Clicking a heat-map cell writes the selection back into the global filters, updating every chart at once. Filter states are serialized natively to the URL (e.g., `?state=Sabah&category=Electronics`) so any sliced view can be bookmarked and shared.
- **Debounced Autocomplete Search**: Implements a highly optimized 300ms debounced search bar with an intelligent autocomplete dropdown. It supports multi-token searching (e.g., searching multiple Orders or Customers simultaneously via OR-logic) and utilizes a deduplication engine to instantly blacklist already-selected IDs from the dropdown suggestions.
- **SSR Code-Splitting**: Heavy D3.js chart components are wrapped in `next/dynamic` with SSR disabled, dropping the initial HTML payload size and preventing React hydration mismatches on DOM-heavy visualizations.
- **Three User Modes**: **Standard** for adult analysts, **Large Text** for elderly users, and **Simple View** for early-childhood users.
- **Accessible by Default**: Fully compliant screen-reader accessibility with D3 SVGs mapped using `aria-label` and `role="graphics-symbol"`. Features keyboard-focusable marks, persistent, focusable static detail panels for motor-impaired users (zero hover-only traps), ≥44px touch targets in Large Text mode, visible focus rings, and `prefers-reduced-motion` support.

## Client-Side Generative BI (The Insights Engine)

Unlike static dashboards that force users to interpret charts manually, this project features an **Algorithmic Dynamic Insights Engine** (Generative BI) that writes prescriptive strategy reports on the fly.

- **Deterministic Math, Not Hallucination:** A custom React Hook (`useDynamicInsights.ts`) constantly monitors the active `filteredData`. It uses `d3-array` to run sub-5-millisecond mathematical operations (Pearson correlation coefficients, Z-score anomaly detection, and standard deviation calculations). It does not use hallucinatory LLM APIs.
- **Graceful Degradation:** If the dataset is sliced too thinly via filters (n < 15), the engine gracefully suppresses the insights to prevent generating statistically insignificant data.
- **Prescriptive Output:** The mathematical results are injected into highly strategic, causal text templates. For example, rather than simply stating "Revenue dropped," the engine calculates the specific delivery bottleneck and prescribes: *"Mandate a localized inventory buffer... to protect customer satisfaction."*
- **Zero API Dependency:** Because it runs entirely client-side using native math, it requires 0 API keys, costs $0 to run, and has zero latency.

## The Three User Modes (User-Centered Design)

The same 3,500-row dataset is presented three ways, switchable at runtime from the header. Modes are implemented **additively** to guarantee the primary analytical experience cannot regress.

### 1. Standard (Adults / Analysts)
The full analyst dashboard: six-dimension filter panel, cross-filtering heat map, drill-down tabs, 6×6 scatter matrix, and dense KPI grid.

### 2. Large Text (Elderly Users)
- **Larger Fonts & High Contrast**: Root font-size raised to 18px. Secondary text darkened to ≥5:1 contrast against the background to combat reduced visual acuity and light scattering in aging lenses.
- **Larger Tap Targets**: All buttons, selects, and nav links get `min-height: 44px` (Apple HIG / WCAG 2.5.5 floor) to accommodate declining motor precision.
- **Reduced Chart Complexity**: The 36-panel scatter matrix is replaced by a single, large scatter plot with two labeled dropdowns. This preserves analytical capability while drastically reducing perceptual cost and working-memory load. Crucially, data discovery is completely decoupled from hover tooltips; clicking or tabbing to a point reveals its details in a permanent, static UI panel to assist users with motor tremors.

### 3. Simple View (Early Childhood)
- **Large Icons, Minimal Text**: Pre-literate children read pictures before dense figures. Numeric KPI cards become large tiles with simple statements ("RM 2.1M", "4.1 ★"). All interactive hit-areas are strictly enforced at a minimum of 64x64px to accommodate developing motor skills.
- **Validated Traffic-Light Palette**: Uses a bright CVD-safe palette (`#0CA678 / #D98A00 / #E03131`). Because ~8% of boys are red-green colorblind, green is shifted toward teal to restore blue-channel separation, and color is always paired with icon shapes.
- **Simplified Navigation & Charts**: Complex filters are removed to prevent the user from getting lost. Traditional nav is replaced with simple questions ("How Much Did We Sell?"). Charts are reduced to single-hue bars and pictograms (the best-evidenced format for communicating proportions to low-numeracy audiences).

## Advanced Visualization Techniques & Justifications

Every visualization was chosen against established guidance: Shneiderman's mantra (*overview first, zoom and filter, then details-on-demand*), Cleveland & McGill's ranking of visual encodings, and Tufte's data-ink ratio.

| Chart & Page | Why this chart? (vs. Simpler Alternatives) | The Specific Insight Revealed |
|---|---|---|
| **Revenue Heat Map**<br>*(Overview, Regional)* | **Why chosen:** Two categorical dimensions × one measure require a matrix. A traditional grouped bar chart becomes completely unreadable with 14 states and 4 phases.<br>**Implementation:** Uses ColorBrewer YlOrRd sequential ramp. | Instantly isolates the **Sabah anomaly** during MCO, where revenue spiked massively while other states dropped—a trend invisible in standard time-series lines. |
| **Scatter Plot Matrix (SPLOM)**<br>*(Product)* | **Why chosen:** The canonical bivariate-relationship form. Compared to a standard correlation matrix table (which only shows numerical coefficients), a SPLOM reveals non-linear visual clusters.<br>**Implementation:** Sampled per cell for 60fps responsiveness; colored by COVID phase. | Exposes that **Delivery Time and Customer Rating** have a strong negative correlation (r ≈ -0.75) specifically during the strict MCO phase, proving logistics failures directly caused churn. |
| **Category Mosaic Plot**<br>*(Product)* | **Why chosen:** Shows the joint distribution of categorical variables as proportional areas, exposing overlap that two separate bar charts would hide. | Reveals that the **Groceries category** was disproportionately responsible for late deliveries, driving the localized stockout flag spikes. |
| **Customer Age Scatter Plot**<br>*(Customer)* | **Why chosen:** Averages hide outliers. A scatter plot shows the exact distribution and spread of individual order values across age groups. | Highlights a highly lucrative **Loyal-VIP cluster** of older demographics making massive average-order-value purchases during RMCO. |
| **Sales by State Bar Chart**<br>*(Regional)* | **Why chosen:** Ranking uses length on a common baseline (highly accurate decoding). | The Sabah bar is pre-attentively highlighted in a contrast hue, instantly directing the eye to the primary geographical finding without manual scanning. |
| **Category Treemap**<br>*(Product)* | **Why chosen:** Area encoding scales infinitely better than a pie chart when dealing with >5 categories. Direct labels eliminate the need for a cognitive-heavy color-lookup legend. | Displays the overwhelming dominance of Electronics and Groceries in a highly scannable, space-efficient bounding box. |
| **Project Timeline**<br>*(Timeline, Overview)* | **Why chosen:** Temporal milestones require absolute positional plotting on a horizontal time axis. | Tracks the exact academic trajectory of the dashboard, mapping **Initiation, Data Collection, Cleaning, Development, Testing, and Deployment** directly against the dataset's actual MCO phases. |

## Interaction Design & UX

- **Shared Filter State**: All charts read from a single `DashboardContext`. `filteredData` is derived once and consumed everywhere. Every chart always agrees with every other chart.
- **Details-on-Demand Everywhere**: Every mark (bars, dots, cells, segments) shows a D3 tooltip with exact values on hover, keyboard focus, or touch tap.
- **Light & Dark Themes**: Dark mode is its own designed token set (surfaces, borders, brightened chart hues)—not an automatic inversion, which would break contrast relationships.
- **Graceful Empty States**: Every chart renders a skeleton while data loads and a designed "No data" card when filtering empties its input. Users never wonder if the app is broken.

## Dataset & Reproducibility

The transaction dataset, data dictionary, and Python generation scripts (`generate_dataset.py`) for this project are maintained in a dedicated external repository to keep this dashboard application lean.

**Dataset Repository:** [No0bmazt3r/malaysia-ecommerce-covid19-dataset](https://github.com/No0bmazt3r/malaysia-ecommerce-covid19-dataset)

For full documentation on the dataset variables and generation logic, please refer to the `dataset.md` and `README_DT.md` files in the `docs/` folder, or visit the repository linked above.

## Tech Stack & Project Structure

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Charts | D3.js v7 (No wrapper libraries, pure D3 math and DOM) |
| Engine | Client-side Generative BI (`d3-array` statistics engine) |
| Fonts | `next/font/google` (Self-hosted Inter, Archivo, IBM Plex Mono) |

## Getting Started

```bash
pnpm install        # install dependencies
pnpm dev            # start the dev server at http://localhost:3000
pnpm build          # production build
pnpm start          # serve the production build
pnpm lint           # run ESLint
```

## Deployment & CI/CD

Production deploys run through the manual GitHub Actions workflow (`.github/workflows/production-deployment.yml`): **lint → type-check → Vercel build → deploy**, ensuring a broken build never reaches production. Node 24 runtime is enforced across all runners.
