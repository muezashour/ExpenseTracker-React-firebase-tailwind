export function getMonthTotals(transactions, year, month, type, currency) {

  const days = Array(31).fill(0);

  transactions.forEach((t) => {
    const d = new Date(t.transactionDate);

    if (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      t.transactionType === type &&
      t.currency === currency
    ) {
      const dayIndex = d.getDate() - 1;
      days[dayIndex] += t.transactionAmount;
    }
  });

  return days.map((amount, i) => ({
    day: i + 1,
    amount,
  }));
}
