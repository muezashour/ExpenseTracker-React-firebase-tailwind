const CATEGORY_COLORS = {
  food: "#22c55e",
  snacks: "#4ade80",
  groceries: "#16a34a",

  rent: "#0f172a",
  bills: "#ef4444",
  transport: "#3b82f6",
  health: "#14b8a6",

  sports: "#0ea5e9",
  entertainment: "#ec4899",
  shopping: "#f59e0b",
  education: "#8b5cf6",

  tobacco: "#64748b",

  gifts: "#fb7185",
  missing: "#94a3b8",
  others: "#94a3b8",

  salary: "#22c55e",
  freelance: "#4ade80",
  business: "#16a34a",
  investments: "#0ea5e9",
  bonus: "#84cc16",
  refunds: "#38bdf8",
};

export function GetCategoryTotals(transactions, type, currency) {
  const categoryTotals = {};

  transactions.forEach((t) => {
    const date = new Date(t.transactionDate);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    if (
      t.transactionType === type &&
      t.currency === currency &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      const category = t.transactionCategory;

      categoryTotals[category] =
        (categoryTotals[category] || 0) + Number(t.transactionAmount);
    }
  });

  return Object.entries(categoryTotals).map(([category, total]) => ({
    name: category,
    value: total,
  }));
}

export function getMonthlyTotal(transactions, type, currency) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions.reduce((sum, t) => {
    const date = new Date(t.transactionDate);

    const isSameMonth =
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear;

    if (
      t.transactionType === type &&
      t.currency === currency &&
      isSameMonth
    ) {
      return sum + Number(t.transactionAmount);
    }
    return sum;
  }, 0);
}

export function getCategoryAnalytics(transactions, type, currency) {
  const categories = GetCategoryTotals(transactions, type, currency);
  const total = getMonthlyTotal(transactions, type, currency);

  return categories.map((item) => {
    const percent =
      total > 0 ? Math.round((item.value / total) * 100) : 0;

    return {
      ...item,
      percent,
      color:
        CATEGORY_COLORS[item.name?.trim().toLowerCase()] ||
        CATEGORY_COLORS.others,
    };
  });
}

export function getCategoryTransactions(
  transactions,
  {
    category,
    type,
    currency,
    month,
    year,
  }
) {
  return transactions.filter((t) => {
    const date = new Date(t.transactionDate);

    return (
      t.transactionCategory === category &&
      t.transactionType === type &&
      t.currency === currency &&
      date.getMonth() === month &&
      date.getFullYear() === year
    );
  });
}
