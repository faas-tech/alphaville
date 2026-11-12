# Adopt Alphaville in an existing product

## Purpose

Use this repository as a design and interaction reference, not as a replacement backend. Bring its visual system, components and useful frontend patterns into the recipient's application while preserving that application's business rules, APIs, identity, permissions and data contracts.

Start with `README.md`, `docs/DESIGN-SYSTEM.md`, `docs/SCOPE.md`, `docs/VERIFICATION.md` and the Fable review plus resolutions in `docs/reviews/`.

## Run the reference

Clone `https://github.com/faas-tech/alphaville` and check out `prototype/edition-01`. Use Node 20.9 or later, run `npm ci`, `npm run typecheck`, `npm test`, then `npm run build && npm start`. Open `http://127.0.0.1:8872`.

This is Next.js/React/TypeScript with CSS variables, plain CSS and a CSS module for the animated mark. No API keys or environment files are needed. Read the installed Next.js documentation called out in `AGENTS.md` before changing framework-specific code. Keep the recipient's existing framework unless migration is separately approved.

## Source map and reuse boundaries

| Reference | Reuse or adapt | Do not copy blindly |
| --- | --- | --- |
| `src/app/globals.css` | Semantic Day/Night tokens, typography, ruled layout, fields, focus and responsive patterns | Global selectors can collide. Extract/scoped-adapt them in the target app rather than replacing its whole stylesheet. |
| `src/app/layout.tsx` | Self-hosted font setup and global foundation | App-specific metadata and framework wiring |
| `src/components/Workspace.tsx` | Navigation, command menu, cards, builder review, evidence table, scenario and state patterns | This is a connected prototype, not a ready-made component package. Extract small components and supply target-app props/adapters. |
| `src/components/Icons.tsx` | Original workflow icons and consistent geometry | Invented meaning for unrelated target workflows |
| `src/components/ResearchOrb.tsx` and `.module.css` | Optional identity animation, pause, reduced-motion and visibility behavior | Do not use decorative animation as real job progress. |
| `src/lib/presentation.mjs`, `search.mjs` | Presentation helpers and keyboard-navigation behavior | Domain assumptions that differ from the target product |
| `src/lib/contracts.mjs` | Examples of exact-input review invalidation and chart/table reconciliation | Illustrative financial formulas are not a production pricing engine. Preserve the recipient's approved formulas. |
| `src/lib/data.ts` | Shape examples for fixtures | All records, scores and coverage are synthetic. Do not migrate them as real data. |
| `qa/` | Adapt regression intentions and relevant tests | Source-string tests alone do not prove browser accessibility or production correctness. |

## Integration sequence

1. Inspect the recipient's repo instructions, architecture, current components, data contracts, tests and theme mechanism. Record a short mapping of current screens to Alphaville patterns. Identify differences before editing.
2. Create a feature branch in the recipient repository. Establish baseline tests and screenshots. Do not replace its routing, authentication, services or build pipeline just to match this demo.
3. Introduce semantic tokens and fonts through the existing theme layer. Scope styles and migrate one representative screen. Keep both themes and the target app's accessibility guarantees.
4. Extract reusable primitives: action buttons, labeled fields, selects, section headings, state messages, cards, table rows and dialogs. Keep numeric meaning, validation, keyboard interaction and loading/error/empty states explicit.
5. Port layouts and domain components incrementally. Wire real APIs through adapters. Preserve authorization and server validation. Make loading, stale, missing and failed states reflect actual data, not demo placeholders.
6. Keep the review invariant: any material edit invalidates the review immediately, and the notice stays visible beside the action. Preserve real financial terminology and distinguish indicative from fixed/observed values.
7. Validate each migrated flow, then remove superseded styles/components only when verified unused. Present screenshots and remaining differences for approval before merging or deploying.

## Visual and writing rules

- One clear title per view. Avoid stacked headings, repetitive descriptions and complete-sentence titles.
- Use few chips, only when they convey distinct information. Never repeat a stage already established by its column.
- No decorative numbering. Preserve meaningful counts, identifiers, financial precision and necessary sequence.
- Clear professional language; explain specialist terms where useful without changing their meaning.
- Maintain consistent control height, arrow inset, padding, alignment and focus treatment.
- Keep financial labels honest: authored similarity is not suitability; a draft is not a price; missing evidence remains missing.
- Respect reduced motion, provide animation pause, and retain the real loading states separately.

## Acceptance checklist

- Existing business and API tests remain green; add tests for changed states and contracts.
- Typecheck, build, keyboard search, dialog focus/escape, browser Back/Forward and edit-after-review work.
- Review all affected screens in Day/Night and at desktop and narrow widths; no unreachable sidebar footer or horizontal overflow.
- Check contrast, keyboard-only interaction, screen-reader labels, error association, reduced motion and touch targets. Record what was actually tested.
- Charts and tables agree; blank is not zero; unverified or missing data cannot appear verified.
- No raw source attachments, secrets, real client records or debug data enter the public reference repo.
- Supply a concise changed-file summary, screenshots, test results, limitations and rollback plan. Do not claim production financial validation from this demo.

## Assets, licensing and limits

Keep `public/fonts/licenses/` and `docs/FONTS.md` with reused fonts. Outfit and Figtree use the SIL Open Font License. The repository is publicly readable; public visibility itself is not an unrestricted software license. Confirm the owner's permission and the target team's licensing requirements before redistributing code outside the intended recipient project. Do not add or infer a new open-source license.

No backend, persistence, live research, pricing, client matching, email or trading is implemented here. The local preview is not a public hosted site. The compact process-tracker brief discussed separately is not an implemented component in this repo.

## Prompt for the recipient's coding agent

> Use the public Alphaville repository as the visual and interaction reference for upgrading this application's frontend. Read its README and docs/IMPLEMENTATION-HANDOFF.md, then inspect this application's instructions and architecture. Propose a short screen/component mapping and implement an incremental migration on a feature branch. Preserve our business logic, APIs, auth, permissions and financial semantics. Reuse semantic tokens and patterns, not the synthetic data or illustrative pricing formulas. Keep the editorial hierarchy, restrained chips, meaningful-only numbering, plain copy and accessible controls. Validate real rendered flows in both themes and narrow layouts, and report tests, screenshots and remaining limitations. Do not merge, deploy or replace infrastructure without approval.
