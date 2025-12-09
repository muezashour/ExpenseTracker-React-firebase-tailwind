import { useState, useEffect } from "react";
import { getMonthTotals } from "../../utils/getMonthlyTotals";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const MonthLineChart = ({ transactions, year, month, type, currency }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const dailyTotals = getMonthTotals(
      transactions,
      year,
      month,
      type,
      currency
    );

    const enhancedData = dailyTotals.map((item) => {
      const dateObj = new Date(year, month, item.day);
      const dayName = dateObj.toLocaleString("en-US", { weekday: "short" });
      return { ...item, dayName };
    });

    setChartData(enhancedData);
  }, [transactions, year, month, type, currency]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;
    const dateObj = new Date(year, month, item.day);
    const shortMonth = dateObj.toLocaleString("en-US", { month: "short" });

    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontSize: "10px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: "#666" }}>
          {item.dayName}
        </p>
        <p style={{ margin: 0, fontWeight: "bold", color: "#666" }}>
          {`${item.day}/${shortMonth}`}
        </p>
        <p
          style={{
            margin: 0,
            color: type === "income" ? "#16a34a" : "#dc2626",
            fontWeight: "bold",
          }}
        >
          {`Amount:${item.amount}`}
        </p>
      </div>
    );
  };

  return (
    <div className="h-48 w-full   min-h-[320px] md:min-h-[320px] lg:min-h-[390px] bg-white p-3 md:p-3 lg:p-8 rounded-xl shadow-sm focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:ring-0">
      <h1 className="text-lg font-semibold mb-2 capitalize">{type} Chart</h1>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={
    window.innerWidth < 640
      ? { top: 0, right: 5, left: -20, bottom: 25 } // phone margins
      : { top: 6, right: 10, left: -15, bottom: 22 } // your existing margins
    } className="min-h-[300px]"
        >
          <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={10}
            tickLine={true}
            axisLine={false}
          />
          <Tooltip content={CustomTooltip} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={type === "income" ? "#16a34a" : "#dc2626"}
            fill={type === "income" ? "#16a34a" : "#dc2626"}
            fillOpacity={0.20}
            strokeWidth={2}
            dot={{ r: 1.5 }}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthLineChart;
