import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const addPdfHeader = async (doc, userName) => {
  const img = new Image();
  img.src = "/icons/last192.png";

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  doc.addImage(img, "PNG", 15, 10, 12, 12);
  doc.setFontSize(18);
  doc.text("Walletly", 32, 19);

  doc.setFontSize(11);
  doc.text(`User: ${userName}`, 15, 30);
  doc.setFontSize(10);
};

export const exportAnalysisPDF = async (
  type,
  transactions,
  selectedMonth,
  selectedYear,
  currency,
  userName
) => {
  const doc = new jsPDF();
  await addPdfHeader(doc, userName);

  let dateLabel = "";

  if (type === "Annual") {
    dateLabel = `Year: ${new Date().getFullYear()}`;
  }

  if (type === "Monthly") {
    const monthName = new Date(
      selectedYear,
      selectedMonth
    ).toLocaleString("default", { month: "long" });
    dateLabel = `${monthName} ${selectedYear}`;
  }

  if (dateLabel) {
    doc.text(dateLabel, 15, 36);
  }

  let result;

  if (type === "Annual") {
    result = buildAnnualRows(transactions, currency);
    const totals = result.rows.slice(1).reduce(
      (acc, r) => {
        acc.income += r[1];
        acc.expense += r[2];
        return acc;
      },
      { income: 0, expense: 0 }
    );
    result.totals = totals;
  }

  if (type === "Monthly") {
    result = buildMonthlyRows(
      transactions,
      selectedMonth,
      selectedYear,
      currency
    );
    const totals = result.rows.slice(1).reduce(
      (acc, r) => {
        acc.income += r[1];
        acc.expense += r[2];
        return acc;
      },
      { income: 0, expense: 0 }
    );
    result.totals = totals;
  }

  if (type === "Weekly") {
    const weeklyResult = exportWeekly(transactions, currency);
    result = weeklyResult;

    const now = new Date();
    const weekDay = now.getDay() === 0 ? 7 : now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (weekDay - 1));
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const startLabel = weekStart.toISOString().slice(0, 10);
    const endLabel = weekEnd.toISOString().slice(0, 10);

    doc.text(`Week: ${startLabel} → ${endLabel}`, 15, 36);

    result.totals = {
      income: weeklyResult.totalIncome,
      expense: weeklyResult.totalExpense,
    };
  }

  autoTable(doc, {
    startY: 42,
    head: [result.rows[0]],
    body: result.rows.slice(1),
    didDrawPage: (data) => {
      if (result.totals) {
        const finalY = data.cursor.y + 8;
        doc.setFontSize(11);
        doc.text(
          `Total Income: ${result.totals.income} ${currency}`,
          15,
          finalY
        );
        doc.text(
          `Total Expense: ${result.totals.expense} ${currency}`,
          15,
          finalY + 6
        );
        doc.text(
          `Net: ${result.totals.income - result.totals.expense} ${currency}`,
          15,
          finalY + 12
        );
      }
    },
  });

  doc.save(`${type}_${currency}.pdf`);
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

  return {
    rows,
    totalIncome,
    totalExpense,
  };
};

export const getWeeklyTotal = (transactions, currency) => {
  const result = exportWeekly(transactions, currency);
  return {
    totalIncome: result.totalIncome,
    totalExpense: result.totalExpense,
  };
}

const buildAnnualRows = (transactions, currency) => {
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

  return { rows };
};

const buildMonthlyRows = (
  transactions,
  selectedMonth,
  selectedYear,
  currency
) => {
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

    rows.push(
      [`${selectedYear}-${selectedMonth + 1}-${day}`, income, expense]
    );
  }

  return { rows };
};
