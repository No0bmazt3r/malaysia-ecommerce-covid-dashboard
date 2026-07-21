# Features & Design Justification

This document details every feature, view, and chart in the Malaysia E-Commerce × COVID Dashboard, and justifies each design decision against established data-visualization and interaction-design practice.

**Guiding principles referenced throughout:**

- **Shneiderman's information-seeking mantra** — *overview first, zoom and filter, then details-on-demand.* This is the structure of the entire dashboard: the Overview page summarizes, the filter panel narrows, and tooltips reveal exact values.
- **Cleveland & McGill's ranking of visual encodings** — position on a common scale is decoded most accurately, then length, then angle/area, then color saturation. Chart forms are chosen as high on this ranking as the data allows.
- **Tufte's data-ink ratio** — ink that carries no data is removed: recessive grids, no chart junk, decoration only where it encodes something.
- **ColorBrewer color guidance** — sequential ramps (one hue, light→dark) for magnitude; categorical hues for identity, never cycled or reused.
- **WCAG 2.1 / touch-target guidance** — contrast ratios, focus visibility, reduced motion, and ≥44px targets (WCAG 2.5.5, Apple HIG) where the audience needs them.
- **Color-vision-deficiency (CVD) safety** — palettes are validated computationally (OKLab ΔE separation under protan/deutan/tritan simulation), never judged by eye, and color is never the only carrier of meaning.

---

## 1. Global Features

### 1.1 Shared filter state & cross-filtering

All charts read from a single `DashboardContext` holding the raw dataset and the active filters (date range, COVID phase, state, category, segment, search). `filteredData` is derived once and consumed everywhere, so **every chart always agrees with every other chart** — a correctness property, not just a convenience. The heat map goes further: clicking a cell writes that state/phase back into the shared filters, turning any chart into a navigation instrument (*zoom and filter* from the mantra).

**Best practice:** coordinated multiple views with linked brushing/filtering is the standard model for exploratory dashboards; single-source-of-truth state prevents the "two charts disagree" failure mode.

### 1.2 Details-on-demand everywhere

Every mark in every chart — bars, dots, cells, segments, pictogram icons — shows a tooltip with exact values on hover, keyboard focus, or touch tap. Aggregate visuals compress information by design; tooltips restore precision without cluttering the resting view with number labels on every point (which would violate the data-ink principle and selective-labeling practice).

### 1.3 Light & dark themes

Theme is a `data-theme` attribute on the document root, toggled from the header, persisted to `localStorage`, and broadcast via a DOM event so D3 charts re-color live. Dark mode is **its own designed token set** (surfaces, borders, brightened chart hues) — not an automatic inversion, which would break contrast relationships.

### 1.4 Loading, empty, and error states

Every chart renders a skeleton while data loads and a designed "No data for the current filters" card when filtering empties its input — with instruction on how to recover ("Clear one or more filters"). **Best practice:** empty states are moments for direction, not blank space; users should never wonder whether the app is broken.

### 1.5 Accessibility baseline

- All interactive marks are keyboard-focusable with descriptive `aria-label`s.
- Visible focus rings (`:focus-visible`) throughout.
- `prefers-reduced-motion` disables all animation globally.
- Color never carries meaning alone: legends, direct labels, icon shapes, and word chips repeat every identity that color encodes.
- Text always uses text tokens (navy/blue ink), never the series color — a colored mark beside the text carries identity instead.

---

## 2. The Three User Modes (User-Centered Design)

The same dataset is presented three ways, switchable at runtime from a segmented control in the header (persisted like the theme). Modes are implemented **additively**: adult components are untouched; elderly and child variants are sibling components selected per route, plus scoped CSS token sets under `[data-usermode="elderly"]` and `[data-usermode="child"]`. This guarantees the primary (adult) experience cannot regress.

### 2.1 Standard (Adults)

The full analyst dashboard: six-dimension filter panel, cross-filtering heat map, drill-down tabs, 6×6 scatter matrix, dense KPI grid, comparative charts. Adults are the primary stakeholder audience; information-rich layouts, filtering, and comparative analysis are appropriate because the audience has both the domain motivation and the graph literacy to use them.

### 2.2 Large Text (Elderly Users)

