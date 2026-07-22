# Malaysia E-Commerce × COVID-19: A Visual Diagnostic Tool

## 1. Abstract
The COVID-19 pandemic severely disrupted Malaysian supply chains, shifting consumer behavior and overwhelming fulfillment logistics. This interactive dashboard allows e-commerce stakeholders (CMO, Logistics Director) to explore 3,500 transactional records across four pandemic phases (Pre-MCO, MCO, CMCO, RMCO).

## 2. Problem Statement & Objectives
During lockdowns, supply chain bottlenecks caused SLA breaches while marketing efficiency fluctuated.
- **Logistics Target**: Identify regional bottlenecks to reduce average delivery time SLA breaches by 15%.
- **Marketing Target**: Optimize localized ad spend to improve Return on Ad Spend (ROAS) by 20%.

## 3. Generative BI (The Insights Engine)
Instead of static reports, a custom, zero-latency deterministic algorithm computes Pearson correlations and Z-scores directly in the browser. It mathematically identifies anomalies (e.g., the Sabah CMCO revenue spike) and generates prescriptive, actionable text recommendations for executives in real-time.

## 4. Key Findings & Insights
- **Logistics vs. Churn**: A strong negative correlation (r = -0.75) exists between Delivery Time and Customer Rating strictly during the MCO phase. Stockouts in the Groceries category were the primary driver of these delays.
- **The Sabah Anomaly**: While peninsular sales plummeted during the MCO, Sabah experienced a 2.6x revenue spike driven by Electronics demand, highlighting a massive localized ROAS opportunity.
- **Demographic Resilience**: A hidden cohort of older "Loyal/VIP" users from Selangor sustained high-value purchases despite severe supply shortages.

## 5. User-Centered Design Architecture
The dashboard dynamically adapts a single dataset across three distinct accessibility modes:
- **Data Analyst (Standard)**: High data density, 6x6 Scatter Matrix, 6-dimensional cross-filtering.
- **Elderly/Low Acuity (Large Text)**: WCAG 2.5.5 compliant tap targets (≥44px), ≥5:1 contrast, 18px root typography, simplified single-scatter chart.
- **Early Childhood (Simple View)**: Minimum 64x64px tap targets, pre-literate pictograms, CVD-safe (colorblind-validated) traffic-light color palette.

## 6. Technical Stack
Built entirely client-side using React, Next.js, and raw D3.js (no wrapper libraries). Employs debounced state management and cross-filtering for zero-latency exploration.
