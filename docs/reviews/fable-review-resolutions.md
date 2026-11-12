# Fable review resolutions

This records the implementation response to the 12 November 2026 review of commit `9432c27`. The original `fable-5.2-review.md` is unchanged.

## Findings addressed

| Finding                                                    | Change                                                                                                                                                                                                                                                    | Verification                                                                               |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Sidebar footer below laptop viewport                       | Rail scrolls vertically, children retain their size, and navigation labels stay on one line. Narrow-rail buttons have explicit accessible names and hover titles.                                                                                         | Source check; native laptop-height and narrow-screen review pending.                       |
| Review-cleared notice offscreen                            | Notice now sits inside the draft panel above the review action. The panel scrolls when needed, and invalidation scrolls the notice into view without changing input focus.                                                                                | Source wiring check; native edit-after-save flow pending.                                  |
| Solved-for term looked like a fixed term                   | A shared display helper marks the solved-for coupon or Reoffer as “indicative, would be calculated.” Input hints distinguish indicative placeholders from fixed draft terms. Protected participation still has no coupon.                                 | Pure tests cover both solve targets, protected participation, blank inputs and true zero.  |
| Cards implied prices and real tickers                      | Removed all fixed rising sparklines. Cards use decorative, non-data geometry. Basket summaries retain the full `MOCK-` identifier.                                                                                                                        | Source check plus identifier tests.                                                        |
| Coverage and evidence rows disagreed                       | Each idea has one evidence list. Both the summary count and displayed availability derive from that list. Every source is explicitly an example, including the fictional market-source row.                                                               | Tests exercise actual idea fixtures and all six expected coverage counts.                  |
| Similarity lacked a reference                              | The table names the fictional AV-014 reference and its family, currency, tenor, barrier and MOCK basket. The caption states that the scores are authored examples, not calculated matches. Filters select records without recalculating scores.           | Reference terms tested against the idea fixture. No matching algorithm or real data added. |
| Missing accessible names, selected states and review focus | Main navigation has labels independent of visible text. Detail tabs, theme filters, solve choices and state specimens expose pressed state. Capturing terms moves focus to the acknowledgement; saving moves focus to the receipt.                        | Source wiring checks; native keyboard flow pending.                                        |
| Small navigation and state inconsistencies                 | Detail back-link names its actual destination. Saved review displays a full-contrast receipt instead of a faded disabled button. Command search supports arrow navigation and Enter. Reoffer uses “nominal” consistently and defines it beside the input. | Pure keyboard-index tests and typecheck; native navigation/search flow pending.            |

## Optional polish included

- Analytics states that its inputs are separate from the idea-builder draft.
- Principal and total cash-flow figures both use two decimal places.
- Number inputs and selects use matching desktop font sizes.

The chart retains its 110% maximum. A terminal payment can include 100% principal plus a quarterly coupon; changing the maximum to 100% would clip that payment. No calculation was changed.

## Checks and limits

The test suite includes financial contracts, evidence/term-label fixture tests, command-menu movement tests and targeted UI wiring checks. These checks do not replace native visual or assistive-technology testing. Native acceptance of this fix cycle is pending and will be recorded separately.

The prototype remains local and disconnected. No pricing, research retrieval, client matching, financial action or external communication was introduced. Historical similarity, missing evidence and illustrative solved-for values remain explicitly qualified.
