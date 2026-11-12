import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = readFileSync(
  new URL("../src/components/Workspace.tsx", import.meta.url),
  "utf8",
);
test("idea cards cannot show fake price lines or strip fictional identifiers", () => {
  assert.doesNotMatch(source, /MiniChart|<polyline/);
  assert.doesNotMatch(source, /replace\("MOCK-",\s*""\)/);
  assert.match(source, /<IdeaMotif/);
});
test("review invalidation and completion remain in the draft panel", () => {
  const panelStart = source.indexOf('<aside className="term-sheet">');
  const warning = source.indexOf("ref={invalidationRef}", panelStart);
  const reviewAction = source.indexOf("Review exact terms", panelStart);
  assert.ok(panelStart >= 0 && warning > panelStart && warning < reviewAction);
  assert.match(source, /acknowledgementRef\.current\?\.focus\(\)/);
  assert.match(source, /savedReceiptRef\.current\?\.focus\(\)/);
  assert.match(source, /className="saved-review-receipt"/);
});
test("selection controls and hidden rail labels have accessible states", () => {
  assert.match(source, /aria-label=\{n\.label\}/);
  assert.match(source, /aria-label="Design system"/);
  for (const expression of ["filter === f", "tab === t", "terms.solve === v"]) {
    assert.ok(source.includes(`aria-pressed={${expression}}`));
  }
});
test("evidence rows and counts use the shared idea evidence data", () => {
  assert.match(source, /idea\.evidence\.map/);
  assert.match(source, /evidenceCoverage\(idea\.evidence\)/);
  assert.doesNotMatch(source, /\{idea\.coverage\}|\{i\.coverage\}/);
  assert.match(source, /comparisonReference\.notice/);
});
