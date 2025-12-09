export function getWeeklyTotals(transactions, type, currency) {
  const today = new Date();
  const day = today.getDay();

  // Find Monday of the current week
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + diff);


  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const weeklyTransactions = transactions.filter((t) => {
    const d = new Date(t.transactionDate);
    return (
      d >= monday &&
      d <= sunday &&
      t.transactionType === type &&
      t.currency === currency
    );
  });

  const totals = Array(7).fill(0);

  weeklyTransactions.forEach((t) => {
    const d = new Date(t.transactionDate);

    let index = d.getDay();
    if (index === 0) index = 6;
    else index = index - 1;

    totals[index] += t.transactionAmount;
  });

  const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return names.map((dayName, i) => {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);

    return {
      dayName,
      amount: totals[i],
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
    };
  });
}
