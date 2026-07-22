# Malaysia E-Commerce COVID-19 Synthetic Dataset

This repository contains the v2, enterprise-grade generator for a reproducible transaction-level dataset simulating Malaysian e-commerce activity from January 2020 to December 2021, spanning Pre-MCO conditions through the MCO, CMCO, and RMCO COVID-19 restriction phases.

Built for **TFB3133/TEB3133 Data Visualization** (Universiti Teknologi PETRONAS) — used for a multivariate relationship analysis assignment and an accompanying executive dashboard project.

## Current Step

The generator and data dictionary are in place. Running the script creates both the clean analysis dataset and a deliberately messy raw version under `data/`.

## Synthetic Data Strategy

Due to the lack of publicly available granular transactional data mapping specific Malaysian MCO/CMCO/RMCO phases to warehouse-level e-commerce metrics, a synthetic dataset of 3,500 orders and 26 variables was generated. The data generation logic, variable definitions, and validation statistics are documented in this GitHub repository to ensure reproducibility, allowing the report to focus strictly on the required multivariate analysis and visualization strategy.

## Synthetic Construction Notes

The dataset was generated procedurally in Python using a fixed random seed so the output is reproducible. The main rules are summarized below.

- Revenue construction:
  - base_revenue = order_quantity × unit_price × (1 − discount_pct / 100)
  - sales_revenue = (base_revenue × 0.9 + ad_spend_myr × 1.7) × delivery_penalty × noise
  - noise follows a normal distribution centered on 1 with modest spread so the revenue pattern is realistic rather than perfectly deterministic.
- Phase-dependent delivery time:
  - delivery_time_days ~ Normal(μ_phase, 1.5)
  - μ_phase = 2.5 for Pre-MCO, 7.5 for MCO, 4.5 for CMCO, and 3.0 for RMCO.
- Customer rating and returns:
  - customer_rating = clip(5 − delivery_time_days / 5 + Normal(0, 0.4), 1, 5)
  - return_prob = 0.05 + 0.20 × (rating < 3) + 0.12 × (status = Delayed) + 0.35 × (status = Returned-to-Sender)
- Hidden cluster injection:
  - Selangor/Kuala Lumpur + Groceries + Loyal-VIP + MCO rows were uplifted by increasing quantity, reducing discount, increasing rating, and multiplying revenue by 1.3.
- Planted anomaly:
  - Sabah + Electronics + CMCO rows were given a 2.2x to 3.0x revenue uplift, higher ad spend, and a marketing channel skew toward Facebook Ads and Influencer.

## Variable Inclusion Justification

The dataset contains 26 variables, exceeding the assignment minimum of 12. Each variable was included for a specific analytical purpose.

| Variable | Type | Rationale for Inclusion |
|---|---|---|
| order_id | ID | Uniquely identifies each transaction; required as the grain of the dataset. |
| order_date | Date | Anchors every record in time; required to derive covid_phase and support the timeline component (Q3-C). |
| covid_phase | Categorical | Directly required by the assignment brief; enables every phase-based comparison in Q1.7 and Q3-A. |
| customer_id | ID | Without a repeat identifier, loyalty/cohort behaviour cannot be examined; supports the hidden-cluster analysis in Q1.4 and the customer-segment question in Q3-A. |
| state | Categorical | Required to answer which states experienced the highest sales (Q3-A) and drives the Trellis Plot in Q1.5. |
| warehouse_id | Categorical | Required to answer the logistical-pressure business question (Q3-A) and the Scatter Plot Matrix analysis. |
| product_id | ID | Provides SKU-level granularity beneath product_category, supporting potential drill-down interactions (Q3-B). |
| product_category | Categorical | Core faceting variable for Trellis and Mosaic Plots; required for the inventory-shortage business question. |
| order_channel | Categorical | Reflects how big e-commerce enterprises actually segment traffic (App/Web/Marketplace); adds a realistic operational dimension. |
| order_quantity | Numeric | Basic transaction volume measure; a factor in the revenue calculation. |
| unit_price | Numeric | Second-strongest revenue correlate (r = 0.51); needed to test the price-tier effect as an alternative explanation to marketing spend. |
| discount_pct | Numeric | Tests management's implicit assumption that discounting drives revenue; deliberately shown to have negligible direct effect (Q1.2). |
| marketing_channel | Categorical | Categorical counterpart to ad_spend_myr; required to explain the Sabah anomaly's Facebook Ads / Influencer skew (Q1.6). |
| ad_spend_myr | Numeric | Engineered as the strongest revenue driver (r = 0.66); central to the Q1.1 and Q3-A demand driver questions. |
| website_traffic_source | Categorical | Represents acquisition funnel stage, distinct from marketing_channel; adds realistic breadth without duplicating an existing field. |
| sales_revenue | Numeric (target) | The dependent variable for the entire multivariate analysis; every Q1 sub-question is framed around it. |
| customer_segment | Categorical | Required for the which customer segments generated the highest revenue business question (Q3-A) and the hidden-cluster analysis. |
| customer_age_group | Categorical | Deliberately engineered as a weak/near-zero revenue correlate, giving Q1.2 a genuine answer rather than an assumed one. |
| payment_method | Categorical | Deliberately engineered as a weak revenue correlate alongside age group, for the same reason. |
| delivery_time_days | Numeric | Core logistics variable; required for the delivery performance over time business question and strongly tied to customer_rating (r = -0.75). |
| delivery_status | Categorical | Categorical KPI counterpart to delivery_time_days; supports the Mosaic Plot analysis (phase × delivery outcome) in Q2.4. |
| shipping_cost_rm | Numeric | Separates delivery cost from delivery time, enabling a genuine multi-variable logistical-pressure analysis (Q3-A) rather than relying on time alone. |
| inventory_level_pct | Numeric | Required for the inventory-shortage business question; engineered to fall during MCO to reflect real supply chain disruption. |
| stockout_flag | Binary | Threshold-based derivative of inventory_level_pct, giving a clean binary KPI for dashboard summary cards. |
| return_flag | Binary | Reflects a standard e-commerce quality metric, tied to delivery delays and low ratings; strengthens the unexpected trends discussion. |
| customer_rating | Numeric | Captures customer experience; engineered as strongly dependent on delivery_time_days, supporting the correlated-pairs analysis (Q1.3). |

