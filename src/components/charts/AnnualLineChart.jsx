import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
    CartesianGrid,
    AreaChart,
  Area,
} from "recharts";

const AnnualLineChart = ({ transactions, type, currency }) => {
  const [chartData, SetChartData] = useState([]);
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const filtered = transactions.filter((t) => {
      const d = new Date(t.transactionDate);

      return (
        t.transactionType === type &&
        t.currency === currency &&
        d.getFullYear() === currentYear
      );
    });

    const monthly = Array(12).fill(0);

    filtered.forEach((t) => {
      const d = new Date(t.transactionDate);
      const monthIndex = d.getMonth();
      monthly[monthIndex] += t.transactionAmount;
    });

    const data = months.map((m, idx) => ({
      date: m,
      amount: monthly[idx],
    }));

    SetChartData(data);
  }, [transactions, type, currency,currentYear]);



  return (
    <div className="h-48 w-full   min-h-80 md:min-h-80 lg:min-h-[390px] bg-white p-4 md:p-3 lg:p-8 rounded-xl shadow-sm focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:ring-0">
      <h1 className="text-lg font-semibold mb-2 capitalize">{type} Chart</h1>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}  margin={
    window.innerWidth < 640
      ? { top: 0, right: 5, left: -20, bottom: 20 } // phone margins
      : { top: 6, right: 10, left: -15, bottom: 22 } // your existing margins
    } className="min-h-[300px]">
          <CartesianGrid strokeDasharray="3 3"  stroke="#f0f0f0"  />
          <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />

          <Tooltip contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px',
                  }}
                  labelStyle={{ color: '#666', fontWeight: 'bold' }}/>
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

export default AnnualLineChart;
