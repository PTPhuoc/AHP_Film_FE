"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { readExcel } from "../functions/handleFunc";
import { UserContext } from "../Context";

export default function TableFlexible({
  nameColumn,
  matrixChange,
  valueMatrix,
  tableName,
}) {
  const { setWarningValue } = useContext(UserContext);
  const inputFileRef = useRef(null);
  const calculateColumnSums = (matrix) => {
    const clone = [...matrix];
    for (let j = 0; j < nameColumn.length; j++) {
      const sum = clone
        .slice(0, nameColumn.length)
        .reduce(
          (total, row) => total + (parseFloat(row[j].toFixed(4)) || 0),
          0
        );
      clone[nameColumn.length][j] = parseFloat(sum.toFixed(4));
    }
    return clone;
  };

  const addNewRow = (matrix) => {
    const newRow = new Array(matrix[0].length).fill(0);
    const updatedMatrix = [...matrix, newRow];
    return calculateColumnSums(updatedMatrix);
  };

  const convertMatrix = Array.from({ length: nameColumn.length + 1 }, (_, i) =>
    Array.from({ length: nameColumn.length }, (_, j) => (i === j ? 1 : 0))
  );

  const [matrix, setMatrix] = useState([]);
  const [finalMatrix, setFinalMatrix] = useState(
    calculateColumnSums(
      valueMatrix && valueMatrix.length > 0
        ? addNewRow(valueMatrix)
        : convertMatrix
    )
  );
  const [matrixMemory, setMatrixMemory] = useState(
    calculateColumnSums(convertMatrix)
  );

  const updateMatrixValue = (i, j, newValue, objectMatrix) => {
    const changeValue =
      newValue > 9 ? 9 : newValue < 0 ? 0 : isNaN(newValue) ? "" : newValue;
    objectMatrix((prev) => {
      const clone = [...prev];
      clone[i] = [...clone[i]];
      clone[i][j] = changeValue;
      return clone;
    });
  };

  const finalUpdateMatrix = (i, j, newValue) => {
    setFinalMatrix((prev) => {
      const changeValue =
        newValue > 9 ? 9 : newValue < 0 ? 0 : isNaN(newValue) ? 0 : newValue;
      const clone = [...prev];
      clone[i] = [...clone[i]];
      if (changeValue !== clone[i][j]) {
        clone[i][j] =
          matrixMemory[j][i] > 0 && matrixMemory[j][i] === matrix[j][i]
            ? parseFloat((changeValue / matrix[j][i]).toFixed(4))
            : changeValue;
        if (changeValue > 0 && matrix[j][i] === 0) {
          clone[j][i] = parseFloat((1 / changeValue).toFixed(4));
        } else {
          if (matrixMemory[j][i] === matrix[j][i] && changeValue > 0) {
            clone[j][i] = parseFloat(
              (matrixMemory[j][i] / changeValue).toFixed(4)
            );
          } else {
            clone[j][i] = 0;
          }
        }
      }
      return calculateColumnSums(clone);
    });
  };

  const checkSame = (array, targetArray) => {
    if (array.length > 0 && targetArray.length > 0) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].name.toLowerCase() !== targetArray[i].toLowerCase()) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setMatrix(finalMatrix);
  }, [finalMatrix]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        style={{
          display: "grid",
          justifyContent: "center",
          gridTemplateColumns: `repeat(${nameColumn.length + 1}, 150px)`,
          gridTemplateRows: `repeat(${nameColumn.length + 2}, 80px)`,
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
            gridTemplateColumns: `repeat(${nameColumn.length}, 150px)`,
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
            gridRow: `2 / ${nameColumn.length + 3}`,
            gridColumn: "1 / 2",
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
          <div className="w-full h-full flex justify-center items-center text-center text-white font-bold border-[1px] border-[#374B9E]">
            <p>Tổng</p>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridColumnStart: "2",
            gridRowStart: "2",
            gridColumnEnd: `${nameColumn.length + 1}`,
            gridRowEnd: `${nameColumn.length + 2}`,
            gridTemplateColumns: `repeat(${nameColumn.length}, 150px)`,
            gridTemplateRows: `repeat(${nameColumn.length + 1}, 80px)`,
          }}
        >
          {matrix.map((column, indexColumn) => {
            return column.map((row, indexRow) => (
              <div
                key={`${indexColumn}-${indexRow}`}
                className="border-[1px] border-[#374B9E] w-full h-full"
              >
                <input
                  disabled={
                    indexColumn === indexRow ||
                    indexColumn === nameColumn.length
                  }
                  key={`${indexColumn}-${indexRow}`}
                  type="number"
                  value={matrix[indexColumn][indexRow]}
                  onChange={(e) => {
                    updateMatrixValue(
                      indexColumn,
                      indexRow,
                      parseFloat(e.target.value),
                      setMatrix
                    );
                    updateMatrixValue(
                      indexColumn,
                      indexRow,
                      parseFloat(e.target.value),
                      setMatrixMemory
                    );
                  }}
                  onBlur={(e) =>
                    finalUpdateMatrix(
                      indexColumn,
                      indexRow,
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-full text-center outline-none no-spinner"
                />
              </div>
            ));
          })}
        </div>
      </div>
      <div className="flex gap-5 justify-center">
        <button
          onClick={() => inputFileRef.current.click()}
          className="bg-green-500 text-white py-3 px-5 rounded-2xl shadow border-2 border-green-500 scale-100 duration-200 ease-in hover:bg-white hover:text-green-500 active:scale-90"
        >
          Dùng Excel
        </button>
        <input
          ref={inputFileRef}
          hidden={true}
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => {
            const file = e.target.files?.[0];
            readExcel(file)
              .then((rs) => {
                if (rs.matrix) {
                  let same = checkSame(nameColumn, rs.labels)
                  if (same) {
                    setMatrix(addNewRow(rs.matrix));
                    matrixChange(addNewRow(rs.matrix))
                  } else {
                    setWarningValue({
                      for: "NotSameMatrix",
                      title: "Cảnh báo",
                      content: "Tên cặp ma trận không giống nhau",
                      isOpen: true,
                      type: "N",
                      handle: "Pending",
                      object: "",
                    });
                  }
                }else{
                  setWarningValue({
                      for: "NotSameMatrix",
                      title: "Cảnh báo",
                      content: rs,
                      isOpen: true,
                      type: "N",
                      handle: "Pending",
                      object: "",
                    });
                }
              })
              .catch((err) => console.log(err));
          }}
        />
        <button
          onClick={() => {
            matrixChange(finalMatrix);
          }}
          className="bg-[#374B9E] text-white py-3 px-5 rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-white hover:text-[#374B9E] active:scale-90"
        >
          Tính toán
        </button>
      </div>
    </div>
  );
}
