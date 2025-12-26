import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useCurrency } from "../context/CurrencyContext";
import ReactCountryFlag from "react-country-flag";
import { FaChevronUp } from "react-icons/fa";
import { useGetTransactions } from "../hooks/useGetTransactions";
import AnnualLineChart from "../components/charts/AnnualLineChart";
import MonthLineChart from "../components/charts/MonthlyineChart";
import WeeklyChart from "../components/charts/WeeklyChart";
import { FaDollarSign } from "react-icons/fa";
import CountUp from "react-countup";
import { FaEuroSign } from "react-icons/fa";
import { FaTurkishLiraSign } from "react-icons/fa6";
import { UserContext } from "../context/AuthContext";
import {
  getCategoryAnalytics,
  getCategoryTransactions,
} from "../utils/getCategoryTotals";
import CategoryTransactionsModal from "../components/CategoryTransactionsModal";
import { useClickOutside } from "../hooks/useClickOutside";
import { exportAnalysisPDF } from "../utils/exportPDF";
import PieChart from "../components/charts/pieChart";

const Analysis = () => {
  const ref = useRef(null);
  const reftype = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const currencyRef = useRef(null);
  const { transactionTotals, transactions } = useGetTransactions();
  const { user, loading } = UserContext();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const { balance } = transactionTotals;
  const [view, setView] = useState("expense");
  const [type, setType] = useState(false);
  const navigate = useNavigate();
  const { currency, setCurrency } = useCurrency();
  const [showCurrency, setShowCurrency] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [chartType, setChartType] = useState("WeeklyChart");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);

  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    text: "",
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Close modal if no selected category (prevents stale modal state)
  if (isCategoryModalOpen && !selectedCategory) {
    setIsCategoryModalOpen(false);
  }

  const getCat = getCategoryAnalytics(transactions, view, currency).sort(
    (a, b) => b.value - a.value
  );

  const categoryTransactions = selectedCategory
    ? getCategoryTransactions(transactions, {
        category: selectedCategory,
        type: view,
        currency,
        month: selectedMonth,
        year: selectedYear,
      })
    : [];

  const renderCurrencyIcon = (className = "", size = 38) => {
    if (currency === "USD")
      return <FaDollarSign className={className} size={size} />;
    if (currency === "TL")
      return <FaTurkishLiraSign className={className} size={size} />;
    if (currency === "EURO")
      return <FaEuroSign className={className} size={size} />;
    return null;
  };

  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.transactionDate);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear &&
      t.currency === currency
    );
  });

  let monthlyIncome = 0;
  let monthlyExpense = 0;

  monthlyTransactions.forEach((t) => {
    if (t.transactionType === "income") {
      monthlyIncome += t.transactionAmount;
    } else if (t.transactionType === "expense") {
      monthlyExpense += t.transactionAmount;
    }
  });
  const monthlySavings = monthlyIncome - monthlyExpense;
  const incomePercent = 100;
  const expensePercent =
    monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0;

  const savingsPercent =
    monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

  const roundedExpensePercent = Math.round(expensePercent);
  const roundedSavingsPercent = Math.round(savingsPercent);
  useClickOutside(ref, () => setShowCharts(false));
  useClickOutside(monthRef, () => setShowMonthSelector(false));
  useClickOutside(yearRef, () => setShowYearSelector(false));
  useClickOutside(currencyRef, () => setShowCurrency(false));
  useClickOutside(reftype, () => setType(false));

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <h1 className="text-3xl font-bold font-serif animate-pulse">
          {/* <FaSpinner className="text-6xl text-gray-400 animate-spin " /> */}
          <img
            src="/icons/last192.png"
            alt="app icon"
            className="w-40 h-40 animate-[pulse_1s_ease-in-out_infinite] "
          />
        </h1>
      </div>
    );
  }
  return (
    <div className="p-3 sm:p-4 md:p-8 lg:p-8 flex flex-col min-h-screen bg-[rgba(242,242,242,0.604)]">
      {/* Header */}

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate("/ExpenseTracker")}
            className="bg-white  p-2 rounded-2xl"
          >
            <IoArrowBack size={28} className="cursor-pointer " />
          </div>
          <h1 className="font-semibold text-sm sm:text-xl md:text-xl lg:text-2xl font-serif text-gray-600">
            Analysis Page
          </h1>
        </div>
        <div>
          <div className="flex gap-2">
            <div
              ref={currencyRef}
              onClick={() => setShowCurrency(!showCurrency)}
              className=" hover:shadow-md transition-shadow duration-75 flex items-center gap-2 justify-between rounded-full  px-5 py-2 cursor-pointer relative bg-white"
            >
              <span>
                {currency === "USD" && (
                  <ReactCountryFlag
                    countryCode="US"
                    svg
                    style={{
                      width: "1.3em",
                      height: "1.3em",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  />
                )}
                {currency === "TL" && (
                  <ReactCountryFlag
                    countryCode="TR"
                    svg
                    style={{
                      width: "1.3em",
                      height: "1.3em",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  />
                )}
                {currency === "EURO" && (
                  <ReactCountryFlag
                    countryCode="EU"
                    svg
                    style={{
                      width: "1.3em",
                      height: "1.3em",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  />
                )}
              </span>

              <FaChevronUp
                size={14}
                color="gray"
                className={`transition-transform ${
                  showCurrency ? "rotate-180" : "rotate-0"
                }`}
              />

              <div
                className={`absolute z-10 mt-2 w-30  bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden top-12 -left-7 transition-all duration-200 origin-top transform ${
                  showCurrency
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
              >
                <div
                  onClick={() => setCurrency("USD")}
                  id="USD"
                  value="USD"
                  className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50  cursor-pointer transition-colors"
                >
                  <ReactCountryFlag
                    countryCode="US"
                    svg
                    style={{
                      width: "1.3em",
                      height: "1.3em",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  />
                  <span className="ml-2">USD</span>
                </div>
                <div
                  onClick={() => setCurrency("TL")}
                  id="TL"
                  value="TL"
                  className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors"
                >
                  <ReactCountryFlag
                    countryCode="TR"
                    svg
                    style={{
                      width: "1.3em",
                      height: "1.3em",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  />
                  <span className="ml-2">TL</span>
                </div>
                <div
                  onClick={() => setCurrency("EURO")}
                  id="EURO"
                  value="EURO"
                  className="text-gray-500 font-semibold font-mono flex items-center  px-4 py-2 hover:bg-green-50  cursor-pointer transition-colors"
                >
                  <ReactCountryFlag
                    countryCode="EU"
                    svg
                    style={{
                      width: "1.3em",
                      height: "1.3em",
                      borderRadius: "9999px",
                      overflow: "hidden",
                    }}
                  />
                  <span className="ml-2">EURO</span>
                </div>
              </div>
            </div>
            <div className="w-13 h-13 rounded-full overflow-hidden cursor-pointer bg-gray-300/50 flex items-center justify-center shadow-2xl shadow-amber-400">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="font-semibold text-gray-600">
                  {user?.displayName
                    ? user.displayName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()
                    : user?.email
                    ? user.email[0].toUpperCase()
                    : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Cards */}
      <div data-aos="fade-in" className="flex items-center  ">
        <div className="flex flex-col md:flex-row lg:flex-row  bg-white w-full p- sm:p-6 md:p-8 lg:p-8  gap-4 rounded-3xl mt-6">
          {/* content div */}

          <div className="flex flex-col p-5 text-center md:w-120 lg:w-130  w-full   mr-3  ">
            <h3 className="text-gray-400 font-mono">Total valuation</h3>
            <div className="flex flex-col mb-4 mt-4">
              <h1 className=" text-4xl mt-4 mb-2 text-center">
                <p
                  className={`text-7xl font-bold mt-4 mb-4  ${
                    balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {balance >= 0 ? `` : `-`}
                  {renderCurrencyIcon(
                    `inline-block   ${
                      balance >= 0 ? "text-green-600" : "text-red-600"
                    }`
                  )}

                  <CountUp end={Math.abs(balance)} duration={1} separator="," />
                </p>
              </h1>

              <p className=" text-sm text-gray-400">
                Your Total Balance{" "}
                <span className="bg-gray-200 rounded-full text-sm text-gray-600 p-1">
                  All Time
                </span>
              </p>
            </div>

            <span className="border w-full my-5 border-blue-600/80"></span>

            <div className="flex flex-col ">
              <h1 className="text-center text-gray-400 font-serif mb-3">
                {now.toLocaleString("default", { month: "long" })}
              </h1>
              <div className="flex items-center justify-between">
                <div className=" flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-600"></div>
                  <span className="font-semibold">Incom</span>
                </div>
                <div>
                  <span className="font-semibold">{incomePercent}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className=" flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-600"></div>
                  <span className="font-semibold">Expense</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {roundedExpensePercent}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className=" flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="font-semibold">Savings</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {roundedSavingsPercent}%
                  </span>
                </div>
              </div>
              <div>
                <p className="my-4 font-extralight font-serif text-gray-400">
                  “You spent {roundedExpensePercent}% of what you earned. You
                  saved {roundedSavingsPercent}% of it.”
                </p>
              </div>
            </div>
          </div>
          {/* chart div */}
          <div className="w-full max-w-full ">
            {/* income &expesne toggle && ChartType   */}

            <div className="flex flex-col gap-2 sm:flex-row md:flex-row lg:flex-row  justify-between items-center">
              <div
                ref={reftype}
                onClick={() => setType(!type)}
                className="bg-gray-50 py-2 px-4 rounded-2xl border border-gray-200 relative hover:shadow-md transition-shadow cursor-pointer "
              >
                <div className="flex items-center justify-center gap-2 cursor-pointer">
                  <span className="font-sans font-semibold text-sm capitalize">
                    {view}
                  </span>
                  <FaChevronUp
                    size={14}
                    color="gray"
                    className={`transition-transform ${
                      type ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
                <div className="flex flex-col items-center ">
                  <div
                    className={`absolute z-30 mt-2 w-fit bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden top-10 -left-1 transition-all duration-200 ${
                      type
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div
                      onClick={() => {
                        setView("income");
                        setType(false);
                      }}
                      id="AnnualChart"
                      value="AnnualChart"
                      className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50  cursor-pointer transition-colors"
                    >
                      <span className="ml-2">Income</span>
                    </div>
                    <div
                      onClick={() => {
                        setView("expense");
                        setType(false);
                      }}
                      id="MonthlyChart"
                      value="MonthlyChart"
                      className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors"
                    >
                      <span className="ml-2">Expense</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                ref={ref}
                onClick={() => setShowCharts(!showCharts)}
                className="bg-gray-50 py-2 px-4 rounded-2xl border border-gray-200 relative hover:shadow-md transition-shadow cursor-pointer "
              >
                <div className="flex items-center justify-center gap-2 cursor-pointer">
                  <span className="font-sans font-semibold text-sm">
                    {chartType}
                  </span>
                  <FaChevronUp
                    size={14}
                    color="gray"
                    className={`transition-transform ${
                      showCharts ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
                <div className="flex flex-col items-center ">
                  <div
                    className={`absolute z-30 mt-2 w-fit  bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden top-10 -left-1 transition-all duration-200 ${
                      showCharts
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div
                      onClick={() => {
                        setChartType("AnnualChart");
                        setShowCharts(false);
                      }}
                      id="AnnualChart"
                      value="AnnualChart"
                      className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50  cursor-pointer transition-colors"
                    >
                      <span className="ml-2">AnnualChart</span>
                    </div>
                    <div
                      onClick={() => {
                        setChartType("MonthlyChart");
                        setShowCharts(false);
                      }}
                      id="MonthlyChart"
                      value="MonthlyChart"
                      className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors"
                    >
                      <span className="ml-2">MonthlyChart</span>
                    </div>
                    <div
                      onClick={() => {
                        setChartType("WeeklyChart");
                        setShowCharts(false);
                      }}
                      id="WeeklyChart"
                      value="WeeklyChart"
                      className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors"
                    >
                      <span className="ml-2">WeeklyChart</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="
    mx-2 text-sm bg-gray-800 cursor-pointer
    hover:bg-gray-700
    text-white px-4 py-1 rounded-xl border
    shadow-xl
    hover:shadow-2xlz
    transition-all duration-200

  "
                  onClick={() =>
                    exportAnalysisPDF(
                      chartType === "AnnualChart"
                        ? "Annual"
                        : chartType === "MonthlyChart"
                        ? "Monthly"
                        : "Weekly",
                      transactions,
                      selectedMonth,
                      selectedYear,
                      currency,
                      user?.displayName || user?.email || "User"
                    )
                  }
                >
                  Export PDF
                </button>
              </div>
            </div>

            {/* Chart container */}
            <div className="mt-1 flex-col ">
              <div
                className={`flex justify-center gap-3  relative my-3 transition-all duration-200 z-20 ${
                  chartType === "MonthlyChart"
                    ? "scale-105 opacity-100"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
              >
                {/* Month Selector */}
                <div className="flex items-center gap-4 my-2  z-20">
                  <div
                    ref={monthRef}
                    onClick={() => setShowMonthSelector(!showMonthSelector)}
                    className="bg-gray-50 py-2 flex items-center justify-center gap-2 px-4 rounded-2xl border border-gray-200 relative hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <span className="font-sans font-semibold text-sm">
                      {new Date(0, selectedMonth).toLocaleString("default", {
                        month: "long",
                      })}
                    </span>
                    <FaChevronUp
                      size={14}
                      color="gray"
                      className={`transition-transform ${
                        showMonthSelector ? "rotate-180" : "rotate-0"
                      }`}
                    />

                    <div
                      className={`absolute z-10 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-y-auto max-h-50 top-10 -left-1 transition-all duration-200 ${
                        showMonthSelector
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-0 pointer-events-none"
                      }`}
                    >
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          value={i}
                          onClick={() => {
                            setSelectedMonth(i);
                            setShowMonthSelector(false);
                          }}
                          className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors"
                        >
                          <span className="ml-2">
                            {new Date(0, i).toLocaleString("default", {
                              month: "long",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Year Selector */}
                  <div
                    ref={yearRef}
                    onClick={() => setShowYearSelector(!showYearSelector)}
                    className="bg-gray-50 py-2 flex items-center justify-center gap-2 px-4 rounded-2xl border border-gray-200 relative hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <span className="font-sans font-semibold text-sm">
                      {selectedYear}
                    </span>
                    <FaChevronUp
                      size={14}
                      color="gray"
                      className={`transition-transform ${
                        showYearSelector ? "rotate-180" : "rotate-0"
                      }`}
                    />

                    <div
                      className={`absolute z-30 mt-2 w-30 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden top-10 -left-1 transition-all duration-200 ${
                        showYearSelector
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-0 pointer-events-none"
                      }`}
                    >
                      {[
                        currentYear - 2,
                        currentYear - 1,
                        currentYear,
                        currentYear + 1,
                      ].map((y) => (
                        <div
                          key={y}
                          value={y}
                          onClick={() => {
                            setSelectedYear(y);
                            setShowYearSelector(false);
                          }}
                          className="text-gray-500 font-semibold font-mono flex items-center px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors"
                        >
                          <span className="ml-2">{y}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-0 lg:p-0 w-full min-h-[360px] z-10 ">
                <div
                  className={`transition-all duration-200 transform ${
                    chartType === "AnnualChart"
                      ? "scale-105 opacity-100"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  {chartType === "AnnualChart" && (
                    <AnnualLineChart
                      transactions={transactions}
                      type={view}
                      currency={currency}
                    />
                  )}
                </div>

                <div
                  className={`transition-all duration-200 transform ${
                    chartType === "MonthlyChart"
                      ? "scale-105 opacity-100"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  {chartType === "MonthlyChart" && (
                    <MonthLineChart
                      transactions={transactions}
                      type={view}
                      currency={currency}
                      month={selectedMonth}
                      year={selectedYear}
                    />
                  )}
                </div>

                <div
                  className={`transition-all duration-200 transform ${
                    chartType === "WeeklyChart"
                      ? "scale-105 opacity-100"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  {chartType === "WeeklyChart" && (
                    <WeeklyChart
                      transactions={transactions}
                      type={view}
                      currency={currency}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-col md:flex-row lg:flex-row   ">
        <div
          data-aos="fade-right"
          className="flex items-center justify-center bg-white p-2 rounded-2xl my-2 w-full"
        >
          <div className="p-2 md:p-0 lg:p-0 w-full min-h-[340px] z-10 ">
            <PieChart transactions={transactions} view={view} />
          </div>
        </div>
        <div
          data-aos="fade-left"
          className="bg-white rounded-2xl my-2 w-full max-h-[360px] flex flex-col"
        >
          <div className="p-4 shrink-0">
             <h2 className="text-lg font-semibold text-gray-700 mb-4 capitalize">
            {view} by Category
          </h2>
          <div className="relative  ">
            <div className=" w-full h-3 bg-gray-200 rounded-full overflow-hidden flex mb-6 ">
              {getCat.map((item, index) => (
                <div
                  key={index}
                  className="h-full min-w-1.5"
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: item.color,
                  }}
                />
              ))}
            </div>
            {/* interaction layer */}
            <div className="absolute inset-0 flex">
              {getCat.map((item, index) => (
                <div
                  key={`hover-${index}`}
                  className="h-full min-w-1.5 "
                  style={{ width: `${item.percent}%` }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      show: true,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      text: `${item.name} · ${item.percent}%`,
                    });
                  }}
                  onMouseLeave={() =>
                    setTooltip((prev) => ({ ...prev, show: false }))
                  }
                />
              ))}
            </div>
          </div>
          </div>

          {/* Progress bar */}

          {/* Category rows */}
          <div className="space-y-5 overflow-auto p-4">
            {getCat.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedCategory(item.name);
                  setIsCategoryModalOpen(true);
                }}
                className=" flex cursor-pointer hover:bg-gray-100 p-2 rounded-xl transition-all  duration-300 ease-in-out animate-fadeUp
                           items-center justify-between "
              >
                <div className="flex items-center gap-4">
                  <svg
                    className="w-12 h-12 -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="4"
                      strokeDasharray={`${item.percent} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-700 capitalize">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {item.percent}%  monthly
                    </p>
                  </div>
                </div>
                <span className="font-semibold te text-gray-800">
                  {renderCurrencyIcon("inline-block mr-1 text-gray-600 ", 16)}
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    {tooltip.show && (
      <div
        className="fixed z-9999
                   bg-gray-900 text-white text-xs px-2 py-1
                   rounded-md shadow-lg pointer-events-none capitalize"
        style={{
          left: tooltip.x,
          top: tooltip.y - 10,
          transform: "translateX(-50%) translateY(-100%)",
        }}
      >
        {tooltip.text}
      </div>
    )}
   <CategoryTransactionsModal
  isOpen={isCategoryModalOpen}
  onClose={() => setIsCategoryModalOpen(false)}
  title={
    selectedCategory
      ? `${selectedCategory} / ${new Date(
          selectedYear,
          selectedMonth
        ).toLocaleString("en", { month: "short" })}`
      : ""
  }
  transactions={categoryTransactions}
        currencyIcon={renderCurrencyIcon}
        type={view}
/>
    </div>
  );
};

export default Analysis;
