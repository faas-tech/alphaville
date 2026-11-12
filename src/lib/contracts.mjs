/** Local demonstration rules. These are not valuation or pricing functions. */
export function validateTerms(terms) {
  const errors = [];
  const protectedParticipation = terms.family === "Protected participation";
  const requiredFields = protectedParticipation
    ? ["reoffer"]
    : ["barrier", "coupon", "reoffer"];
  for (const key of requiredFields)
    if (String(terms[key]).trim() === "")
      errors.push(`${key} is required; blank is not zero.`);
  if (!terms.basket.length)
    errors.push("Choose at least one confirmed fictional listing.");
  if (![12, 18, 24, 36].includes(Number(terms.tenor)))
    errors.push("Choose a supported illustrative tenor.");
  if (
    !protectedParticipation &&
    (!Number.isFinite(Number(terms.barrier)) ||
      Number(terms.barrier) < 40 ||
      Number(terms.barrier) > 95)
  )
    errors.push("Barrier must be between 40% and 95%.");
  if (
    !protectedParticipation &&
    (!Number.isFinite(Number(terms.coupon)) ||
      Number(terms.coupon) < 0 ||
      Number(terms.coupon) > 20)
  )
    errors.push("Annual coupon must be between 0% and 20%.");
  if (
    !Number.isFinite(Number(terms.reoffer)) ||
    Number(terms.reoffer) < 80 ||
    Number(terms.reoffer) > 100
  )
    errors.push("Reoffer must be between 80% and 100% of nominal.");
  if (protectedParticipation && terms.basket.length !== 1)
    errors.push(
      "Protected participation requires exactly one fictional listing.",
    );
  return errors;
}
export function bindTerms(terms) {
  return JSON.stringify(terms);
}
export function isReviewCurrent(terms, review) {
  return review !== null && bindTerms(terms) === review;
}
/** Serialize only the economic fields relevant to the selected example. */
export function createDraftExport(terms, review, savedReview) {
  const current = isReviewCurrent(terms, review);
  const exportTerms =
    terms.family === "Protected participation"
      ? {
          ...terms,
          coupon: null,
          barrier: null,
          nominalProtection: 100,
          direction: "CALL",
          cap: "Uncapped",
          solve: "Reoffer",
        }
      : { ...terms };
  return {
    notice: "Synthetic design example. Not a quote or recommendation.",
    status:
      current && savedReview
        ? "Locally reviewed example"
        : current
          ? "Terms captured; acknowledgement pending"
          : "Unreviewed draft",
    terms: exportTerms,
  };
}
/** @param {number | null} autocallQuarter */
export function scenarioCashflows(
  annualCoupon,
  barrier,
  finalLevel,
  quarters = 8,
  autocallQuarter = null,
) {
  // Once autocall is assumed, the disabled maturity input has no meaning.
  const relevantLevel = autocallQuarter === null ? finalLevel : 100;
  if (
    [annualCoupon, barrier, relevantLevel].some((v) => String(v).trim() === "")
  )
    return null;
  const coupon = Number(annualCoupon),
    threshold = Number(barrier),
    level = Number(relevantLevel);
  if (
    ![coupon, threshold, level].every(Number.isFinite) ||
    coupon < 0 ||
    coupon > 20 ||
    threshold < 40 ||
    threshold > 95 ||
    level < 0 ||
    level > 160
  )
    return null;
  const end = autocallQuarter ?? quarters;
  return Array.from({ length: end }, (_, i) => {
    const final = i === end - 1;
    const principal = final
      ? autocallQuarter !== null || level >= threshold
        ? 100
        : level
      : 0;
    return {
      quarter: i + 1,
      coupon: coupon / 4,
      principal,
      total: coupon / 4 + principal,
    };
  });
}
