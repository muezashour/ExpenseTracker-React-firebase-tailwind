import { useState, useEffect } from "react";
import { getWeeklyTotals } from "../../utils/getWeeklyTotals";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  Tooltip,
} from "recharts";


const WeeklyChart = ({ transactions, type, currency }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const weeklyTotals = getWeeklyTotals(transactions, type, currency);
    setChartData(weeklyTotals);
  }, [transactions, type, currency]);



    const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload;

  const dateObj = new Date(item.year, item.month, item.day);
  const shortMonth = dateObj.toLocaleString("en-US", { month: "short" });

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold",fontSize: "10px", color: "#666" }}>
        {item.dayName}
      </p>
      <p style={{ margin: 0, fontWeight: "bold",fontSize: "10px", color: "#666" }}>
        {`${item.day}/${shortMonth}`}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          color: type === "income" ? "#16a34a" : "#dc2626",
          fontWeight: "bold",
        }}
      >
        Amount :{item.amount}
      </p>
    </div>
  );
};
  return (
      <div

  className="h-48 w-full   min-h-[320px] md:min-h-[320px] lg:min-h-[390px] bg-white p-4 md:p-3 lg:p-8 rounded-xl shadow-sm focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:ring-0"
  tabIndex={-1}
  style={{ outline: "none" }}
>
            <h1 className="text-lg font-semibold mb-2 capitalize text-gray-500">This Week {type} Chart</h1>
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
            dataKey="dayName"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={type === "income" ? "#16a34a" : "#dc2626"}
            fill={type === "income" ? "#16a34a" : "#dc2626"}
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
