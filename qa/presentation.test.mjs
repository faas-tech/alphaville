import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { evidenceCoverage, termValueLabel } from "../src/lib/presentation.mjs";

// Exercise the actual fixture data without depending on experimental Node TS flags.
const source = readFileSync(
  new URL("../src/lib/data.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { ideas, instruments, comparisonReference } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

const terms = {
  family: "Autocallable",
  solve: "Annual coupon",
  coupon: 8.4,
  reoffer: 100,
};

test("idea coverage derives from the same evidence rows displayed in detail", () => {
  const expected = [3, 2, 3, 4, 1, 1];
  ideas.forEach((idea, index) => {
    assert.equal(idea.evidence.length, 4);
    assert.equal(
      idea.evidence.filter((item) => item.available).length,
      expected[index],
    );
    assert.equal(
      evidenceCoverage(idea.evidence),
      `${expected[index]} of 4 sources`,
    );
    assert.equal(new Set(idea.evidence.map((item) => item.id)).size, 4);
    assert.equal(
      "coverage" in idea,
      false,
      "no separate coverage string can drift",
    );
  });
});

test("available market-source specimen is explicitly fictional", () => {
  const idea = ideas.find((item) => item.id === "AV-011");
  const marketSource = idea.evidence.find(
    (item) => item.id === "market-source",
  );
  assert.equal(marketSource.available, true);
  assert.match(marketSource.label, /Fictional/);
  assert.equal(
    ideas.find((item) => item.id === "AV-013").evidence[2].available,
    false,
  );
});

test("coverage handles empty and entirely missing evidence", () => {
  assert.equal(evidenceCoverage([]), "0 of 0 sources");
  assert.equal(evidenceCoverage([{ available: false }]), "0 of 1 sources");
});

test("solved-for coupon is distinguished from fixed Reoffer", () => {
  assert.equal(
    termValueLabel(terms, "coupon"),
    "8.4% p.a. · indicative, would be calculated",
  );
  assert.equal(termValueLabel(terms, "reoffer"), "100% of nominal");
});

test("solved-for Reoffer is distinguished from fixed coupon", () => {
  const reofferTerms = { ...terms, solve: "Reoffer", reoffer: 98.5 };
  assert.equal(termValueLabel(reofferTerms, "coupon"), "8.4% p.a.");
  assert.equal(
    termValueLabel(reofferTerms, "reoffer"),
    "98.5% of nominal · indicative, would be calculated",
  );
});

test("protected participation has no coupon and always solves Reoffer", () => {
  const protectedTerms = {
    ...terms,
    family: "Protected participation",
    coupon: null,
  };
  assert.equal(termValueLabel(protectedTerms, "coupon"), "Not applicable");
  assert.equal(
    termValueLabel(protectedTerms, "reoffer"),
    "100% of nominal · indicative, would be calculated",
  );
});

test("blank input stays missing while a genuine zero remains a value", () => {
  for (const blank of ["", "  ", null, undefined]) {
    assert.equal(
      termValueLabel({ ...terms, coupon: blank }, "coupon"),
      "Not entered",
    );
    assert.equal(
      termValueLabel({ ...terms, reoffer: blank }, "reoffer"),
      "Not entered",
    );
  }
  assert.equal(
    termValueLabel({ ...terms, coupon: 0 }, "coupon"),
    "0% p.a. · indicative, would be calculated",
  );
  assert.equal(
    termValueLabel({ ...terms, coupon: "bad" }, "coupon"),
    "Invalid value",
  );
});

test("comparison reference stays bound to the named fictional idea", () => {
  const referenceIdea = ideas.find(
    (item) => item.id === comparisonReference.ideaId,
  );
  assert.equal(comparisonReference.ideaId, "AV-014");
  assert.equal(comparisonReference.family, "Autocallable");
  assert.equal(comparisonReference.currency, referenceIdea.currency);
  assert.equal(comparisonReference.tenor, referenceIdea.tenor);
  assert.equal(comparisonReference.barrier, referenceIdea.barrier);
  assert.deepEqual(comparisonReference.basket, referenceIdea.basket);
  assert.ok(comparisonReference.basket.every((id) => id.startsWith("MOCK-")));
  assert.ok(
    instruments.every((instrument) => instrument.id.startsWith("MOCK-")),
  );
  assert.match(
    comparisonReference.notice,
    /authored examples, not calculated matches/,
  );
});

test("term labels do not claim a live price or quote", () => {
  const fixedCouponTerms = Object.freeze({ ...terms, solve: "Reoffer" });
  const protectedTerms = Object.freeze({
    ...terms,
    family: "Protected participation",
  });
  for (const example of [fixedCouponTerms, protectedTerms]) {
    for (const field of ["coupon", "reoffer"]) {
      assert.doesNotMatch(
        termValueLabel(example, field),
        /quoted|priced|live price|executable/i,
      );
    }
  }
  assert.equal(termValueLabel(fixedCouponTerms, "coupon"), "8.4% p.a.");
  assert.match(
    termValueLabel(protectedTerms, "reoffer"),
    /indicative, would be calculated$/,
  );
});
test("every evidence label identifies fictional example content", () => {
  for (const idea of ideas) {
    for (const item of idea.evidence)
      assert.match(item.label, /example|fictional/i);
  }
});
