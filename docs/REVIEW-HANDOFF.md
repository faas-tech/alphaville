# Alphaville review handoff

Review the current `prototype/edition-01` branch. This is a public, synthetic-data design prototype, not a production financial application. Start with `AGENTS.md`, `README.md`, `docs/DESIGN-SYSTEM.md`, `docs/SCOPE.md` and `docs/VERIFICATION.md`.

## Review goal

Find concrete defects and the smallest changes that make this prototype easier to understand, safer to iterate on and easier to maintain. Review first; do not implement changes, connect services, add credentials, publish or deploy without approval. Do not push to `main`. Use only this repository's fictional data and public assets.

## Current changes

- Centered original SVG alpha with three orbiting satellites and trails in `src/components/ResearchOrb.tsx` and its CSS module. Fixed alpha and labels, pause/play control, reduced-motion preference, offscreen and hidden-tab suspension.
- Decorative numbering removed across all screens. Counts have no padding. Financial values, identifiers and cash-flow periods retain their meaning.
- Named builder stages expose current and completed states. Shared design guidance prohibits numbers without a specific user purpose.
- Nineteen tests: fifteen financial-contract checks and four source-level presentation guards. Source assertions are not substitutes for browser tests.

## Run and inspect

Use Node.js 20.9 or newer. Run `npm ci`, `npm test`, `npm run typecheck` and `npm run build`. Use `npm run dev` for the local browser at `http://127.0.0.1:8872`. Do not use port 8791.

Inspect all six surfaces plus idea details. Exercise builder edits after review, blank versus zero inputs, book/filter changes, browser Back/Forward, command search dismissal and local JSON export. Check that every claimed result remains explicitly fictional and local.

## Priority checks

- Financial semantics: exact-term binding, missing versus zero, protected-participation fields, barrier equality, autocall termination, chart/table consistency and scope of historical evidence.
- UI: named workflow states, clear hierarchy without decorative numbering, selectors and long text, keyboard focus, dialog containment, mobile widths and zoom. Preserve concise wording and avoid repeated chips or stacked labels.
- Animation: initial hydration, pause/resume, changing reduced-motion preference, visibility changes, offscreen suspension and browser compatibility. Motion must never imply a real service is working.
- Maintainability: the large `Workspace.tsx` and accumulated global CSS overrides. Recommend small extractions or removals only where they solve a concrete problem. Avoid a wholesale redesign or new framework.
- Test coverage: state transitions and accessibility are not covered by the source guards. Identify the highest-value behavioral tests before proposing more dependencies.

## Known verification limits

Native Chrome desktop review covered all surfaces, builder review/save, fixture loading, chart/table output, and animation movement/pause in Day and Night. Reduced-motion and visibility handling were source-reviewed but not comprehensively runtime-tested. Narrow-screen overflow, full keyboard traversal, screen-reader acceptance and cross-browser behavior remain unverified. No production pricing, suitability, security or financial certification is claimed.

## Return format

Lead with actionable findings ordered by severity. For each, cite the file and line, reproduction steps, observed versus expected behavior, user impact and a minimal fix. Separate verified defects from hypotheses and optional improvements. List checks actually run and any blockers. End with a short recommended implementation order. Do not report unavailable tools or unrun tests as passes.
