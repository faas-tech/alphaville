# Alphaville

An editorial research desk for structured ideas, historical context and transparent scenarios.

**Local design prototype. Synthetic data only.** There are no external APIs, pricing services, live research models, email integrations, orders, financial actions or real client records. Nothing in this repository is investment advice, an executable quote, or a suitability assessment.

## Adopting this design in another application

Start with [the implementation handoff](docs/IMPLEMENTATION-HANDOFF.md). It maps reusable tokens, components and frontend patterns, defines integration boundaries, and includes a copy-ready prompt for the recipient's coding agent. Use this prototype as a reference while preserving the receiving application's business logic and backend.

The public repository's default branch is `prototype/edition-01`. Public access means the code can be read and cloned without an invitation; see the handoff for asset and licensing considerations.

## Run

Node.js 20.9 or later:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:8872. The development and production scripts bind only to loopback.

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Explore

- **Workspace:** a daily editorial brief, idea cards, local research-example composer and reading list.
- **Opportunity pipeline:** four stages, theme and text filters, board/list views and idea detail.
- **Idea builder:** fictional listing selection, material terms, validation, exact-term review, synchronous invalidation and synthetic JSON export.
- **Client evidence:** explicit book selection, historical filters, coverage, missing/unrankable states and profile inspection.
- **Analytics:** deterministic local quarterly cash-flow scenarios. Inputs invalidate previous outputs immediately. Chart and table share one data source.
- **Design system:** Day/Night tokens, type, actions, semantic states and a component specimen.

Command-K / Control-K opens search. Navigation uses shareable hash locations and browser history. Unknown locations recover in the shell. Draft inputs remain available when moving between screens in the same session. Reloading the page resets all state. Choosing a different idea replaces the current builder example; export a draft first if you want to retain it.

## Financial meaning

Drafts contain inputs, not observed prices. A local review binds exact current inputs and is cleared on any material edit. Reoffer is purchase price as a percentage of nominal, distinct from annual coupon and barrier. Historical similarity is not suitability, holdings, probability, predicted demand or permission to contact anyone.

The scenario calculator is a deliberately narrow contractual illustration: equal guaranteed quarterly coupons, a 24-month term, 100% strike/autocall trigger/downside leverage and a European maturity barrier. It excludes issuer default, fees, tax and actual day counts. Outputs are percentages of nominal, not returns calculated from Reoffer. A scenario is not a forecast.

## Project structure

```text
src/app/                  Application shell and semantic CSS tokens
src/components/           Connected screens and shared UI primitives
src/lib/data.ts           Original fictional instruments, ideas and profiles
src/lib/contracts.mjs     Pure local validation and cash-flow functions
qa/contracts.test.mjs     Contract tests
public/fonts/             Self-hosted open-source fonts and OFL licenses
docs/                     Design decisions, scope and verification notes
```

## Design lineage

Alphaville adapts the ruled editorial grid, dateline, asymmetric lead and type hierarchy of the Morning Edition direction into an expert workspace. The identity, palette, components, copy and synthetic fixtures are original to this prototype. No source attachments, confidential screen inventories, private routes or corporate assets are included.

Outfit and Figtree are licensed under the SIL Open Font License 1.1. See `public/fonts/licenses/` and [font attribution](docs/FONTS.md).

See [design system](docs/DESIGN-SYSTEM.md), [scope](docs/SCOPE.md), [verification](docs/VERIFICATION.md), and [review handoff](docs/REVIEW-HANDOFF.md).
