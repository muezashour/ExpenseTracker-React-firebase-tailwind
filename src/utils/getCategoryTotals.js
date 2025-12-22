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
