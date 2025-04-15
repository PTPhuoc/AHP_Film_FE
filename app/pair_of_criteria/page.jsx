"use client";

import React, { useState } from 'react';

function createMatrix(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function MatrixInput({ title, matrix, showTotalRow = false }) {
  const columnSum = matrix[0].map((_, colIndex) =>
    matrix.reduce((sum, row) => sum + row[colIndex], 0)
  );

  return (
    <div className="space-y-4">
      {title && <div className="text-center font-semibold">{title}</div>}
      <table className="table-auto mx-auto border border-gray-300 text-center">
        <thead>
          <tr>
            <th className="border p-1">Ma trận</th>
            {matrix[0].map((_, idx) => (
              <th key={idx} className="border p-1">Tiêu chí {idx + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="border p-1">Tiêu chí {i + 1}</td>
              {row.map((val, j) => (
                <td key={j} className="border p-1">{val}</td>
              ))}
            </tr>
          ))}
          {showTotalRow && (
            <tr>
              <td className="border p-1 font-semibold">Tổng</td>
              {columnSum.map((sum, idx) => (
                <td key={idx} className="border p-1">{sum}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MatrixWithWeights({ matrix, headers, lastHeader, lastHeader1, lastHeader2 }) {
  return (
    <table className="table-auto mx-auto border border-gray-300 text-center">
      <thead>
        <tr>
          <th className="border p-1">Ma trận</th>
          {headers.map((h, i) => (
            <th key={i} className="border p-1">{h}</th>
          ))}
          {lastHeader && <th className="border p-1">{lastHeader}</th>}
          {lastHeader1 && <th className="border p-1">{lastHeader1}</th>}
          {lastHeader2 && <th className="border p-1">{lastHeader2}</th>}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            <td className="border p-1">Tiêu chí {i + 1}</td>
            {row.map((val, j) => (
              <td key={j} className="border p-1">{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RankingTable({ ranks }) {
  return (
    <div className="w-full">
      <table className="table-auto w-full border border-gray-300 text-center">
        <thead>
          <tr>
            <th className="border p-1">Tiêu chí</th>
            <th className="border p-1">Xếp hạng</th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((rank, index) => (
            <tr key={index}>
              <td className="border p-1">Tiêu chí {index + 1}</td>
              <td className="border p-1">{rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PairOfPlan() {
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState(() => createMatrix(3, 3));
  const [criterialMatrix, setCriterialMatrix] = useState(() => createMatrix(3, 4));
  const [weightedMatrix, setWeightedMatrix] = useState(() => createMatrix(3, 5));
  const [ranks, setRanks] = useState([1, 2, 3]);

  const increaseSize = () => {
    const newSize = size + 1;
    setSize(newSize);
    setMatrix(createMatrix(newSize, newSize));
    setCriterialMatrix(createMatrix(newSize, newSize + 1));
    setWeightedMatrix(createMatrix(newSize, newSize + 2));
    setRanks(Array.from({ length: newSize }, (_, i) => i + 1));
  };

  const decreaseSize = () => {
    if (size > 1) {
      const newSize = size - 1;
      setSize(newSize);
      setMatrix(createMatrix(newSize, newSize));
      setCriterialMatrix(createMatrix(newSize, newSize + 1));
      setWeightedMatrix(createMatrix(newSize, newSize + 2));
      setRanks(Array.from({ length: newSize }, (_, i) => i + 1));
    }
  };

  return (
    <div className="p-8 bg-blue-50 rounded-xl max-w-5xl mx-auto space-y-6 mt-12">
      <div className="flex justify-between">
        <button onClick={increaseSize} className=" text-black px-3 py-1 rounded">+ </button>
        <button onClick={decreaseSize} className="text-black px-3 py-1 rounded">- </button>
      </div>

      <MatrixInput title="Ma trận" matrix={matrix} showTotalRow={true} />

      <div className="flex justify-center">
        <button className="bg-[#374B9E] text-white px-4 py-2 rounded-xl ">
          Tính toán
        </button>
      </div>

      <div className="border-t border-gray-400 pt-4 space-y-6">
        <MatrixWithWeights
          matrix={criterialMatrix}
          headers={Array.from({ length: size }, (_, i) => `Tiêu chí ${i + 1}`)}
          lastHeader="Criterial Weights"
        />
        <MatrixWithWeights
          matrix={weightedMatrix}
          headers={Array.from({ length: size }, (_, i) => `Tiêu chí ${i + 1}`)}
          lastHeader1="Weighted Sum"
          lastHeader2="Consistency Vector"
        />
      </div>

      <div className="text-sm space-y-1">
        <div>Lamda max: 0</div>
        <div>CI: 0</div>
        <div>CR: 0</div>
      </div>

      <RankingTable ranks={ranks} />

      <div className="flex justify-end">
        <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Bước tiếp ➤
        </button>
      </div>
    </div>
  );
}
