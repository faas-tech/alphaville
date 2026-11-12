export type Stage = "Research" | "Draft" | "Review" | "Evidence";
export type Evidence = {
  id: string;
  label: string;
  available: boolean;
};
export type Idea = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  stage: Stage;
  basket: string[];
  currency: string;
  tenor: number;
  barrier: number;
  coupon: number;
  thesis: string;
  risk: string;
  date: string;
  evidence: Evidence[];
  color: string;
};
export const ideas: Idea[] = [
  {
    id: "AV-014",
    title: "Defensive income",
    subtitle: "Defensive equities · European basket",
    category: "Income",
    stage: "Review",
    basket: ["MOCK-ASTR", "MOCK-JNPR", "MOCK-SOLS"],
    currency: "USD",
    tenor: 24,
    barrier: 60,
    coupon: 8.4,
    thesis:
      "This example combines three fictional stocks to explore income over 24 months. Compare the coupon with the possible loss of principal before choosing terms.",
    risk: "Repayment depends on the weakest stock in the basket. If it falls below the maturity barrier, you may lose principal. The issuer must also be able to pay.",
    date: "12 Nov",
    evidence: [
      { id: "research-note", label: "Example research note", available: true },
      {
        id: "structure-rationale",
        label: "Example structure rationale",
        available: true,
      },
      {
        id: "purchase-records",
        label: "Example purchase records",
        available: true,
      },
      {
        id: "market-source",
        label: "Fictional market-source example",
        available: false,
      },
    ],
    color: "violet",
  },
  {
    id: "AV-013",
    title: "The next infrastructure cycle",
    subtitle: "Automation · Capital investment",
    category: "Growth",
    stage: "Research",
    basket: ["MOCK-ASTR", "MOCK-JNPR"],
    currency: "EUR",
    tenor: 18,
    barrier: 65,
    coupon: 7.6,
    thesis:
      "Could investment in automation increase demand for infrastructure? Check customer orders and spending plans before choosing a structure.",
    risk: "Customers may cut spending before new capacity is ready. Independent order data is missing from this example.",
    date: "12 Nov",
    evidence: [
      { id: "research-note", label: "Example research note", available: true },
      {
        id: "structure-rationale",
        label: "Example structure rationale",
        available: true,
      },
      {
        id: "purchase-records",
        label: "Example purchase records",
        available: false,
      },
      {
        id: "market-source",
        label: "Fictional market-source example",
        available: false,
      },
    ],
    color: "sand",
  },
  {
    id: "AV-012",
    title: "A measured energy transition",
    subtitle: "Energy · Range-bound view",
    category: "Income",
    stage: "Draft",
    basket: ["MOCK-SOLS", "MOCK-JNPR"],
    currency: "USD",
    tenor: 12,
    barrier: 70,
    coupon: 6.8,
    thesis:
      "This idea assumes energy stocks stay within a limited price range. Check what happens if prices fall outside that range before choosing the term and barrier.",
    risk: "Large commodity-price moves or policy changes could push stocks outside the assumed range.",
    date: "11 Nov",
    evidence: [
      { id: "research-note", label: "Example research note", available: true },
      {
        id: "structure-rationale",
        label: "Example structure rationale",
        available: true,
      },
      {
        id: "purchase-records",
        label: "Example purchase records",
        available: true,
      },
      {
        id: "market-source",
        label: "Fictional market-source example",
        available: false,
      },
    ],
    color: "sage",
  },
  {
    id: "AV-011",
    title: "Resilience in a changing cycle",
    subtitle: "Quality · Historical comparables",
    category: "Defensive",
    stage: "Evidence",
    basket: ["MOCK-JNPR"],
    currency: "GBP",
    tenor: 24,
    barrier: 60,
    coupon: 7.2,
    thesis:
      "Compare past purchases with similar income terms. Check product family, term, currency and underlying stocks.",
    risk: "Similar past purchases do not establish what clients own now, what they want to buy or whether this idea suits them.",
    date: "11 Nov",
    evidence: [
      { id: "research-note", label: "Example research note", available: true },
      {
        id: "structure-rationale",
        label: "Example structure rationale",
        available: true,
      },
      {
        id: "purchase-records",
        label: "Example purchase records",
        available: true,
      },
      {
        id: "market-source",
        label: "Fictional market-source example",
        available: true,
      },
    ],
    color: "rose",
  },
  {
    id: "AV-010",
    title: "Protected participation",
    subtitle: "Single stock · Upside participation",
    category: "Defensive",
    stage: "Draft",
    basket: ["MOCK-ASTR"],
    currency: "EUR",
    tenor: 36,
    barrier: 100,
    coupon: 0,
    thesis:
      "This example follows gains in one stock and protects nominal at maturity. Nominal is the reference amount used to calculate payments. Protection does not cover any premium paid above it.",
    risk: "Protection depends on the issuer being able to pay and the contract’s conditions being met at maturity.",
    date: "10 Nov",
    evidence: [
      { id: "research-note", label: "Example research note", available: true },
      {
        id: "structure-rationale",
        label: "Example structure rationale",
        available: false,
      },
      {
        id: "purchase-records",
        label: "Example purchase records",
        available: false,
      },
      {
        id: "market-source",
        label: "Fictional market-source example",
        available: false,
      },
    ],
    color: "sand",
  },
  {
    id: "AV-009",
    title: "Looking beyond the leaders",
    subtitle: "Broadening · Research question",
    category: "Growth",
    stage: "Research",
    basket: ["MOCK-SOLS"],
    currency: "USD",
    tenor: 18,
    barrier: 65,
    coupon: 7.0,
    thesis:
      "Could a recovery extend beyond the largest businesses? Compare revenue growth and demand across smaller companies.",
    risk: "The example has no verified evidence that growth is spreading to more companies.",
    date: "10 Nov",
    evidence: [
      { id: "research-note", label: "Example research note", available: true },
      {
        id: "structure-rationale",
        label: "Example structure rationale",
        available: false,
      },
      {
        id: "purchase-records",
        label: "Example purchase records",
        available: false,
      },
      {
        id: "market-source",
        label: "Fictional market-source example",
        available: false,
      },
    ],
    color: "violet",
  },
];
export const instruments = [
  {
    id: "MOCK-ASTR",
    name: "Aster Robotics",
    sector: "Industrial automation",
    initial: "A",
  },
  {
    id: "MOCK-JNPR",
    name: "Juniper Systems",
    sector: "Digital infrastructure",
    initial: "J",
  },
  {
    id: "MOCK-SOLS",
    name: "Solstice Energy",
    sector: "Energy transition",
    initial: "S",
  },
];
export const clients = [
  {
    id: "C-101",
    name: "Northstar Paper Club",
    region: "Europe",
    book: "Demo book A",
    count: 12,
    score: 84,
    currency: "USD",
    last: "21 Oct 2026",
    coverage: 4,
    maturity: "21 Oct 2028",
  },
  {
    id: "C-102",
    name: "Cedar Kite Collective",
    region: "Europe",
    book: "Demo book A",
    count: 8,
    score: 72,
    currency: "EUR",
    last: "08 Sep 2026",
    coverage: 3,
    maturity: "08 Mar 2028",
  },
  {
    id: "C-103",
    name: "Orchard Lantern Society",
    region: "Asia Pacific",
    book: "Demo book A",
    count: 5,
    score: 61,
    currency: "USD",
    last: "14 Aug 2026",
    coverage: 3,
    maturity: "14 Aug 2027",
  },
  {
    id: "C-104",
    name: "Silver Birch Circle",
    region: "Europe",
    book: "Demo book B",
    count: 3,
    score: null,
    currency: "GBP",
    last: "Not recorded",
    coverage: 1,
    maturity: "Not available",
  },
  {
    id: "C-105",
    name: "Meadow Atlas Group",
    region: "Asia Pacific",
    book: "Demo book B",
    count: 0,
    score: null,
    currency: "USD",
    last: "No recorded activity",
    coverage: 0,
    maturity: "Not available",
  },
];
export type Client = (typeof clients)[number];

// The reference terms identify the fictional example behind the client screen.
// They do not imply that any score was calculated from these terms.
const comparisonIdea = ideas.find((idea) => idea.id === "AV-014")!;
export const comparisonReference = {
  ideaId: comparisonIdea.id,
  label: comparisonIdea.title,
  family: "Autocallable",
  currency: comparisonIdea.currency,
  tenor: comparisonIdea.tenor,
  barrier: comparisonIdea.barrier,
  basket: [...comparisonIdea.basket],
  notice:
    "Scores are authored examples, not calculated matches. Recorded factors are shown for comparison; missing factors remain missing. Filtering selects records without recalculating scores.",
};