## What's in the dataset

- **3,500 clean orders, 26 variables** — transaction ID, date, COVID-19 phase, customer ID, state, warehouse, product ID/category, order channel, quantity, pricing, discount, marketing channel/spend, traffic source, revenue, customer segment/age/payment method, delivery time/status, shipping cost, inventory level, stockout flag, return flag, and customer rating.
- The generator also creates a raw version with realistic messiness:
  - `data/malaysia_ecommerce_covid_clean.csv` — the analysis-ready dataset (3,500 rows)
  - `data/malaysia_ecommerce_covid_raw.csv` — the same data with injected missing values and duplicate rows, useful for demonstrating a real cleaning step

Full variable-by-variable documentation is in [`docs/data_dictionary.md`](docs/data_dictionary.md), with generation notes in [`generate_dataset.py`](generate_dataset.py).

## Engineered relationships

Rather than pure random noise, several relationships were deliberately built in and then validated against their design targets:

| Relationship | Target | Achieved |
|---|---|---|
| `ad_spend_myr` → `sales_revenue` | Strong positive, r ≈ 0.6–0.7 | r = 0.66 |
| `delivery_time_days` → `customer_rating` | Strong negative | r = -0.75 |
| `inventory_level_pct` → `stockout_flag` | Moderate-strong negative | Stockout risk rises sharply below ~8% inventory |
| `payment_method` / `customer_age_group` → `sales_revenue` | Near-zero (deliberately weak) | r = 0.02–0.06 |
| Delivery delay during MCO | Marked increase vs Pre-MCO | MCO avg 7.48 days vs Pre-MCO avg 2.75 days |
| Hidden cluster (Selangor/KL + Groceries + Loyal-VIP + MCO) | ~100 rows, elevated revenue & rating | n = 100; revenue +23%, rating +0.11 vs category baseline |
| Planted anomaly (Sabah + Electronics + CMCO) | 2–3× revenue spike vs category baseline | RM 5,869 vs RM 2,268 category-wide (2.6×) |
| Return rate baseline | Realistic industry range (10–20%) | 12.7% overall, 41.2% for Returned-to-Sender orders |

For the full derivation, formulas, and validation logic, see [`generate_dataset.py`](generate_dataset.py) and the accompanying report/appendix material.

## Validation Summary

After generation, every engineered relationship was measured against its design target to confirm the dataset behaves as intended.

| Engineered Relationship | Design Target | Achieved (Measured in Final Dataset) |
|---|---|---|
| ad_spend_myr → sales_revenue | Strong positive, r ≈ 0.6–0.7 | r = 0.66 |
| delivery_time_days → customer_rating | Strong negative | r = -0.75 |
| inventory_level_pct → stockout_flag | Moderate-strong negative | Stockout probability rises sharply below ~8% inventory |
| payment_method / customer_age_group → sales_revenue | Near-zero (deliberately weak) | r = 0.02–0.06 |
| Delivery delay during MCO | Marked increase vs pre-MCO | MCO avg 7.48 days vs pre-MCO avg 2.75 days |
| Hidden cluster (Selangor/KL + Groceries + Loyal-VIP + MCO) | ~100 rows, elevated revenue & rating | n = 100; revenue +23%, rating +0.11 vs category baseline |
| Planted anomaly (Sabah + Electronics + CMCO) | 2–3× revenue spike vs category baseline | RM 5,869 vs RM 2,268 category-wide (2.6×) |
| Return rate baseline | Realistic industry range (10–20%) | 12.7% overall, rising to 41.2% for Returned-to-Sender orders |

## Reproducing the dataset

```bash
pip install -r requirements.txt
python generate_dataset.py
```

The script uses a fixed random seed (`np.random.seed(42)`), so re-running it produces identical output. Adjust `N_ROWS` or any of the distribution parameters at the top of the script to generate variations.

## Grounding references

The `covid_phase` boundaries are based on the real Malaysian MCO/CMCO/RMCO timeline:

- Sohrabi, C., et al. (2020). World Health Organization declares global emergency: A review of the 2019 novel coronavirus (COVID-19). *International Journal of Surgery*, 76, 71-76.
- Government of Malaysia. (2020). Movement Control Order (MCO), Conditional Movement Control Order (CMCO), and Recovery Movement Control Order (RMCO) directives. National Security Council, Malaysia.
- PIKOM. (2021). Malaysia's e-commerce growth during the COVID-19 pandemic. Persatuan Industri Komputer dan Multimedia Malaysia (PIKOM) commentary.

## License

MIT License — see [LICENSE](LICENSE). Free to use, adapt, or extend for academic or educational purposes.

## Citation

If referencing this dataset in academic work:

> Sharvin. (2026). *Malaysia E-Commerce COVID-19 Synthetic Dataset Generator* [Source code]. GitHub. https://github.com/No0bmazt3r/malaysia-ecommerce-covid19-dataset