| Design consideration | Implementation | Justification |
| --- | --- | --- |
| Larger fonts | Root font-size raised to 18px (scales every rem-based size); body line-height 1.65; body weight 500 | Presbyopia and reduced acuity are near-universal with age; enlarging the *root* guarantees no text is missed. Heavier weight preserves stroke legibility at distance. |
| High contrast | Secondary text darkened from ~3.1:1 to ≥5:1 against the background; borders strengthened; same treatment mirrored in dark theme | WCAG AA requires 4.5:1 for body text; aging lenses scatter light and lower effective contrast, so the dashboard exceeds the minimum. |
| Larger tap targets | All buttons, selects, and nav links get `min-height: 44px`; slider thumbs enlarged | 44px is the WCAG 2.5.5 / Apple HIG touch-target floor; motor precision declines with age. |
| Fewer simultaneous filters | `ElderlyFilterPanel` shows 3 primary filters (Date Range, State, Category); COVID Phase and Segment sit behind one "Advanced filters" expander | Working-memory load: six simultaneous controls is a scanning burden; progressive disclosure keeps power available without imposing it. |
| Reduced chart complexity | `ElderlyScatterSingle` replaces both scatter matrices: one large scatter with two labeled dropdowns ("Across"/"Up") choosing the variable pair; 6px dots, 14–15px axis text | A 36-panel SPLOM presumes high graph literacy and visual acuity. One large panel preserves the analytical capability (any pair is still reachable) at a fraction of the perceptual cost. |
| Persistent labeled navigation | The existing nav already pairs icon + text on every item; labels scale with the root font | Icon-only navigation forces recall over recognition (Nielsen); text labels remove the guessing. |

### 2.3 Simple View (Early Childhood)

| Design consideration | Implementation | Justification |
| --- | --- | --- |
| Large icons, minimal text | Numeric KPI cards become `ChildKPITile`s: a big lucide icon whose size scales with the metric's relative magnitude, one large mono number ("RM 2.1M", "4.1 ★"), one short label | Pre-literate and early-literate children read pictures before dense figures; a number that must appear is large and isolated rather than embedded in prose. |
| Bright, saturated colors | A traffic-light palette scoped to this mode — **validated for CVD safety**: light theme `#0CA678 / #D98A00 / #E03131`, dark theme `#0CA678 / #C27C00 / #D6336C`. Naïve red/amber/green failed protan/deutan simulation (ΔE as low as 1.7); the green was shifted toward teal to restore blue-channel separation | Children decode discrete good/ok/bad categories more easily than continuous gradients — but ~8% of boys are red-green colorblind, so the classic traffic light is exactly the audience where CVD safety matters most. Every color is therefore paired with an icon shape *and* a word chip. |
| Simple navigation | `ChildNav`: four large question tiles — "How Much Did We Sell?", "Did Packages Arrive?", "What Did People Buy?", "Are Customers Happy?" — replacing the seven-route nav | Questions in the child's own language map directly to intent; recognition over recall; four choices is a manageable decision set. |
| No filters, no drill-down | Simple View is read-only and single-tap; no filter panel, cross-filtering, or tabs | Interactive query-building presumes an analytical mental model children do not yet have; removing it removes every way to get lost. |
| Simplified charts only | One visual + one plain-language sentence per screen: quarterly bar chart (single hue, "Best!" marker), a 10-icon delivery pictogram, a 10-face happy/okay/sad icon array, a top-5 category bar chart | Icon arrays (pictograms) are the best-evidenced format for communicating proportions to low-numeracy audiences ("9 out of 10" beats "89.7%"). Single-hue bars keep the comparison about *length* — the accurate channel — not color. The sentence states the takeaway so the visual confirms rather than demands decoding. |
| Details still available | A large tooltip box (2px colored border, color swatch, exact value in big mono type) appears on hover, keyboard focus, or **tap-to-toggle** on touch devices | Details-on-demand shouldn't disappear just because the resting view is simple; tap-toggle suits tablets, the likeliest classroom device. |

---

## 3. Views & Charts, One by One

### 3.1 Overview (`/overview`)

The *overview first* page: a hero summary with active-filter chips, six KPI cards, the filter panel, and four charts.

