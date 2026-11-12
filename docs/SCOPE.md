# Prototype scope and capability boundaries

This is a coherent first slice, not a complete implementation of an existing financial product. Reference material was used to understand tasks and constraints. It was not copied into this public repository.

| Journey family               | Implemented in this prototype                                                                           | Deliberately not implemented                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Arrive, orient, find, return | Navigation, fixed local edition, command search, browser hash history, unknown-location recovery        | Authentication, permissions, live connection status                       |
| Research intake              | Prompt entry, starter chips, clearly labeled fixed research example                                     | Model calls, live agents, external source retrieval, scheduled research   |
| Idea discovery and pipeline  | Six fictional ideas, four stage groupings, theme/text filters, board/list views                         | Background generation, automatic approvals, live stage orchestration      |
| Research detail              | Thesis, catalyst, bear case, gaps, evidence register and reading list                                   | Sourced live reports, certified report completeness                       |
| Structure assembly           | Basket, currency, tenor, barrier, coupon, Reoffer, solve-target intent                                  | Real listing resolution, market data, executable instrument identifiers   |
| Exact-term review            | Required-field validation, exact-input binding, acknowledgement, synchronous invalidation, local export | Production legal review, financial approval, quote submission             |
| Standard autocallable        | Draft/review example only                                                                               | DEV or production pricing, quote identity, economics verification         |
| Protected participation      | Single-fictional-stock, bullish uncapped draft label, no coupon, Reoffer-only intent                    | Real participation calculation, production adapters                       |
| Other product branches       | Explicit draft-only family selection                                                                    | Reverse-autocallable or capital-at-risk participation pricing             |
| Pricing outcome/recovery     | State specimens for failed/unknown/unavailable                                                          | Actual submission, polling, retry, quote journal                          |
| Historical client book       | Explicit book scope, currency/region filters, fixture list, profile inspector                           | Real client data, current holdings, entitlements                          |
| Historical matching          | Authored similarity and coverage fixtures; missing/unrankable visible                                   | Matching algorithm, suitability assessment, predicted demand              |
| Scheduled maturity           | Explicitly estimated date in profile, with early-redemption caveat                                      | Maturity forecasting, holdings or reinvestment automation                 |
| Analytics                    | Local quarterly guaranteed-coupon cash-flow demonstration; chart/table binding                          | Pricing, options valuation, correlation services, product lab comparisons |
| Configuration and services   | Day/Night local UI preference and honest disconnected notices                                           | Model configuration, credentials, secrets, service management             |
| Documents and distribution   | Synthetic draft JSON download; unavailable capability explanation                                       | PDF terms, client reports, emails, sales routing, execution               |
| Legacy/compatibility/player  | Described as outside this initial slice                                                                 | Legacy portfolios, run comparison, immersive historical player            |
| State gallery                | Interactive design specimen                                                                             | Claim of production acceptance of all states                              |

## Numerical scope

The builder accepts 12/18/24/36 month fixture tenors, 40–95% maturity barrier, 0–20% annual coupon and 80–100% Reoffer. These are demonstration form bounds, not product eligibility. Unsupported families remain explicitly draft-only. The cash-flow lens uses a fixed 24-month example and must not be interpreted as a universal Note simulator.

## Data and retention

All identities, instrument identifiers, ideas, profiles, activity and numbers are newly authored fictional fixtures. All current state is in browser memory. Draft export creates a local JSON file at the user's request. There are no analytics trackers, external data requests or backend storage. Reload resets the session.
