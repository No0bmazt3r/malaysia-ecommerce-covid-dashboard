# Malaysia E-Commerce COVID Dashboard

An interactive Next.js dashboard for exploring Malaysia e-commerce performance across COVID-19 phases. The app combines cross-filtering, KPI summaries, D3 visualizations, and multiple audience modes to support analysis of revenue, delivery, stockout, and customer sentiment patterns.

## What This App Does

- Loads the cleaned dataset from `public/data/malaysia_ecommerce_covid_clean.csv`.
- Filters data by date, COVID phase, state, category, segment, and free-text search.
- Renders KPI summaries, a monthly revenue trend, a state-by-phase heat map, a scatter plot matrix, and a project timeline.
- Supports three display modes: analyst, executive, and kiosk.
- Uses shared dashboard state so filters and mode changes apply across the whole experience.

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- D3.js for chart rendering
- PapaParse for CSV ingestion

## Project Structure

- `src/app` contains the routes and the root layout.
- `src/components/ui` contains the top-level dashboard controls and summary cards.
- `src/components/charts` contains the D3 visualizations.
- `src/context/DashboardContext.tsx` stores the shared filters, mode, loading state, and filtered dataset.
- `src/lib/data.ts` loads and parses the CSV.
- `src/lib/filters.ts` applies filters and computes KPI values.
- `src/lib/types.ts` defines the dataset model and filter state.

## Routes

- `/overview` is the main dashboard view with KPIs, filter controls, the revenue trend, and the heat map.
- `/regional` focuses on the state and phase revenue heat map.
- `/product` shows the scatter matrix for correlation analysis.
- `/timeline` shows the milestone timeline.
- `/insights` presents the written findings from the analysis.

The root route redirects to `/overview`.

## Data Flow

1. `DashboardProvider` loads the CSV once on the client.
2. Filters are stored in shared state and applied in memory.
3. Charts consume the filtered dataset directly.
4. Some charts support cross-filtering by writing back into the shared filter state.

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

## Current Strengths

- Clear separation between dashboard state, filters, and chart components.
- Real data-driven visualizations instead of static mockups.
- Cross-filtering already exists in the heat map.
- The app is structured into focused route pages for overview, regional, product, timeline, and insights.

## UI and Chart Improvement Plan

### 1. Visual System Refresh

- Replace the current starter-like look with a stronger dashboard identity.
- Define a tighter color system for background, surfaces, borders, accents, and chart palettes.
- Introduce more intentional typography hierarchy with larger display headers and clearer section labels.
- Add a subtle background treatment such as gradient washes, grid texture, or soft radial shapes so the page feels designed rather than plain.
- Standardize card radius, shadow depth, spacing scale, and icon treatment across all pages.

### 2. Layout and Information Hierarchy

- Turn the overview page into a clearer executive dashboard with a stronger hero header and a compact filter rail.
- Make the KPI row feel more premium by using consistent card heights, better contrast, and clearer delta or context text.
- Separate analysis content into named sections such as Overview, Regional Patterns, Product Relationships, and Findings.
- Add sticky section navigation or a progress rail if the page grows longer.
- Improve empty, loading, and filtered states so the dashboard feels complete in every condition.

### 3. Filter Experience

- Replace plain multi-selects with more usable filter chips, searchable dropdowns, or grouped selectors.
- Show active filters as removable pills near the top of the dashboard.
- Add a single-click reset and per-filter clear actions.
- Surface filter counts so users can see how restrictive the current view is.
- Consider making the filter panel sticky on desktop and collapsible on smaller screens.

### 4. Chart Presentation

- Wrap each chart in a richer card with title, subtitle, and key takeaway.
- Add legends, axis labels, and units consistently across charts.
- Increase label readability by improving tick density, font sizing, and responsive scaling.
- Make chart containers responsive instead of relying on fixed SVG sizes wherever possible.
- Add meaningful hover tooltips and persistent selections for charts that support drilldown.
- Provide a clear empty state when filters remove all data.

### 5. Specific Chart Improvements

#### Monthly Revenue Trend

- Add a second series or toggle for delivery time so the chart shows more than one metric when useful.
- Highlight phase transitions or important periods with annotations.
- Add a smoother responsive layout and a better x-axis strategy for dense date ranges.
- Consider a tooltip with month, revenue, average delivery, and order count.

#### Revenue Heat Map

- Use a more perceptually balanced color scale and a visible legend.
- Add hover details that show both absolute value and share of total.
- Let users select multiple cells instead of only one state and one phase.
- Add row or column sorting by revenue to surface strong patterns faster.
- Show a selected-cell summary panel outside the chart for clarity.

#### Scatter Plot Matrix

- Improve the matrix layout with consistent axis labeling and cleaner diagonal cells.
- Add correlation coefficients or trend lines to the upper triangle.
- Add brushing or lasso selection so users can isolate clusters.
- Improve phase coloring with a legend that is easier to scan.
- Consider reducing point opacity dynamically for dense regions.

#### Project Timeline

- Make milestones more editorial and less schematic with stronger spacing and better annotation blocks.
- Align the timeline more clearly with the product narrative or dataset phases.
- Add hover details or a side panel if the milestones need more explanation.

### 6. Usability and Accessibility

- Improve keyboard focus states for navigation, filters, and chart controls.
- Ensure contrast remains readable in all states and display modes.
- Avoid relying on color alone for insight communication.
- Make executive and kiosk modes do more than change font size; they should genuinely adjust density and layout.
- Test the dashboard on narrower screens and large displays separately.

### 7. Interaction and State

- Add synchronized highlighting between charts so a selection in one view is reflected elsewhere.
- Show breadcrumb-like state for active filters and chart selections.
- Persist mode and filter state in the URL or local storage so users can share a view.
- Add loading skeletons instead of plain text when the dataset is being prepared.

### 8. Content and Narrative

- Replace current placeholder-style explanations with shorter, sharper analysis copy.
- Tie each chart to one concrete question it answers.
- Keep insights focused on business impact, not just statistics.
- Add a short executive summary at the top of the dashboard.

## Suggested Delivery Order

1. Refresh the global layout, typography, spacing, and background.
2. Upgrade the overview page structure and filter UX.
3. Improve chart wrappers, legends, and tooltips.
4. Add cross-chart interactions and persistent state.
5. Polish responsive behavior, accessibility, and final content copy.

## Notes

- The current app is already functional, but the visual language is still close to the starter template.
- The main opportunity is to improve hierarchy, density, and chart readability without losing the analysis-driven structure.
- The existing D3 and shared-state setup is a solid base for a more polished dashboard.
