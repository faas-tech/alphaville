/** Display helpers only. These functions do not price or score anything. */

/** @param {Array<{ available: boolean }>} evidence */
export function evidenceCoverage(evidence) {
  const available = evidence.filter((source) => source.available).length;
  return `${available} of ${evidence.length} sources`;
}

/**
 * @param {{ family: string, solve: string, coupon: number | string | null, reoffer: number | string | null }} terms
 * @param {"coupon" | "reoffer"} field
 */
export function termValueLabel(terms, field) {
  const protectedParticipation = terms.family === "Protected participation";
  if (protectedParticipation && field === "coupon") return "Not applicable";
  const value = terms[field];
  if (value === null || value === undefined || String(value).trim() === "") {
    return "Not entered";
  }
  if (!Number.isFinite(Number(value))) return "Invalid value";
  const unit = field === "coupon" ? "% p.a." : "% of nominal";
  const solveTarget = protectedParticipation ? "Reoffer" : terms.solve;
  const wouldCalculate =
    (field === "coupon" && solveTarget === "Annual coupon") ||
    (field === "reoffer" && solveTarget === "Reoffer");
  return `${String(value).trim()}${unit}${wouldCalculate ? " · indicative, would be calculated" : ""}`;
}