| Element | What it shows | Form & justification |
| --- | --- | --- |
| **KPI cards** (Revenue, Orders, Avg Delivery, Stockout %, Return %, Avg Rating) | The six headline figures for the current filter state | A single number's best visualization is a **stat tile** — the highest data-ink form for one value. Each card pairs an icon, the value, and a context note; status coloring (e.g., rating ≥4 = good) is reinforced with text, not color alone. |
| **Monthly Revenue Trend** (`PhaseLineChart`) | Revenue over 24 months, with COVID phase context | Time series → **line chart**: position on a common scale, the most accurately decoded encoding. Continuous line = trend; hover crosshair gives exact monthly values. |
| **Revenue Heat Map: State × COVID Phase** (`HeatMap`) | Revenue magnitude across two categorical dimensions at once | Two categorical axes × one measure → **matrix with a sequential ramp** (light→dark = low→high, perceptually ordered). Unlike a traditional grouped bar chart which becomes unreadable with 14 states and 4 phases, the heat map condenses this effectively. Clicking a cell cross-filters the whole dashboard — the mantra's *zoom and filter* made literal. |
| **Correlation Overview** (`MiniScatterMatrix`) | Pairwise relationships among Revenue, Ad Spend, Rating (3×3, sampled to 300 points) | A deliberately small SPLOM as a *teaser* for the full matrix (linked from the card) — sampling keeps it instant; the full 6×6 lives on the Product page where it has room. |
| **Project Progress Timeline** (`ProjectTimeline`) | Project milestones for the academic project window | Temporal events → position along a time axis. |
| **Dataset Context Timeline** (`CovidPhaseTimeline`) | Real MCO/CMCO/RMCO boundaries | Temporal events → position along a time axis; clicking a phase filters the dashboard. |

*Large Text variant:* same layout, but `ElderlyFilterPanel` replaces the six-filter panel and `ElderlyScatterSingle` replaces the mini SPLOM.
*Simple View variant:* three icon KPI tiles + the quarterly revenue bar chart + one sentence.

### 3.2 Regional (`/regional`)

| Element | What it shows | Form & justification |
| --- | --- | --- |
| **Sales by State** (`StateSalesBarChart`) | State revenue ranking | Ranking → **sorted bars**: length on a common baseline is decoded nearly as accurately as position. The Sabah anomaly is highlighted in a contrast hue — pre-attentive pop-out directs attention to the page's key finding. |
| **Delivery Time Trends by State** (`StateDeliveryLineChart`) | How delivery times moved per state across phases | Multi-series line chart **capped at the top states** — capping the series count is the standard defense against unreadable "spaghetti" charts; a legend plus direct hover identify each line. |
| **Category Distribution by State** (`CategoryStateStackedBar`) | Category mix within each state | Part-to-whole per state → **stacked bars**, with 2px surface gaps between segments so adjacent fills never touch (segment boundaries stay readable for CVD viewers too). |
| **Revenue Heat Map** (shared with Overview) | State × phase magnitude, click-to-cross-filter | Same matrix form as above; repeating it here follows the principle that the *task* (regional comparison) picks the chart. |

*Simple View variant:* the delivery pictogram — 10 package icons (checked = on time, crossed = late), green/red with icon + word legend chips, and the sentence "N out of every 10 packages arrived on time."

### 3.3 Product (`/product`)

Two tabs — a drill-down pattern that keeps each tab's chart set coherent.

| Element | What it shows | Form & justification |
| --- | --- | --- |
| **Revenue by Category** (`CategoryTreemap`) | Category share of total revenue | Part-to-whole across many categories → **treemap**: area scales past the ~5-slice limit where pies fail; direct labels on tiles avoid a color-lookup legend. |
| **Category × Delivery Status** (`CategoryMosaicPlot`) | Joint distribution of category and delivery outcome | **Mosaic plot**: proportional areas expose the joint distribution that two separate bar charts would hide (e.g., which categories drive delays). |
| **Top 10 Products by Revenue** (`TopProductsBarChart`) | Best-selling SKUs | Ranking → sorted bars, cut to 10 so labels stay legible — a legibility cap, not a data cap (the rest is reachable via filters). |
| **Scatter Plot Matrix** (`ScatterMatrix`, Correlation tab) | Pairwise correlation across 6 numeric variables | The canonical **bivariate-relationship** form. Compared to a traditional correlation matrix table which only shows numerical coefficients, the SPLOM reveals non-linear visual clusters; per-cell sampling keeps it responsive; color = COVID phase with a legend, so the pandemic's effect on each relationship is visible. |

*Large Text variant:* the Correlation tab renders `ElderlyScatterSingle` instead of the 6×6 matrix.
*Simple View variant:* top-5 categories as one large single-hue bar chart with the sentence "People bought X the most!"

### 3.4 Customer (`/customer`)

