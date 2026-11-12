# Alphaville design system

## Design intent

A working research desk, not a marketing landing page. The design gives the user a clear sequence: orient, investigate, assemble, review and inspect historical context. It lets uncertainty remain visible.

The editorial lineage is expressed through a dateline, descriptive headings, rules, asymmetric composition, typographic hierarchy and compact evidence captions. The app replaces promotional storytelling with information density and repeatable task controls.

## Deliberate departures

- New Alphaville wordmark and original monogram. No inherited corporate identity or logo.
- Warm paper rather than the reference's cool light surface. The pale background reduces contrast between table, canvas and sidebar without removing boundaries.
- Flat violet actions rather than gradient pills. Expert controls use a restrained 4px radius, reserving circular geometry for identity and research diagrams.
- Compact product headings rather than full-screen landing-page poster scale.
- Status vocabulary instead of recommendation/fit scoring colors. Green means recorded evidence or a completed local state, not endorsement.
- The optional ResearchOrb identity animation is the sole decorative-motion exception. Its alpha and labels stay fixed while satellites and tracks move. It has a visible pause control, starts static for reduced motion, and pauses when offscreen or the tab is hidden. It never indicates research, price or service status. Other feedback is brief; reduced motion removes transitions and lifts.

## Tokens

| Role            | Day       | Night     |
| --------------- | --------- | --------- |
| Paper           | `#F7F7F2` | `#171C1A` |
| Surface         | `#FFFFFF` | `#202723` |
| Surface 2       | `#F0F0E9` | `#28302B` |
| Sidebar         | `#EFEFE8` | `#1C231F` |
| Ink             | `#232722` | `#F1F2E9` |
| Secondary ink   | `#62675F` | `#BEC4B7` |
| Subtle ink      | `#71766C` | `#A8B1A1` |
| Structural rule | `#B7BCAF` | `#667362` |
| Signal          | `#5653D8` | `#AAA4FF` |
| Evidence        | `#356B4F` | `#A3CBB0` |
| Attention       | `#855B20` | `#E6C588` |
| Critical        | `#A34142` | `#EAA4A4` |

Tokens live in `src/app/globals.css`. Color is always paired with text, shape or a label. Day is the default; the person explicitly selects Night.

## Typography

Outfit is the display and numeric face. Figtree is the reading and control face, with italic used sparingly for editorial captions. System monospace is reserved for identifiers, datelines, structured values and secondary labels. No web font request occurs at runtime.

The visual composition uses 16–18px reading copy, 14–16px primary controls, and 12px compact annotations. The hierarchy should be tested with actual expert users before production. Narrow layouts restructure the workspace; they are not a claim of a fully supported mobile financial product.

## Component families

- Navigation rail, command dialog, dateline, breadcrumb and feedback toast.
- Flat primary/secondary actions, disabled controls and visible focus.
- Semantic stage tags: Research, Draft, Review, Evidence.
- Ruled section heading, research card, thesis article, term sheet.
- Confirmed fictional-listing rows, labeled numeric/select fields, exact-term review.
- Historical evidence table, factor coverage, unrankable and profile inspector.
- Deterministic cash-flow chart with exact-value table.
- Honest state specimen: incomplete, ready, historical, partial, empty, unrankable, stale, failed, unknown and unavailable.

## Behavior contracts

- Input edits clear dependent review and analytics outputs synchronously.
- Blank numeric values are missing, not zero. A genuine zero remains valid where defined.
- No fake result implies a service call. Research examples are labeled fixed fixtures.
- Historical similarity has no suitability, holdings or demand semantics.
- Unknown submission is a design specimen, not a real pending operation. Production recovery would check status before considering any resubmission.
- Drafts survive in-app navigation in the same browser session, but not reload. Export is explicit and local.
- Search opens a native modal dialog with Escape handling and native focus containment/restoration.
- Charts and tables share one local data source.

## Layout & access

Desktop uses a 240px rail and a fluid content sheet with a 1600px maximum. At narrower desktop widths, secondary panels stack. At small widths the rail becomes icon-only and cards become a single-column reading flow. Important form controls remain semantic HTML controls. There is a skip link, focus treatment, labeled inputs and a reduced-motion stylesheet. Screen-reader, touch-device and cross-browser acceptance remain future work.

## Page structure

Pages omit stacked labels, slogan headings and duplicate pipeline status. Each page has one task title. Extra text remains only when it explains an action, missing information or a financial term.

Stage labels use four short marks to show progress. A card inside a named stage column does not repeat that stage. Instrument names use plain text rather than chips. Status messages remain readable without a colored container.

The original Alphaville SVG set represents a research folio, staged review, term sheet, purchase ledger, payoff profile, and type/rule specimen. These are original drawings in `Icons.tsx`, not imported icon-library assets. Utility symbols share their 24px grid and 1.5px stroke.

Select fields retain native selection and keyboard behavior. A custom arrow sits 15px from the right edge; text has a 44px right inset. Selects, numeric inputs and adjacent primary buttons are 44px high.

Visible writing uses direct task names and plain explanations. Product terms remain consistent; coupon, Reoffer, nominal and the maturity barrier are explained beside the relevant inputs. Historical records, suitability, pricing and execution remain separate concepts.

## Numbers must serve a task

Do not add numbers for visual decoration. Headings, spacing, rules and clear wording must explain the page structure. This applies to section headings, task lists, evidence lists, sidebar entries, footers and design-system examples. Do not add edition numbers, page ordinals or leading zeros to make a layout look structured.

Keep a number only when it provides specific user value:

- **Data:** counts of ideas, profiles and purchases; scores and coverage; financial amounts, percentages, terms and calculated payments.
- **Identity:** instrument and idea identifiers such as `MOCK-ASTR` and `AV-014`. Preserve their exact format, including meaningful leading zeros.
- **Time and necessary order:** dates, quarter labels and cash-flow periods. Use numbered steps only when the order itself is essential and labels or current/completed states cannot explain it clearly.
- **Technical specification:** color values, type measurements, spacing, control dimensions and other implementation values.

Show ordinary counts without leading zeros: `6`, `1`, `0`. Keep meaningful numeric precision in financial values. Builder progress uses named stages with current and completed states, without ordinal numbers. Before introducing any new number, state what it helps the person identify, compare, calculate or do in order. If it does none of these, leave it out.
