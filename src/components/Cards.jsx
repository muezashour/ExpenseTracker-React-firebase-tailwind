import React from "react";
import { useGetTransactions } from "../hooks/useGetTransactions";
import CountUp from "react-countup";
import { useCurrency } from "../context/CurrencyContext";
import { FaDollarSign } from "react-icons/fa";

import { FaEuroSign } from "react-icons/fa";
import { FaTurkishLiraSign } from "react-icons/fa6";
const Cards = () => {
   const { currency } = useCurrency();
  const { transactionTotals } = useGetTransactions();
  const { income, expence, balance, incomeCount, expenseCount } =
    transactionTotals;

  const renderCurrencyIcon = (className = "") => {
  if (currency === "USD") return <FaDollarSign className={className} size={28} />;
  if (currency === "TL") return <FaTurkishLiraSign className={className} size={28} />;
  if (currency === "EURO") return <FaEuroSign className={className} size={28} />;
  return null;
};

  return (
    <div className=" flex  items-center p-7 w-full">
      <div className="flex  flex-col md:flex-row lg:flex-row  justify-center gap-4 w-full">
        <div data-aos="fade-down" className="bg-white rounded-2xl shadow-sm p-8 flex-2 min-w-[280px] lg:min-w-[340px] sm:max-w-[600px] md:min-w-[220px] lg:max-w-[600px] xl:max-w-[700px]">
          <div className="flex justify-between items-start">
            <h2 className="text-gray-800 text-lg font-semibold">
              Total Balance
            </h2>
           <span className="inline-flex items-center">

                                   {currency === "USD" && (
                                     <FaDollarSign size={28} className="inline-block text-gray-300 " />
                                   )}
                                   {currency === "TL" && (
                                     <FaTurkishLiraSign size={28} className="inline-block text-gray-300" />
                                   )}
                                   {currency === "EURO" && (
                                     <FaEuroSign size={28} className="inline-block text-gray-300" />
                                   )}

                                 </span>
          </div>
          <p
            className={`text-4xl font-bold mt-4 flex items-center ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {renderCurrencyIcon("inline-block text-green-600")}
            {balance >= 0 ? `` : `-`}

            <CountUp end={Math.abs(balance)} duration={1} separator="," />
          </p>
          <p className="text-gray-500 text-sm mt-2">+ Current balance</p>
        </div>
        {/* Total Income */}
        <div data-aos="fade-down" className="bg-white rounded-2xl shadow-sm p-8 flex-2 min-w-[270px] lg:min-w-[340px] sm:max-w-[600px] md:min-w-[220px] lg:max-w-[600px] xl:max-w-[700px]">
          <div className="flex justify-between items-start">
            <h2 className="text-gray-800 text-lg font-semibold">
              Total Income
            </h2>
            <span className="text-green-400 text-xl">↑</span>
          </div>
          <p className="text-green-600 text-4xl font-bold mt-4 flex items-center">
            {renderCurrencyIcon("inline-block text-green-600")}<CountUp end={income} duration={1} separator="," />
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {incomeCount} transactions
          </p>
        </div>
        {/* Total Expenses */}
        <div data-aos="fade-down" className="bg-white rounded-2xl shadow-sm p-8 flex-2 min-w-[270px] lg:min-w-[320px] sm:max-w-[600px] md:min-w-[220px] lg:max-w-[600px] xl:max-w-[700px]">
          <div className="flex justify-between items-start">
            <h2 className="text-gray-800 text-lg font-semibold">
              Total Expenses
            </h2>
            <span className="text-red-400 text-xl">↓</span>
          </div>
          <p className="text-red-600 text-4xl font-bold mt-4 flex items-center">
            {renderCurrencyIcon("inline-block text-red-600")} <CountUp end={expence} duration={1} separator="," />
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {expenseCount} transactions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
