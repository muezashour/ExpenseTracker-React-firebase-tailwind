import { UserContext } from "../context/AuthContext";

export const downloadCSV = (rows, fileName) => {
  const csvContent = rows.map((r) => r.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAnalysisCSV = (
  type,
  transactions,
  selectedMonth,
  selectedYear,
  currency
) => {
  if (type === "Annual") {
    return exportAnnual(transactions, currency);
  }

  if (type === "Monthly") {
    return exportMonthly(transactions, selectedMonth, selectedYear, currency);
  }

  if (type === "Weekly") {
    return exportWeekly(transactions, currency);
  }
};

const exportAnnual = (transactions, currency) => {
  const now = new Date();
  const selectedYear = now.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const rows = [["Month", "Income", "Expense"]];

  months.forEach((m, index) => {
    const list = transactions.filter((t) => {
      const d = new Date(t.transactionDate);
      return (
        d.getMonth() === index &&
        d.getFullYear() === selectedYear &&
        t.currency === currency
      );
    });

    const income = list
      .filter((t) => t.transactionType === "income")
      .reduce((s, x) => s + x.transactionAmount, 0);

    const expense = list
      .filter((t) => t.transactionType === "expense")
      .reduce((s, x) => s + x.transactionAmount, 0);

    rows.push([m, income, expense]);
  });

  downloadCSV(rows, `Annual_${selectedYear}_${currency}.csv`);
};

const exportMonthly = (transactions, selectedMonth, selectedYear, currency) => {
  const days = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const rows = [["Date", "Income", "Expense"]];

  for (let day = 1; day <= days; day++) {
    const list = transactions.filter((t) => {
      const d = new Date(t.transactionDate);
      return (
        d.getDate() === day &&
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear &&
        t.currency === currency
      );
    });

    const income = list
      .filter((t) => t.transactionType === "income")
      .reduce((s, x) => s + x.transactionAmount, 0);

    const expense = list
      .filter((t) => t.transactionType === "expense")
      .reduce((s, x) => s + x.transactionAmount, 0);

    rows.push([`${selectedYear}-${selectedMonth + 1}-${day}`, income, expense]);
  }

  downloadCSV(rows, `Monthly_${selectedMonth + 1}-${selectedYear}_${currency}.csv`);
};

const exportWeekly = (transactions, currency) => {
  const now = new Date();
  const weekDay = now.getDay() === 0 ? 7 : now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (weekDay - 1));
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const rows = [["Day", "Income", "Expense"]];

  days.forEach((label, index) => {
    const list = transactions.filter((t) => {
      const d = new Date(t.transactionDate);
      return (
        d >= weekStart &&
        d <= weekEnd &&
        d.getDay() === ((index + 1) % 7) &&
        t.currency === currency
      );
    });

    const income = list
      .filter((t) => t.transactionType === "income")
      .reduce((s, x) => s + x.transactionAmount, 0);

    const expense = list
      .filter((t) => t.transactionType === "expense")
      .reduce((s, x) => s + x.transactionAmount, 0);

    rows.push([label, income, expense]);
  });

  const totalIncome = rows.slice(1).reduce((sum, r) => sum + r[1], 0);
  const totalExpense = rows.slice(1).reduce((sum, r) => sum + r[2], 0);

  rows.push(["Total", totalIncome, totalExpense]);

  downloadCSV(rows, `Weekly_${new Date().toISOString().slice(0, 10)}_${currency}.csv`);
};
