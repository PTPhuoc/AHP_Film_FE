"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context";
import axios from "axios";
import TableFlexible from "./TableFlexible";
import TableShow from "./TableShow";
import LoaderPage from "../LoaderPage";
import { useRouter } from "next/navigation";

export default function PairOfCriteria() {
  const { caculatorId, warningValue, setWarningValue, isWindow, setIsWindow } =
    useContext(UserContext);
  const [listCriteria, setListCriteria] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [resultMatrix, setResultMatrix] = useState({
    result: [],
    rank: [],
    CI: 0,
    CR: 0,
    RI: 0,
    lamdaMax: 0,
  });
  const [waitObject, setWaitObject] = useState({
    matrix: "Pending",
    criteria: "Pending",
  });

  const route = useRouter();

  const getCriteria = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_criterias/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          if (rs.data.criterias.length === 0) {
            route.push("/");
          } else {
            setListCriteria(
              rs.data.criterias.sort((a, b) => a.index - b.index)
            );
          }
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
        setWaitObject((prev) => {
          return { ...prev, criteria: "Success" };
        });
      })
      .catch((err) => console.log(err));
  };

  const getMatrixCriteria = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_matrix_criteria/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setMatrix(rs.data.matrix);
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
        setWaitObject((prev) => {
          return { ...prev, matrix: "Success" };
        });
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
      .post("http://127.0.0.1:8000/api/handle_point_criteria/", {
        caculatorId: caculatorId,
        matrix: matrix,
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setResultMatrix({
            result: rs.data.matrix2,
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
      getCriteria();
      getMatrixCriteria();
      setIsWindow({ ...isWindow, load: false });
    }
  }, [caculatorId]);

  useEffect(() => {
    if (warningValue.hanlde === "Cancel") {
      setWarningValue({
        for: "",
        handle: "Pending",
      });
    }
  }, [warningValue]);

  return (
    <div className="w-full p-5 pb-[100px] overflow-auto scroll-box">
      <div className="w-full flex flex-col items-center gap-5 p-5 bg-white rounded-2xl">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            Hướng dẫn đánh giá mức độ quan trọng giữa các tiêu chí
          </h1>

          <p className="text-gray-700 mb-4">
            Dựa trên ý kiến chuyên gia, bạn sẽ tiến hành{" "}
            <strong className="font-semibold">so sánh từng cặp tiêu chí</strong>{" "}
            với nhau bằng cách sử dụng thang điểm của{" "}
            <strong className="font-semibold">T.Saaty</strong> như sau:
          </p>

          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Giá trị</th>
                  <th className="px-4 py-2 border">Ý nghĩa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">1</td>
                  <td className="border px-4 py-2">
                    Hai tiêu chí quan trọng như nhau
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">3</td>
                  <td className="border px-4 py-2">
                    Một tiêu chí hơi quan trọng hơn tiêu chí kia
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">5</td>
                  <td className="border px-4 py-2">
                    Một tiêu chí rõ ràng quan trọng hơn tiêu chí kia
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">7</td>
                  <td className="border px-4 py-2">
                    Một tiêu chí rất quan trọng hơn tiêu chí kia
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">9</td>
                  <td className="border px-4 py-2">
                    Một tiêu chí tuyệt đối quan trọng hơn tiêu chí kia
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">2, 4, 6, 8</td>
                  <td className="border px-4 py-2">
                    Giá trị trung gian giữa các mức ở trên
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 mt-4 italic">
            * Khi bạn chọn mức độ quan trọng cho cặp (Tiêu chí A, Tiêu chí B),
            hệ thống sẽ tự động chia đối xứng cho cặp (B, A). Ví dụ: nếu A quan
            trọng hơn B với điểm 5 thì B so với A sẽ là 1/5.
          </p>

          <p className="text-sm text-gray-500 italic">
            * Chỉ nhập số từ 1 đến 9 (hoặc giá trị trung gian). Không nhập số
            âm, ký tự, hoặc số lớn hơn 9.
          </p>
        </div>
        <div
          className={
            "w-full flex justify-center" +
            (waitObject.matrix !== "Pending" && " overflow-auto scroll-box")
          }
        >
          {waitObject.matrix === "Pending" ? (
            <LoaderPage className={"w-full h-[400px]"} />
          ) : (
            <div>
              {listCriteria.length > 0 ? (
                <TableFlexible
                  nameColumn={listCriteria}
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
                          listCriteria[check.row].name +
                          " và " +
                          listCriteria[check.column].name,
                        handle: "Pending",
                        type: "N",
                        isOpen: true,
                      });
                    }
                  }}
                  valueMatrix={matrix}
                  tableName={"Tiêu chí"}
                />
              ) : (
                <div></div>
              )}
            </div>
          )}
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
            tableName={"Kết quả"}
            nameColumn={[
              { id: 1, name: "Criterial Weights" },
              { id: 2, name: "Weighted Sum" },
              { id: 3, name: "Consistency Vector" },
            ]}
            valueMatrix={resultMatrix.result}
            nameRow={listCriteria}
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
              <span className="font-medium">{resultMatrix.CI.toFixed(4)}</span>
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
          <div>
            <TableShow
              tableName={"Kết quả"}
              nameColumn={[
                { id: 1, name: "Criterial Weights" },
                { id: 2, name: "Rank" },
              ]}
              nameRow={listCriteria}
              valueMatrix={resultMatrix.rank}
            />
          </div>
        </div>
      </div>
      <div className="fixed w-full flex justify-between right-0 bottom-0 p-5">
        <button
          onClick={() => {
            setIsWindow({ ...isWindow, load: true });
            route.push("/visualization");
          }}
          className="bg-[#374B9E] flex justify-between items-center text-white fill-white py-3 px-5 rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-white hover:text-[#374B9E] hover:fill-[#374B9E] active:scale-90"
        >
          <svg
            className="w-[30px] h-[30px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <p> Quay về</p>
        </button>
        <button
          onClick={() => {
            if (resultMatrix.result.length > 0 && resultMatrix.CR <= 0.1) {
              setIsWindow({ ...isWindow, load: true });
              route.push("/pair_of_plan");
            } else {
              setWarningValue({
                for: "MissingData",
                title: "Thiếu dữ liệu",
                content:
                  resultMatrix.result.length === 0
                    ? "Bạn chưa thực hiện tính toán"
                    : resultMatrix.CR > 0.1
                    ? "CR của bạn phải nhỏ hơn 10%"
                    : "Đạt yêu cầu",
                type: "N",
                handle: "Pending",
                isOpen: true,
              });
            }
          }}
          className="bg-[#374B9E] flex justify-between items-center text-white fill-white py-3 px-5 rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-white hover:text-[#374B9E] hover:fill-[#374B9E] active:scale-90"
        >
          <p>Bước tiếp</p>
          <svg
            className="w-[30px] h-[30px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
