# Alphaville second-opinion review

- **Branch / commit:** `prototype/edition-01` at `9432c27` (clean tree)
- **Reviewer:** Claude Fable 5.2 (`claude-fable-5-2`), effort high, both confirmed from session metadata
- **Date:** 12 November 2026. Review only; no application code changed.

## Readiness verdict

**Ready to demo after one short fix cycle.** The editorial identity, honest-state copy and core flows hold up. Nothing is broken in the main paths, but two layout/state defects will show on a laptop screen, and a handful of financial labels invite exactly the questions a structured-products colleague will ask. All eight findings are small.

## Findings, ranked

**1. Sidebar footer is unreachable on laptop-height screens. Observed defect.**
Screen: every screen, rail. `.sidebar` is `position: fixed; height: 100vh` with no overflow rule (`globals.css:178-188`). At 1440×900 its content is 979px tall, so the profile row and Day/Night toggle sit at y=926–958, below the viewport, and cannot be scrolled to. Keyboard focus lands on the invisible toggle. In `next dev`, the Next indicator also covers the Design system link (and the toggle on the narrow rail).
Impact: Night theme cannot be shown in the demo without resizing the window.
Fix: `overflow-y: auto` on `.sidebar`; demo from `npm run build && npm start`.

**2. "Review cleared" notice appears off-screen. Observed defect.**
Screen: Idea builder. After saving a review, editing the barrier at the material-terms scroll position rendered the amber alert 336px above the viewport (`Workspace.tsx:1317-1325`). The sticky panel silently reverts to "Draft · unpriced".
Impact: the prototype's signature safety behaviour is invisible at the moment it fires.
Fix: render the alert inside the sticky draft-terms panel, above "Review exact terms". Analytics already does this well with its in-place "Inputs changed" state.

**3. "Value to calculate" contradicts the entered coupon. Observed, financial label.**
Screen: Idea builder and Draft terms tab. "Annual coupon" is selected as the value to calculate, yet the same field is an editable 8.4 and the reviewed summary lists both "Annual coupon 8.4% p.a." and "Value to calculate: Annual coupon" (`Workspace.tsx:1513-1530`, `1223`).
Impact: a structurer cannot tell whether 8.4% is a term, a target or a placeholder, and the acknowledgement covers it either way.
Fix: copy only. Mark the solved-for term as indicative in its hint and in the summary, for example "8.4% p.a. · indicative, would be calculated".

**4. Idea cards imply price history and real tickers. Observed, financial label.**
Screen: Workspace, Pipeline, idea detail. `MiniChart` draws one of three hard-coded rising lines on every card (`Workspace.tsx:113-134`). `Basket` strips the `MOCK-` prefix (`:140`), so the summary shows "ASTR / JNPR"; JNPR was a real listed ticker.
Impact: every idea appears to have gone up, on instruments that look real.
Fix: keep the `MOCK-` prefix in `Basket`; replace the line with a non-price motif or caption it as illustration.

**5. Research coverage disagrees with the Evidence tab. Observed defect.**
Screen: idea detail. AV-013's summary says "2 of 4 sources"; its Evidence tab lists three present and one missing. The tab is a static list for every idea (`Workspace.tsx:1087-1105`) while the count is a per-idea string (`data.ts:35-125`), so AV-011 claims "4 of 4" beside a "Missing" row.
Fix: derive both from one per-idea list, or remove the count.

**6. Similarity has no stated reference. Observed omission.**
Screen: Client evidence. "Similarity 84/100" and "Historical similarity 72/100" never say similar to what. Cedar Kite scores 72 with "Underlying overlap: Missing".
Impact: the first question in the room will be "similar to which idea?"
Fix: one caption on the table, naming the reference terms and stating that scores use recorded factors only.

**7. Selection state and names are not exposed to assistive technology. Observed defect.**
- Narrow rail (≤760px): labels are `display: none` (`globals.css:2838`) and the six nav buttons have no `aria-label` or `title`.
- Detail tabs, pipeline theme filters and the Value-to-calculate choices mark selection by class only (`Workspace.tsx:1002-1008`, `830-836`, `1517-1521`). Board/List already use `aria-pressed`.
- "Review exact terms" unmounts on click, so focus drops to `<body>`.
Fix: `aria-label` on nav buttons; `aria-pressed` on those three groups; move focus to the acknowledgement checkbox.

**8. Small state and copy inconsistencies. Observed, minor.**
- "Back to the desk" returns to the pipeline (`:980`).
- After saving, the panel still says "Terms ready to check" and confirms with a 45%-opacity disabled button (`:1592`, `:1622`).
- Command search ignores Enter and arrow keys; results need Tab (`:500-521`).
- The active "Opportunity pipeline" label wraps to two lines and shifts the rail.
- Reoffer hint says "reference amount"; the summary says "nominal".

## Optional design suggestions

- Analytics axis reads 110% / 55% / 0% (`Workspace.tsx:2117-2121`). 0 / 50 / 100 with a nominal line would read faster. Totals mix "116.00%" and "100%".
- Analytics inputs are independent of the builder draft; one line saying so would pre-empt the question.
- Selects render at 15px and number inputs at 14px.

## What to keep

- Dateline, ruled grid, asymmetric lead and the orb with its visible pause control.
- Plain boundary copy: "No price obtained", "Not holdings or probability", "No matching service calculated them".
- Client evidence clearing results when a filter changes, with a clear reload prompt.
- Analytics: synchronous invalidation, loss scenario labelled "Principal loss", chart and table reconciled (116.00%, 66.00%, 108.00% checked).
- Dropdown alignment: every select measured 44px high, arrow 15px from the edge, vertically centred, level with adjacent buttons.
- Visible 2px focus ring, skip link, native dialog with focus restored on Escape.
- No horizontal overflow at 375px on any surface; Night theme at parity.
- Restraint with chips and numbering. No decorative numbers found.

## Three highest-value changes

1. Make the sidebar scroll and demo from the production build (finding 1).
2. Move the review-cleared notice into the draft panel (finding 2).
3. One financial-label pass: solve-for wording, `MOCK-` prefix, sparkline, coverage count, similarity reference (findings 3–6).

## Checks performed and limitations

Performed in the embedded Chromium pane against the repo's already-running `next dev` server on `127.0.0.1:8872`, at 1440×900 and 375×812:

- Workspace scan; pipeline → AV-013 detail (all three tabs) → back link.
- Builder: review, acknowledge, save, edit after save.
- Client evidence: Demo book A, profile inspector, GBP empty scope.
- Analytics: maturity, below-barrier and autocall scenarios; edit-invalidates-output.
- Keyboard: first tab stops, focus ring, ⌘K open/type/arrow/Escape.
- Night theme on builder and pipeline; select and button geometry by measurement.
- Source read selectively to confirm each finding.

Not done or limited:

- `npm test`, typecheck and build were not rerun.
- Reduced motion could not be emulated; `globals.css:3607` and `ResearchOrb.tsx:30-45` were source-reviewed only. The orb pause control toggled at runtime.
- No screen reader, touch device or second browser engine. Accessibility findings come from DOM inspection.
- Browser Back/Forward, JSON export, the Design system screen and colour contrast were not checked.
- Screenshots lagged after scripted navigation, so narrow-layout visual inspection covered workspace, builder and client evidence only.
