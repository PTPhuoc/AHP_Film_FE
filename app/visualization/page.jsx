"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context";
import axios from "axios";
import LoaderPage from "../LoaderPage";
import ColumnChart from "./ColumnChart";
import { useRouter } from "next/navigation";

export default function page() {
  const { caculatorId, isWindow, setWarningValue, setIsWindow } =
    useContext(UserContext);
  const [listPlan, setListPlan] = useState([]);
  const [listCatalysts, setListCatalysts] = useState([]);
  const [resultChart, setResultChart] = useState([]);
  const [waitObject, setWaitObject] = useState({
    plan: true,
    chart: true,
    catalyst: true,
  })

  const route = useRouter()

  const getPlan = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_plan/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          const sortPlan = rs.data.plans.sort((a, b) => a.index - b.index);
          setListPlan(sortPlan);
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
          return { ...prev, plan: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const getCatalyst = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_catalyst_menu/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListCatalysts(rs.data.catalyst);
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
          return { ...prev, catalyst: false };
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (caculatorId) {
      getPlan();
      getCatalyst();
      setIsWindow({ ...isWindow, load: false });
    }
  }, [caculatorId]);

  useEffect(() => {
    if (listPlan.length > 0 && listCatalysts.length > 0) {
      const resultChartData = [];

      // IMDb
      const resultIMDb = listPlan.map((item) => ({
        name: item.name,
        value: item.imdb,
      }));
      if (resultIMDb.length > 0)
        resultChartData.push({ title: "IMDb", data: resultIMDb });

      // Duration
      const resultDuration = listPlan.map((item) => ({
        name: item.name,
        value: item.duration,
      }));
      if (resultDuration.length > 0)
        resultChartData.push({ title: "Thời lượng", data: resultDuration });

      // Thể loại
      const category = listCatalysts.find((item) => item.name === "Thể loại");
      if (category) {
        const resultCategory = category.listCatalyst.map((cat) => ({
          name: cat,
          value: listPlan.reduce(
            (acc, plan) => (plan.category.includes(cat) ? acc + 1 : acc),
            0
          ),
        }));
        resultChartData.push({ title: "Thể loại", data: resultCategory });
      }

      // Giải thưởng
      const awards = listCatalysts.find(
        (item) => item.name === "Đề cử & Giải thưởng"
      );
      if (awards) {
        const resultAward = awards.listCatalyst.map((award) => ({
          name: award,
          value: listPlan.reduce(
            (acc, plan) => (plan.awards.includes(award) ? acc + 1 : acc),
            0
          ),
        }));
        resultChartData.push({ title: "Giải thưởng", data: resultAward });
      }

      // Quốc gia
      const nation = listCatalysts.find((item) => item.name === "Quốc gia");
      if (nation) {
        const resultNation = nation.listCatalyst.map((n) => ({
          name: n,
          value: listPlan.reduce(
            (acc, plan) => (plan.nation.includes(n) ? acc + 1 : acc),
            0
          ),
        }));
        resultChartData.push({ title: "Quốc gia", data: resultNation });
      }

      // Gán toàn bộ 1 lần
      console.log(resultChartData);
      setResultChart(resultChartData);
      setWaitObject((prev) => {
        return { ...prev, chart: false };
      });
    }
  }, [listPlan, listCatalysts]);

  return (
    <div className="w-full flex justify-center items-center p-5 mb-20">
      <div className="w-full flex flex-col gap-10 rounded-2xl bg-white overflow-hidden shadow">
        <div className="w-full p-5 bg-[#374B9E] text-white">
          <p>Trực quan hóa</p>
        </div>
        {waitObject.chart ? (
          <div className="w-full h-[700px] flex justify-center items-center">
            <LoaderPage className={"w-full h-full"} />
          </div>
        ) : resultChart.length > 0 ? (
          resultChart.map((item, index) => (
            <div
              key={index}
              className="w-full flex flex-col justify-center items-center"
            >
              <p className="font-bold">{item.title.toUpperCase()}</p>
              <ColumnChart
                key={index}
                name={"name"}
                keyName={"value"}
                listData={item.data}
              />
              <div className="w-full h-1 rounded-2xl bg-[#374B9E]"></div>
            </div>
          ))
        ) : (
          <div className="w-full h-[700px] flex justify-center items-center">
            <p className="text-zinc-400 font-bold">Không có dữ liệu</p>
          </div>
        )}
      </div>
      <div className="fixed w-full flex justify-between right-0 bottom-0 p-5">
        <button
          onClick={() => {
            setIsWindow({ ...isWindow, load: true });
            route.push("/filter_plan");
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
            setIsWindow({ ...isWindow, load: true });
            route.push("/pair_of_criteria");
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
