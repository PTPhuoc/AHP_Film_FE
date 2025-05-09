"use client";

import React from "react";
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

export default function ColumnChart({ name, keyName, listData, className }) {
  return (
    <div className={"w-full h-[400px] " + className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={listData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={name} tick={{ fontSize: 22 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={keyName} fill="#374B9E" /> 
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
