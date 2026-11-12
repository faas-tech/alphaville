import { test } from "node:test";
import assert from "node:assert/strict";
import { nextSearchIndex } from "../src/lib/search.mjs";
test("command menu wraps in both directions", () => {
  assert.equal(nextSearchIndex(0, 3, 1), 1);
  assert.equal(nextSearchIndex(2, 3, 1), 0);
  assert.equal(nextSearchIndex(0, 3, -1), 2);
});
test("command menu handles empty and changed results", () => {
  assert.equal(nextSearchIndex(0, 0, 1), -1);
  assert.equal(nextSearchIndex(8, 2, 1), 0);
  assert.equal(nextSearchIndex(-1, 2, -1), 1);
  assert.equal(nextSearchIndex(0, 1, 1), 0);
});
