import React from "react";
import { useState,useEffect } from "react";
import { useGetTransactions } from "../hooks/useGetTransactions";
import CountUp from "react-countup";
import { useCurrency } from "../context/CurrencyContext";
import { FaDollarSign } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaEuroSign } from "react-icons/fa";
import { FaTurkishLiraSign } from "react-icons/fa6";
const Cards = () => {
  const { currency } = useCurrency();
  const { transactionTotals,transactions } = useGetTransactions();
  const { balance } =
    transactionTotals;
const [showBalance, setShowBalance] = useState(() => {
  const saved = localStorage.getItem("showBalance");
  return saved === "true";
});

  useEffect(() => {
  localStorage.setItem("showBalance", showBalance);
}, [showBalance]);
  const renderCurrencyIcon = (className = ``) => {
    if (currency === "USD")
      return <FaDollarSign className={className} size={28} />;
    if (currency === "TL")
      return <FaTurkishLiraSign className={className} size={28} />;
    if (currency === "EURO")
      return <FaEuroSign className={className} size={28} />;
    return null;
  };

  // this logic is for getting the income and expense amount for the current month

  const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const date = new Date(t.transactionDate);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        t.currency === currency
      );
    });
  const monthlyIncome = monthlyTransactions
    .filter((t) => t.transactionType === "income")
    .reduce((sum, t) => sum + t.transactionAmount, 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + t.transactionAmount, 0);

  const monthlyIncomeCount = monthlyTransactions.filter(
  (t) => t.transactionType === "income"
).length;

const monthlyExpenseCount = monthlyTransactions.filter(
  (t) => t.transactionType === "expense"
).length;

  return (
    <div className=" flex  items-center p-5 w-full">
      <div className="flex gap-4 w-full overflow-x-auto">
        <div
          data-aos="fade-down"
          className="bg-white rounded-2xl shadow-sm p-6 sm:p-5 md:p-8 flex-2 min-w-[280px] lg:min-w-[340px] sm:max-w-[600px] md:min-w-[220px] lg:max-w-[600px] xl:max-w-[700px]"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-gray-800 text-lg font-semibold">
              Total Balance
            </h2>


            <div className="flex items-center justify-between gap-1">

            {showBalance ? (<AiOutlineEye onClick={() => setShowBalance(false)} className="cursor-pointer text-gray-300 font-bold" fontSize={27} />)

                : <AiOutlineEyeInvisible onClick={() => setShowBalance(true)} className="cursor-pointer text-gray-300" fontSize={27} />}


               <span className="inline-flex items-center">
              {currency === "USD" && (
                <FaDollarSign
                  size={28}
                  className="inline-block text-gray-300 "
                />
              )}
              {currency === "TL" && (
                <FaTurkishLiraSign
                  size={28}
                  className="inline-block text-gray-300"
                />
              )}
              {currency === "EURO" && (
                <FaEuroSign size={28} className="inline-block text-gray-300" />
              )}
            </span>


           </div>

          </div>

          {
          showBalance ? (<p className="text-4xl font-bold mt-4 text-gray-400">********</p>) : ( <p
            className={`text-4xl font-bold mt-4 flex items-center ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {/* {renderCurrencyIcon{`inline-block text-green-600${balance >= 0 ? "text-green-600" : "text-red-600"}`}} */}
            {balance >= 0 ? `` : `-`}
            {renderCurrencyIcon(
              `inline-block  ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`
            )}

            <CountUp end={Math.abs(balance)} duration={1} separator="," />
          </p>)
          }



          <p className="text-gray-500 text-sm mt-2">+ Current balance</p>
        </div>
        {/* Total Income */}
        <div
          data-aos="fade-down"
          className="bg-white rounded-2xl shadow-sm p-6 sm:p-5 md:p-8 flex-2 min-w-[270px] lg:min-w-[340px] sm:max-w-[600px] md:min-w-[220px] lg:max-w-[600px] xl:max-w-[700px]"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-gray-800 text-lg font-semibold">
              Monthly Income
            </h2>
            <span className="text-green-400 text-xl">↑</span>
          </div>
          {showBalance ? (<p className="text-4xl font-bold mt-4 text-gray-400">********</p>) : ( <p className="text-green-600 text-4xl font-bold mt-4 flex items-center">
            {renderCurrencyIcon("inline-block text-green-600")}{" "}
            <CountUp end={monthlyIncome} duration={1} separator="," />
          </p>)}
          <p className="text-gray-500 text-sm mt-2">
            {monthlyIncomeCount} transactions
          </p>
        </div>
        {/* Total Expenses */}
        <div
          data-aos="fade-down"
          className="bg-white rounded-2xl shadow-sm p-6 sm:p-5 md:p-8 flex-2 min-w-[270px] lg:min-w-[320px] sm:max-w-[600px] md:min-w-[220px] lg:max-w-[600px] xl:max-w-[700px]"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-gray-800 text-lg font-semibold">
              Monthly Expenses
            </h2>
            <span className="text-red-400 text-xl">↓</span>
          </div>
          {showBalance ? (<p className="text-4xl font-bold mt-4 text-gray-400">********</p>) : ( <p className="text-red-600 text-4xl font-bold mt-4 flex items-center">
            {renderCurrencyIcon("inline-block text-red-600")}{" "}
            <CountUp end={monthlyExpense} duration={1} separator="," />
          </p>)}
          <p className="text-gray-500 text-sm mt-2">
            {monthlyExpenseCount} transactions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
