/** The TaskJar money plan: five buckets that add up to 100% of take-home pay. */
export const ALLOCATION = [
  {
    key: "needs",
    share: 0.55,
    label: "Needs",
    hint: "Your ceiling for rent or mortgage, groceries, car, gas, insurance, phone, utilities, and credit card payments.",
    color: "#9aa49d",
  },
  {
    key: "fun",
    share: 0.05,
    label: "Fun",
    hint: "Eating out, clothes, going out. Spend it without guilt.",
    color: "#f5c518",
  },
  {
    key: "invest",
    share: 0.1,
    label: "Invest every month",
    hint: "Moves into investments the day you get paid, before you can spend it.",
    color: "#2f6b3a",
  },
  {
    key: "goals",
    share: 0.15,
    label: "Savings and goals",
    hint: "Emergency fund first (3 months of needs), then the trip, the car, the deposit.",
    color: "#7fc78c",
  },
  {
    key: "longterm",
    share: 0.15,
    label: "Long-term investing",
    hint: "Retirement accounts and money you won’t touch for 10 or more years.",
    color: "#1a3d22",
  },
] as const;
