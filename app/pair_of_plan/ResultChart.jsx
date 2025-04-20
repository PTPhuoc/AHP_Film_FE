"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ResultChart({ ranks, listPlan }) {
  const data = listPlan.map((item, idx) => ({
    name: item.name,
    value: parseFloat(ranks[idx].toFixed(4)),
  }));
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#374B9E" name="Ưu tiên lựa chọn" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
