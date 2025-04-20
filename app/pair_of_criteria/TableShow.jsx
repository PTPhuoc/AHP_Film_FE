"use client";

import React from "react";

export default function TableShow({ nameColumn, nameRow, valueMatrix, tableName }) {
  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        gridTemplateColumns: `repeat(${nameColumn.length}, 200px)`,
        gridTemplateRows: `repeat(${valueMatrix.length + 1}, 80px)`,
        border: "1px solid #374B9E",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div className="w-full h-full flex justify-center items-center text-center text-white font-extrabold bg-[#374B9E] border-[1px] border-[#374B9E]">
        <p>{tableName}</p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${nameColumn.length}, 200px)`,
          gridRow: "1 / 2",
          gridColumn: `2 / ${nameColumn.length + 2}`,
          backgroundColor: "#7396FF",
        }}
      >
        {nameColumn.map((item) => (
          <div
            key={item.id}
            className="w-full h-full flex justify-center items-center text-center text-white font-bold border-[1px] border-[#374B9E] truncate"
          >
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridRow: `2 / ${nameRow.length + 2}`,
          gridColumn: "1 / 2",
          backgroundColor: "#7396FF",
        }}
      >
        {nameRow.map((item) => (
          <div
            key={item.id}
            className="w-full h-full flex justify-center items-center text-center text-white font-bold border-[1px] border-[#374B9E] truncate"
          >
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridColumnStart: "2",
          gridRowStart: "2",
          gridColumnEnd: `${nameColumn.length}`,
          gridRowEnd: `${nameRow.length}`,
          gridTemplateColumns: `repeat(${nameColumn.length}, 200px)`,
          gridTemplateRows: `repeat(${nameRow.length}, 80px)`,
        }}
      >
        {valueMatrix.map((column, indexColumn) => {
          return column.map((row, indexRow) => (
            <div
              key={`${indexColumn}-${indexRow}`}
              className="border-[1px] border-[#374B9E] w-full h-full flex justify-center items-center"
            >
              <p>
                {row.toFixed(4)}
              </p>
            </div>
          ));
        })}
      </div>
    </div>
  );
}
