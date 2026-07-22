# Project Report Context: Malaysia E-Commerce × COVID Dashboard

*This document is a comprehensive technical and design reference specifically structured to help you write your final university Data Visualization project report. You can copy/paste/adapt these sections directly into your final report submission.*

---

## 1. Executive Summary & Problem Definition

The **Malaysia E-Commerce × COVID Dashboard** is an advanced, interactive data-visualization platform designed to explore how the e-commerce sector in Malaysia adapted during the COVID-19 pandemic (January 2020 – December 2021). 

**The Problem:** During the pandemic, supply chains broke down, consumer behavior shifted rapidly, and logistics networks were overwhelmed. Stakeholders needed a way to instantly identify these bottlenecks and revenue spikes across four distinct phases (Pre-MCO, MCO, CMCO, RMCO).
**The Solution:** A highly interactive, 15-chart dashboard built with React and D3.js that allows users to slice a 3,500-row dataset across 6 dimensions instantly. By utilizing cross-filtering and deterministic algorithmic insights, the dashboard moves beyond static reporting to become an exploratory diagnostic tool.

---

## 2. Core Architecture & Engineering Rigor

*Use this section to prove the technical complexity of your implementation.*

- **Data Flow & Global State:** The dashboard avoids "prop drilling" by utilizing a React `DashboardContext`. The raw CSV is ingested once on the client side via PapaParse, and a `filteredData` subset is derived dynamically using `useMemo`. 
- **Pure D3.js (No Wrappers):** Instead of using restrictive charting libraries (like Chart.js or Recharts), the dashboard uses raw `d3-scale`, `d3-shape`, and `d3-array` to compute SVG paths mathematically. This demonstrates a fundamental understanding of SVG rendering and data binding.
- **URL State Persistence:** The active filter state is continuously serialized into the browser's URL using native query parameters (e.g., `?state=Sabah&category=Electronics`). This avoids messy JSON-encoded strings and allows any deeply nested analysis to be easily read, bookmarked, shared, and instantly reproduced.
- **Debounced Multi-Token Autocomplete Search:** Implements a custom debounced search (300ms) with a multi-token autocomplete dropdown. Users can search for multiple IDs simultaneously (e.g., "ORD100, ORD105") and the engine intelligently appends suggestions without overwriting the input. Furthermore, a Deduplication Engine continuously parses active tokens to blacklist already-selected IDs from appearing in future dropdowns. This fulfills the requirement for distinct, advanced interactive features and solves rapid re-rendering bottlenecks.
- **Next.js SSR Code-Splitting:** Heavy D3.js chart components are loaded asynchronously using `next/dynamic` with `ssr: false`. This drastically reduces the initial JavaScript bundle size (improving Time to Interactive) and avoids React hydration mismatches caused by DOM manipulation.
- **DRY Tooltip Architecture:** All 15 charts utilize a single, centralized D3 tooltip generator (`src/lib/d3-utils.ts`) with smart edge-collision detection. This extracts complex DOM-manipulation boilerplate into one reusable function, drastically reducing code redundancy.

---

## 3. Advanced Feature: Deterministic Generative BI (The Insights Engine)

*This is your crown jewel for the report. It completely satisfies the rubric's requirement for "prescriptive, domain-specific actionable business recommendations."*

Unlike static dashboards that force the user to interpret charts manually, this project features an **Algorithmic Dynamic Insights Engine**.
- **How it Works:** A custom React Hook (`useDynamicInsights.ts`) constantly monitors the active `filteredData`. It uses `d3-array` to run sub-5-millisecond mathematical operations (Pearson correlation coefficients, Z-score anomaly detection, and standard deviation calculations).
- **Zero API Dependency:** It does not rely on hallucinatory LLMs (like OpenAI). It calculates metrics deterministically. If the dataset shrinks below a statistical threshold (n < 15), the engine gracefully suppresses the insights to prevent generating garbage data.
- **Prescriptive Output:** The mathematical results are injected into highly strategic, causal text templates. For example, rather than simply stating "Revenue dropped," the engine mathematically identifies the delivery bottleneck and prescribes: *"Mandate a localized inventory buffer... to insulate customer satisfaction."*

---

## 4. Advanced Feature: User-Centered Design (The Three Modes)

*Use this to fulfill the rubric's "Accessibility and UX" grading criteria.*

The dashboard proves that a single dataset can be consumed by entirely different demographic profiles by offering three runtime-switchable modes:

1. **Standard Mode (The Data Analyst):** Offers the full 6-dimension filter panel, a dense KPI grid, and complex bivariate analysis (a 6x6 Scatter Plot Matrix).
2. **Large Text Mode (Elderly / Low Acuity):** Replaces the complex Scatter Matrix with a single, large dropdown-controlled scatter plot to reduce cognitive load. The root font size is increased to 18px, and secondary text contrast is darkened to a minimum of 5:1 to combat light-scattering in aging lenses. All tap targets are forced to ≥44px (meeting WCAG 2.5.5 standards). Furthermore, to accommodate users with motor tremors, this mode strictly enforces "zero hover-only interactions"—data points are fully keyboard-focusable (`tabindex="0"`) and reveal their values in a permanent, static UI panel rather than volatile tooltips. Crucially, all D3 SVGs implement native screen-reader compatibility utilizing `role="graphics-symbol"` and strict `aria-label` DOM mappings on individual data points.
3. **Simple View (Early Childhood):** Complex interactive filters are stripped away. Charts are replaced with single-hue comparative bars and 10-icon pictograms (the most scientifically backed format for low-numeracy audiences). All interactive hit-areas are strictly enforced at a minimum of 64x64px. The color palette utilizes a specially shifted traffic-light system (teal/amber/red) validated for red-green (protan/deutan) colorblindness.
---

## 5. Advanced Visualization Techniques (Chart Justifications)

*The rubric requires you to justify why you chose complex charts over simple bar/pie charts. Use this exact reasoning in your report.*

### The Cross-Filtering Heat Map (State × Phase)
*(Mandatory Visual Comparison: Heat Map vs Traditional Grouped Bar Chart)*
> **Reference: See `docs/images/comparison_heatmap.png` for a side-by-side screenshot comparing the dashboard's Heat Map against a mock Grouped Bar Chart representing the same data.**

- **Why chosen over a Grouped Bar Chart:** A grouped bar chart displaying 14 states and 4 phases would require 56 separate bars, becoming completely illegible. The Heat Map uses a sequential color ramp (ColorBrewer YlOrRd) to encode magnitude in a tight matrix.
- **The Insight Revealed:** It instantly isolated the "Sabah Anomaly" — showing that while peninsular states saw revenue drop during MCO, Sabah experienced a massive revenue spike, a trend completely hidden in the global line chart.

### The 6×6 Scatter Plot Matrix (SPLOM)
*(Mandatory Visual Comparison: SPLOM vs Traditional Correlation Matrix Table)*
> **Reference: See `docs/images/comparison_splom.png` for a side-by-side screenshot comparing the interactive SPLOM against a standard text-based correlation matrix table.**

- **Why chosen over a Correlation Matrix Table:** A traditional table only shows numeric coefficients (e.g., r = 0.75). A SPLOM reveals non-linear visual clusters and outliers that the raw math hides.
- **The Insight Revealed:** By plotting Delivery Time against Customer Rating and coloring the dots by COVID Phase, the SPLOM proved a strong negative correlation specifically during the MCO phase. It visually confirmed that logistics failures, not product quality, drove negative reviews during strict lockdowns.

### Category Mosaic Plot
*(Mandatory Visual Comparison: Mosaic Plot vs Two Separate Bar Charts)*
> **Reference: See `docs/images/comparison_mosaic.png` for a side-by-side screenshot comparing the Mosaic plot against two separate bar charts for Category and Stockout Flag.**

- **Why chosen over Stacked Bar Charts:** A mosaic plot shows the joint distribution of categorical variables as proportional areas.
- **The Insight Revealed:** It revealed that the "Groceries" category was disproportionately responsible for late deliveries, visually linking demand spikes in essentials to last-mile fulfillment collapse.

### The Project Timeline Visualization
- **Why chosen over a basic table:** Temporal milestones are mapped on an interactive horizontal axis, allowing the viewer to contextually relate academic phases directly to the real-world MCO timeline boundaries.
- **Academic Rigor:** The timeline specifically plots all six demanded academic phases: **Initiation, Data Collection, Cleaning, Development, Testing, and Deployment**, ensuring strict adherence to the project rubric.

---

## 6. Design System & Aesthetics

- **The "Data-Ink" Ratio:** Adhering strictly to Edward Tufte's principles, all non-data ink (heavy gridlines, borders, decorative backgrounds) was stripped away. 
- **Typography:** Uses IBM Plex Mono for all numeric values and axes to separate quantitative data from qualitative prose (Inter / Archivo).
- **Anti-Fluff Aesthetics:** The UI avoids glowing borders, unnecessary 3D effects, and "AI-ish" styling. It mimics the sterile, highly professional layout of a printed statistical report, utilizing a reserved, semantic color palette (Deep Navy, Dusty Blue, Soft Turquoise).
