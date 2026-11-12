# Verification

## Automated checks

- TypeScript strict type checking.
- Fifteen financial contract tests: valid draft, blank-versus-zero, genuine zero coupon, required basket, numeric bounds, exact review binding, barrier equality, below-barrier loss, zero principal, autocall termination, chart/table source reconciliation, protected-participation export/validation, captured-versus-reviewed state, and disabled maturity input handling.
- Four source regression checks cover removal of decorative numbering, unpadded ordinary counts, retained financial identifiers/precision/periods, and the documented numbering/motion rules.
- Independent package install and committed package lock; initial audit reported no vulnerabilities.

## Verified locally, 12 November 2026

- Production build and strict typecheck passed after final interaction fixes.
- Native Chrome review on the connected Mac: workspace, builder, pipeline, client evidence, analytics and design-system screens rendered with no visible clipping at the current desktop size.
- Pipeline board/list switching, Growth filtering, idea detail and browser Back were exercised.
- Builder blank coupon shows a missing-value error, not zero. Editing a captured draft immediately clears review.
- Client evidence starts without loaded data; explicit book selection loads the fictional snapshot and profile inspector.
- Local scenario output showed 116% contractual cash flow and 100% principal for the default example, reconciled with eight table rows. Editing an assumption cleared the output.
- Day/Night appearance and command-search opening, keyboard entry and Escape dismissal were exercised.
- Source review found no external data requests, credentials or raw reference attachments in the publication set.

## Remaining QA

Full keyboard traversal, screen-reader acceptance, console inspection, narrow-screen overflow, touch devices and cross-browser behavior are not certified. Passing contract tests does not imply production financial validation. This first slice is ready for manual design iteration, not production use.

## Not certified

Real pricing or model behavior, real client matching, investment suitability, financial accuracy beyond the deliberately simplified local formula, production authorization, security review, screen-reader acceptance, real devices and cross-browser support.

## Visual revision

The second visual pass was checked in native Chrome after simplifying headings and status labels. Builder and client-book selectors align with neighboring controls; their arrows have consistent inset spacing. Keyboard selection still works. The pipeline no longer repeats a stage on cards inside its labeled column. Updated workflow icons and the client table were inspected in Day and Night themes.

## Numbering cleanup

All six surfaces and the idea-detail page were inspected again in native Chrome after removing decorative numbers. Workspace task headings, pipeline counts, builder sections, the historical book, cash flows and design-system sections render without empty number gutters. Ordinary counts remain visible without leading zeros; idea IDs, financial values and quarter labels retain their meaning.

The builder advanced through Assemble, Review terms and Save review using named current/completed states. Selecting Demo book A loaded 25 recorded purchases across 3 profiles with 1 fully covered profile. The default cash-flow scenario still showed 116.00% across eight quarters. The workspace was reloaded to clear the local QA state and left open with the animated alpha intact. The final 19 tests, strict typecheck and production build passed. Narrow-screen, screen-reader and cross-browser acceptance remain unverified.
