"use client";

import React, { useContext, useEffect, useState } from "react";
import LoaderPage from "../LoaderPage";
import { UserContext } from "../Context";
import { useRouter } from "next/navigation";
import axios from "axios";
import CaculatorPlan from "./CaculatorPlan";
import ResultChart from "./ResultChart";

export default function PairOfPlan() {
  const {
    caculatorId,
    setWarningValue,
    getIdCaculator,
    isWindow,
    setIsWindow,
  } = useContext(UserContext);
  const [listPlan, setListPlan] = useState([]);
  const [listCriteria, setListCriteria] = useState([]);
  const [waitObject, setWaitObject] = useState({
    loadData: "Pending",
  });
  const [step, setStep] = useState(1);
  const [rank, setRank] = useState([]);

  const route = useRouter();

  const getPlan = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_plan/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListPlan(rs.data.plans.sort((a, b) => a.index - b.index));
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

  const getCriteria = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_criterias/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListCriteria(rs.data.criterias.sort((a, b) => a.index - b.index));
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

  const getRankPlan = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_rank_plan/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setRank(rs.data.rank);
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
      getPlan();
      setWaitObject({ ...waitObject, loadData: "Success" });
    }
  }, [caculatorId]);

  useEffect(() => {
    if (listCriteria.length > 0 && step === listCriteria.length + 1) {
      getRankPlan();
    }
  }, [step]);

  return (
    <div className="w-full p-5 pb-[100px] overflow-auto scroll-box">
      {waitObject.loadData === "Success" ? (
        <div className="w-full p-5 bg-white flex flex-col gap-5 items-center rounded-2xl">
          {listCriteria.map((item, index) =>
            index + 1 <= step ? (
              <CaculatorPlan
                key={index}
                listPlan={listPlan}
                nameCriteria={item.name}
                handleClick={(result) => {
                  if (result.CR < 0.1) {
                    setStep(index + 2);
                  } else {
                    setWarningValue({
                      for: "MissingData",
                      title: "Thiếu dữ liệu",
                      content:
                        result.CR > 0.1
                          ? "CR của bạn phải nhỏ hơn 10%"
                          : "Đạt yêu cầu",
                      type: "N",
                      handle: "Pending",
                      isOpen: true,
                    });
                  }
                }}
              />
            ) : null
          )}
          {listCriteria.length > 0 &&
            rank.length > 0 &&
            step === listCriteria.length + 1 && (
              <div className="w-full">
                <ResultChart listPlan={listPlan} ranks={rank} />
              </div>
            )}
          <div className="fixed w-full flex justify-between right-0 bottom-0 p-5">
            <button
              onClick={() => {
                setIsWindow({ ...isWindow, load: true });
                route.push("/pair_of_criteria");
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
                if (
                  listCriteria.length > 0 &&
                  step === listCriteria.length + 1
                ) {
                  getIdCaculator(undefined);
                  setIsWindow({ ...isWindow, load: true });
                  route.push("/");
                } else {
                  setWarningValue({
                    for: "MissingData",
                    title: "Thiếu dữ liệu",
                    content:
                      "Có thể lưu sau khi thực hiện tính toán hết ma trận",
                    type: "N",
                    handle: "Pending",
                    isOpen: true,
                  });
                }
              }}
              className="bg-[#374B9E] flex justify-between items-center text-white fill-white py-3 px-5 rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-white hover:text-[#374B9E] hover:fill-[#374B9E] active:scale-90"
            >
              <p>Lưu bài tính</p>
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
      ) : (
        <div className="w-full bg-white flex flex-col items-center">
          <LoaderPage className={"w-full h-[800px]"} />
        </div>
      )}
    </div>
  );
}
