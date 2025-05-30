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

const renderTick = ({ x, y, payload }) => {
  const maxLength = 20; // số ký tự tối đa hiển thị
  const text =
    payload.value.length > maxLength
      ? payload.value.slice(0, maxLength) + "..."
      : payload.value;

  return (
    <text
      x={x}
      y={y + 25}
      textAnchor="middle"
      fill="#666"
      style={{ fontSize: 24, cursor: "default" }}
    >
      {text}
    </text>
  );
};

export default function ResultChart({ ranks, listPlan }) {
  const data = listPlan.map((item, idx) => ({
    name: item.name,
    value: parseFloat(ranks[idx].toFixed(4)),
  }));

  return (
    <div id="chart-container" style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={renderTick} interval={0} />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#374B9E" name="Ưu tiên lựa chọn" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
