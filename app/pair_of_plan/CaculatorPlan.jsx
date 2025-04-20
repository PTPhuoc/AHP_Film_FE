"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context";
import axios from "axios";
import LoaderPage from "../LoaderPage";
import TableFlexible from "../pair_of_criteria/TableFlexible";
import TableShow from "../pair_of_criteria/TableShow";

export default function CaculatorPlan({
  className,
  listPlan,
  nameCriteria,
  handleClick,
}) {
  const { caculatorId, setWarningValue } =
    useContext(UserContext);
  const [matrix, setMatrix] = useState({});
  const [resultMatrix, setResultMatrix] = useState({
    result: [],
    rank: [],
    CI: 0,
    CR: 0,
    RI: 0,
    lamdaMax: 0,
  });
  const [waitObject, setWaitObject] = useState({
    loadData: "Pending",
  });

  const getMatrixPlan = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_matrix_plan/", {
        params: { caculatorId: caculatorId, nameCriteria: nameCriteria },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setMatrix(rs.data);
        } else {
          setWarningValue({
            for: "ServerError",
            title: "Phản hồi server",
            content: rs.data.message ? rs.data.message : rs.data.error,
            type: "N",
            handle: "Pending",
            isOpen: true,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const checkMatrix = (matrixValue) => {
    for (let i = 0; i < matrixValue.length; i++) {
      for (let j = 0; j < matrixValue[i].length; j++) {
        if (matrixValue[i][j] === 0) {
          return { value: false, column: i, row: j };
        }
      }
    }
    return { value: true };
  };

  const handleCaculator = (matrix) => {
    axios
      .post("http://127.0.0.1:8000/api/handle_point_plan/", {
        caculatorId: caculatorId,
        matrix: matrix,
        nameCriteria: nameCriteria,
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setResultMatrix({
            result: rs.data.matrix,
            rank: rs.data.rank,
            lamdaMax: rs.data.lamdaMax,
            CI: rs.data.CI,
            CR: rs.data.CR,
            RI: rs.data.RI,
          });
        } else {
          setWarningValue({
            for: "ServerError",
            title: "Phản hồi server",
            content: rs.data.message ? rs.data.message : rs.data.error,
            type: "N",
            handle: "Pending",
            isOpen: true,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (caculatorId) {
      getMatrixPlan();
    }
  }, [caculatorId]);

  useEffect(() => {
    if (matrix.status === "Success") {
      setWaitObject({ ...waitObject, loadData: "Success" });
    }
  }, [matrix]);

  useEffect(() => {
    if (resultMatrix.result.length > 0) {
      handleClick(resultMatrix);
    }
  }, [resultMatrix]);

  return (
    <div className={"w-full flex flex-col gap-5 " + className}>
      {waitObject.loadData === "Success" ? (
        <>
          <div>
            <TableFlexible
              nameColumn={listPlan}
              tableName={nameCriteria}
              valueMatrix={matrix.matrix}
              matrixChange={(value) => {
                setMatrix(value);
                let check = checkMatrix(value);
                if (check.value) {
                  handleCaculator(value);
                } else {
                  setWarningValue({
                    for: "EmptyValue",
                    title: "Thiếu giá trị",
                    content:
                      "Bạn có giá trị bằng 0 tại " +
                      listPlan[check.row].name +
                      " và " +
                      listPlan[check.column].name,
                    handle: "Pending",
                    type: "N",
                    isOpen: true,
                  });
                }
              }}
            />
          </div>
          {resultMatrix.result.length > 0 && (
            <div className="w-full h-1 bg-[#374B9E] rounded-2xl"></div>
          )}
          <div
            className={
              "flex flex-wrap w-full justify-center gap-10 scroll-none overflow-hidden duration-200 ease-in  " +
              (resultMatrix.result.length > 0 ? "max-h-[1500px]" : "max-h-0")
            }
          >
            <TableShow
              tableName={nameCriteria}
              nameColumn={[
                { id: 1, name: "Criterial Weights" },
                { id: 2, name: "Weighted Sum" },
                { id: 3, name: "Consistency Vector" },
              ]}
              valueMatrix={resultMatrix.result}
              nameRow={listPlan}
            />
            <div className="flex flex-col gap-5 w-[300px]">
              <p className="font-bold">
                Lamda Max:{" "}
                <span className="font-medium">
                  {resultMatrix.lamdaMax.toFixed(4)}
                </span>
              </p>
              <p className="font-bold">
                CI:{" "}
                <span className="font-medium">
                  {resultMatrix.CI.toFixed(4)}
                </span>
              </p>
              <p className="font-bold">
                RI:{" "}
                <span className="font-medium">
                  {parseFloat(resultMatrix.RI.toFixed(4))}
                </span>
              </p>
              <p className="font-bold">
                CR:{" "}
                <span
                  className={
                    "font-medium " +
                    (resultMatrix.CR < 0.1 ? "text-green-500" : "text-red-500")
                  }
                >
                  {resultMatrix.CR.toFixed(4) +
                    " - " +
                    (resultMatrix.CR < 0.1
                      ? "Đạt yêu cầu"
                      : "Chưa đạt yêu cầu CR < 10%")}
                </span>
              </p>
            </div>
            {resultMatrix.result.length > 0 && (
              <div className="w-full h-1 bg-[#374B9E] rounded-2xl"></div>
            )}
          </div>
        </>
      ) : (
        <div>
          <LoaderPage className={"w-full h-[400px]"} />
        </div>
      )}
    </div>
  );
}