| Element | What it shows | Form & justification |
| --- | --- | --- |
| **Revenue by Segment** (`SegmentDonutChart`) | Share of revenue across 3 customer segments | Part-to-whole with only **three** slices — inside the safe range for a radial form; the centre hole carries the total (data, not decoration); the legend lists exact values because angle is a weak encoding for precise reading. |
| **Segment Revenue by Phase** (`SegmentGroupedBarChart`) | Comparing segments *within* each phase | **Grouped bars** keep every value on a common baseline — unlike stacking, which makes all but the bottom series hard to compare. |
| **Age vs Average Order Value** (`CustomerAgeScatterPlot`) | Spread of order values across age groups | **Scatter** shows distribution and outliers that averages would hide — the Loyal-VIP MCO cluster is only visible at the individual-point level. |

*Simple View variant:* the big star rating ("4.1 ★") plus a 10-face happy/okay/sad icon array with word-chip legend and the sentence "Most customers are happy!"

### 3.5 Timeline (`/timeline`)

The project milestone timeline cross-referenced against real MCO/CMCO/RMCO boundaries, with the phase glossary. Milestones are positional on a time axis; the phase bands are context, drawn recessively behind the data.

### 3.6 Insights (`/insights`)

Written analytical findings — anomalies, clusters, debunked assumptions — as tinted cards. **Justification:** a dashboard's conclusions deserve *words*; expecting every viewer to re-derive the Sabah anomaly from the heat map violates the principle that the presenter, not the reader, should do the analysis. Tints reuse the reserved status hues with text labels, never color alone.

### 3.7 Team (`/team`)

Roster with avatars, names, and student IDs — mirrored in the README's team table.

---

## 4. Interaction Design

| Feature | Behavior | Justification |
| --- | --- | --- |
| Filter panel | Date-range slider, phase/category/segment checkboxes, state dropdown, with per-filter counts and one-click Reset | Filters sit in one predictable place; counts show the cost of each selection; Reset is the universal undo. |
| Active-filter chips | Every active filter appears as a removable pill above the charts, plus "Clear all" | Visibility of system status (Nielsen #1): users always see *why* the charts look the way they do, and can undo any single choice. |
| Cross-filtering | Heat-map cells write selections back to global state | Direct manipulation on the data itself — clicking the thing you're curious about — beats abstract form controls for exploration. |
| Tooltips | Cursor-following in Standard mode; large tooltip box with hover/focus/tap-toggle in Simple View | Details-on-demand at every literacy level; touch parity via tap-toggle (tap shows, tap again or tap elsewhere hides). |
| Tab drill-downs | Product page tabs with a sliding-pill indicator | Segmenting dense pages by task; the animated pill (shared with the nav and mode switcher) signals state change without a page reload. |
| Mode & theme toggles | Segmented control + button in the header, both persisted, both animated with the same sliding pill | One consistent switching idiom across the whole header; persistence respects the user's choice across visits. |
| Reduced motion | All animation collapses to ~0ms under `prefers-reduced-motion` | Vestibular-safety baseline; WCAG 2.3.3. |

---

## 5. Visual Design System

- **Identity:** a printed statistical report — 2px corner radii everywhere, faint graph-paper background, auto-numbered `FIG. 01…` tags per chart card, mono-spaced data labels. Structure encodes meaning: figure numbers are a real sequence, not decoration.
- **Palette:** Deep Navy `#0B2A4A` (primary ink), Dusty Blue `#5D8FA3` (secondary ink), Soft Turquoise `#63B7B2` (accent), Warm Grey `#C6C1BC` (borders), Soft Cream `#F6F3EC` (muted surfaces); reserved status colors (sage / amber / coral) are never reused as series colors.
- **Typography:** Archivo (display headings), Inter (body), IBM Plex Mono (every data value, axis tick, and label) — the mono face separates *data* from *prose* at a glance.
- **Token architecture:** every color is a CSS custom property with four override sets — dark theme, elderly mode, child mode, and their combinations — so a chart never hard-codes a mode decision.

---

## 6. Engineering Quality

- **Additive mode architecture:** child/elderly variants are sibling components; zero branching inside existing chart internals, so Standard mode is regression-proof by construction.
- **CI/CD:** GitHub Actions (Node 24 runtime) runs ESLint and `tsc --noEmit` before every Vercel production build — a broken build cannot deploy.
- **Performance:** the CSV is parsed once and cached; scatter plots sample (300–400 points) before rendering; derived data is memoized.
- **Verification:** `pnpm lint` and `pnpm build` pass clean; palettes were verified with an automated six-check validator (lightness band, chroma floor, CVD ΔE separation, normal-vision floor, surface contrast) rather than by eye.
