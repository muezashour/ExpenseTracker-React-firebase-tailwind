import React, { useEffect, useState } from "react";
import {
  GetCategoryTotals,
  getMonthlyTotal,
} from "../../utils/getCategoryTotals";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useCurrency } from "../../context/CurrencyContext";
import { FaEuroSign } from "react-icons/fa";
import { FaTurkishLiraSign } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";



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

const PieChartComponent = ({ transactions,view }) => {
  const { currency } = useCurrency();
  const [chartData, setChartData] = useState([]);


  const totalExpense = getMonthlyTotal(transactions, view, currency);

  useEffect(() => {
    const pieData = GetCategoryTotals(transactions, view, currency );
    setChartData(pieData);



  }, [transactions, view, currency]);




  const renderCurrencyIcon = (className = "") => {
    if (currency === "USD")
      return <FaDollarSign className={className} size={14} />;
    if (currency === "TL")
      return <FaTurkishLiraSign className={className} size={14} />;
    if (currency === "EURO")
      return <FaEuroSign className={className} size={14} />;
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const { name, value } = payload[0];
    return (
      <div className="bg-white  rounded-lg px-4 py-2 shadow-md">
        <p className="text-sm font-medium text-gray-400 font-sans">
          Category: {name}
        </p>
        <p className="text-sm text-gray-400 font-mono">
          Amount: {value.toLocaleString()}
          {renderCurrencyIcon("inline-block text-sm")}
        </p>
      </div>
    );
  };


  return (
    <div className="relative w-full h-[340px] md:h-[300px] flex flex-col items-start">
      <div className="p-3 flex items-center justify-between gap-4 w-full">
        <h2 className="font-mono text-lg font-semibold"> Monthly Pie Chart</h2>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center text-gray-400">No data available</div>
      ) : (
        <>
          <div className="relative flex flex-col md:flex-row items-center w-full h-full px-4 md:px-8 gap-6">
            <div className="w-full h-full mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ aspectRatio: 1 }}>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="100%"
                    paddingAngle={5}
                    cornerRadius="10%"
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          CATEGORY_COLORS[
                            chartData[index].name?.trim().toLowerCase()
                          ] || CATEGORY_COLORS.others
                        }
                      />
                    ))}
                  </Pie>

                  <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-400 text-xs md:text-sm  font-medium"
                  >
                    {view === "income" ? "Total Income" : "Total Expense"}
                  </text>

                  <text
                    x="50%"
                    y="55%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-900 text-xs md:text-lg font-bold"
                  >
                    {totalExpense > 0
                      ? `${totalExpense.toLocaleString()} ${
                          currency === "USD"
                            ? "$"
                            : currency === "EURO"
                            ? "€"
                            : "₺"
                        }`
                      : `0 ${
                          currency === "USD"
                            ? "$"
                            : currency === "EURO"
                            ? "€"
                            : "₺"
                        }`}
                  </text>

                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              className="
                w-full
                text-sm
                px-1
                scrollbar-hide
                overflow-y-hidden
                grid
                grid-flow-col
                auto-cols-max
                gap-1
                overflow-x-auto

                md:grid-flow-row
                md:grid-cols-2
                md:gap-x-4
                md:gap-y-2
                md:overflow-x-visible
              "
            >
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-2 py-1 whitespace-nowrap"
                >
                  <span
                    className="w-3 h-3 rounded-full cursor-pointer transition-transform duration-150 hover:scale-125 shrink-0"
                    style={{
                      backgroundColor:
                        CATEGORY_COLORS[item.name?.trim().toLowerCase()] ||
                        CATEGORY_COLORS.others,
                    }}
                  />
                  <span className="text-gray-600 capitalize pointer-events-none">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PieChartComponent;
