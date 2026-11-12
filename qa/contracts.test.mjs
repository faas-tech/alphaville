import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  validateTerms,
  bindTerms,
  createDraftExport,
  isReviewCurrent,
  scenarioCashflows,
} from "../src/lib/contracts.mjs";
const terms = {
  basket: ["MOCK-ASTR"],
  currency: "USD",
  tenor: 24,
  barrier: 60,
  coupon: 8,
  reoffer: 100,
  family: "Autocallable",
  solve: "Annual coupon",
};
test("valid fixture terms have no field errors", () =>
  assert.deepEqual(validateTerms(terms), []));
test("blank fields are missing, not zero", () => {
  for (const field of ["barrier", "coupon", "reoffer"])
    assert.ok(validateTerms({ ...terms, [field]: " " }).length > 0);
  assert.equal(scenarioCashflows("", 60, 80), null);
  assert.equal(scenarioCashflows(8, 60, ""), null);
});
test("real zero coupon is valid", () =>
  assert.deepEqual(validateTerms({ ...terms, coupon: 0 }), []));
test("basket resolution is required", () =>
  assert.ok(validateTerms({ ...terms, basket: [] }).length));
test("term bounds remain explicit", () => {
  assert.ok(validateTerms({ ...terms, barrier: 96 }).length);
  assert.ok(validateTerms({ ...terms, reoffer: 101 }).length);
  assert.equal(scenarioCashflows(8, 96, 80), null);
});
test("material edits invalidate bound review", () => {
  const review = bindTerms(terms);
  assert.ok(isReviewCurrent(terms, review));
  for (const [key, value] of [
    ["currency", "EUR"],
    ["tenor", 12],
    ["barrier", 65],
    ["coupon", 9],
    ["reoffer", 99],
    ["solve", "Reoffer"],
    ["family", "Reverse autocallable"],
    ["basket", ["MOCK-JNPR"]],
  ])
    assert.equal(isReviewCurrent({ ...terms, [key]: value }, review), false);
  assert.equal(isReviewCurrent(terms, null), false);
});
test("barrier equality is not breach", () =>
  assert.equal(scenarioCashflows(8, 60, 60).at(-1).principal, 100));
test("below barrier principal follows worst underlying level", () =>
  assert.equal(scenarioCashflows(8, 60, 59).at(-1).principal, 59));
test("zero final level is a true total principal loss", () =>
  assert.equal(scenarioCashflows(8, 60, 0).at(-1).principal, 0));
test("autocall stops coupons and redeems nominal", () => {
  const rows = scenarioCashflows(8, 60, 80, 8, 4);
  assert.equal(rows.length, 4);
  assert.equal(rows.at(-1).principal, 100);
  assert.equal(
    rows.reduce((s, r) => s + r.total, 0),
    108,
  );
});
test("quarterly chart and table source totals reconcile", () => {
  const rows = scenarioCashflows(8, 60, 80);
  assert.equal(rows.length, 8);
  assert.equal(
    rows.reduce((s, r) => s + r.total, 0),
    116,
  );
  assert.ok(rows.every((r) => r.total === r.coupon + r.principal));
});

test("protected participation export excludes irrelevant coupon and barrier", () => {
  const protectedTerms = { ...terms, family: "Protected participation" };
  const exported = createDraftExport(protectedTerms, null, false);
  assert.equal(exported.terms.coupon, null);
  assert.equal(exported.terms.barrier, null);
  assert.equal(exported.terms.nominalProtection, 100);
  assert.equal(exported.terms.direction, "CALL");
  assert.equal(exported.terms.cap, "Uncapped");
  assert.equal(exported.terms.solve, "Reoffer");
  assert.equal(protectedTerms.coupon, 8, "export must not mutate draft inputs");
});
test("protected participation validates relevant fields only", () => {
  const protectedTerms = {
    ...terms,
    family: "Protected participation",
    coupon: "",
    barrier: "",
  };
  assert.deepEqual(validateTerms(protectedTerms), []);
  assert.ok(validateTerms({ ...protectedTerms, reoffer: "" }).length);
  assert.ok(
    validateTerms({ ...protectedTerms, basket: ["MOCK-ASTR", "MOCK-JNPR"] })
      .length,
  );
});
test("captured terms are not described as reviewed before save", () => {
  const review = bindTerms(terms);
  assert.equal(
    createDraftExport(terms, null, false).status,
    "Unreviewed draft",
  );
  assert.equal(
    createDraftExport(terms, review, false).status,
    "Terms captured; acknowledgement pending",
  );
  assert.equal(
    createDraftExport(terms, review, true).status,
    "Locally reviewed example",
  );
  assert.equal(
    createDraftExport({ ...terms, coupon: 9 }, review, true).status,
    "Unreviewed draft",
  );
});
test("autocall ignores the disabled maturity input but maturity requires it", () => {
  for (const unused of ["", " ", NaN, -1, 200]) {
    const rows = scenarioCashflows(8, 60, unused, 8, 4);
    assert.equal(rows.length, 4);
    assert.equal(rows.at(-1).principal, 100);
    assert.equal(
      rows.reduce((sum, row) => sum + row.total, 0),
      108,
    );
  }
  assert.equal(scenarioCashflows(8, 60, "", 8, null), null);
});

// Guard against reintroducing the removed presentation-only numbers.
const workspaceSource = readFileSync(
  new URL("../src/components/Workspace.tsx", import.meta.url),
  "utf8",
);
const designGuidance = readFileSync(
  new URL("../docs/DESIGN-SYSTEM.md", import.meta.url),
  "utf8",
);
test("section and list presentation has no decorative numbering", () => {
  assert.doesNotMatch(workspaceSource, /<SectionHeading[^>]*\bnumber=/);
  assert.doesNotMatch(workspaceSource, /className="(?:number|radar-number)"/);
  assert.doesNotMatch(workspaceSource, /(?:EDITION\s+0\d|№\s*0\d)/);
  assert.doesNotMatch(workspaceSource, /<b>0[123]<\/b>/);
});
test("ordinary counts are not padded for presentation", () => {
  assert.doesNotMatch(workspaceSource, /\.padStart\(/);
  assert.doesNotMatch(workspaceSource, /(?:count|value):\s*"0[1-9]"/);
  assert.match(workspaceSource, /count: String\(ideas\.length\)/);
  assert.match(workspaceSource, /\{shown\.length\}/);
});
test("necessary financial identifiers, precision and periods remain", () => {
  assert.match(workspaceSource, /AV-014/);
  assert.match(workspaceSource, /Quarter \{r\.quarter\}/);
  assert.match(workspaceSource, /r\.coupon\.toFixed\(2\)/);
  assert.match(workspaceSource, /r\.principal\.toFixed\(2\)/);
  assert.match(workspaceSource, /client\.score/);
  assert.match(
    workspaceSource,
    /aria-current=\{current \? "step" : undefined\}/,
  );
});
test("design guidance prohibits decorative numbering and documents controlled identity motion", () => {
  assert.match(designGuidance, /Do not add numbers for visual decoration/);
  assert.match(
    designGuidance,
    /Keep a number only when it provides specific user value/,
  );
  assert.match(designGuidance, /ResearchOrb identity animation/);
  assert.match(designGuidance, /visible pause control/);
});
