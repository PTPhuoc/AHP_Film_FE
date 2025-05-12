"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./Context";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoaderPage from "./LoaderPage";
import InputListSearch from "./InputListSearch";

export default function Home() {
  const {
    caculatorId,
    warningValue,
    setWarningValue,
    getIdCaculator,
    isWindow,
    setIsWindow,
  } = useContext(UserContext);
  const [listCriteria, setListCriteria] = useState([]);
  const [listPlan, setListPlan] = useState([]);
  const [criteria, setCriteria] = useState("");
  const [plan, setPlan] = useState("");
  const [listHistory, setListHistory] = useState([]);
  const [waitObject, setWaitObject] = useState({
    plan: true,
    criteria: true,
    history: true,
    planCatalyst: true,
    criteriaCatalyst: true,
  });
  const [criteriaCatalyst, setCriteriaCatalyst] = useState([]);
  const [planCatalyst, setPlanCatalyst] = useState([]);

  const route = useRouter();

  const addCriteria = (criteriaName) => {
    axios
      .post("http://127.0.0.1:8000/api/add_criteria/", {
        caculatorId: caculatorId,
        criteria: criteriaName,
        index: listCriteria.length,
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListCriteria(rs.data.criterias);
          setCriteria("");
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
        setWaitObject((prev) => {
          return { ...prev, criteria: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const deleteCriteria = (id) => {
    axios
      .delete("http://127.0.0.1:8000/api/delete_criteria/", {
        params: { caculatorId: caculatorId, criteriaId: id },
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

  const getDefaultCriteria = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_default_criterias/", {
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

  const addPlan = (planName, catalystId) => {
    axios
      .post("http://127.0.0.1:8000/api/add_plan/", {
        caculatorId: caculatorId,
        plan: planName,
        catalystId: catalystId,
        index: listPlan.length,
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListPlan(rs.data.plans);
          setPlan("");
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
        setWaitObject((prev) => {
          return { ...prev, plan: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const deletePlan = (id) => {
    axios
      .delete("http://127.0.0.1:8000/api/delete_plan/", {
        params: { caculatorId: caculatorId, planId: id },
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

  const getHistory = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_history/")
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListHistory(
            rs.data.history.sort(
              (a, b) => new Date(a.dateCreate) - new Date(b.dateCreate)
            )
          );
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
          return { ...prev, history: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const getCriteriaCatalyst = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_all_criteria_catalyst/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setCriteriaCatalyst(
            rs.data.criterias.sort((a, b) => a.index - b.index)
          );
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
          return { ...prev, criteriaCatalyst: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const getPlanCatalyst = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_all_plan_catalyst/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setPlanCatalyst(rs.data.plans.sort((a, b) => a.index - b.index));
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
          return { ...prev, planCatalyst: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const formatDate = (stringDay) => {
    const date = new Date(stringDay);
    const formatted = date.toLocaleDateString("vi-VN");
    return formatted;
  };

  useEffect(() => {
    if (caculatorId) {
      getCriteria();
      getPlan();
      getHistory();
      getCriteriaCatalyst();
      getPlanCatalyst();
      setIsWindow({ ...isWindow, load: false });
    }
  }, [caculatorId]);

  useEffect(() => {
    if (warningValue.handle === "Access") {
      if (warningValue.for === "DeleteCriteria") {
        deleteCriteria(warningValue.object);
        setWarningValue({
          ...warningValue,
          for: "",
          handle: "Pending",
          object: "",
        });
      } else if (warningValue.for === "GetDefaultCriteria") {
        getDefaultCriteria();

        setWarningValue({
          ...warningValue,
          for: "",
          handle: "Pending",
          object: "",
        });
      } else if (warningValue.for === "DeletePlan") {
        deletePlan(warningValue.object);
        setWarningValue({
          ...warningValue,
          for: "",
          handle: "Pending",
          object: "",
        });
      }
    }
  }, [warningValue.handle]);

  return (
    <div className="w-full h-full flex justify-center items-center gap-10">
      <div className="w-[30%] h-[700px] flex flex-col gap-5">
        <div className="w-full h-[80px] p-2 flex justify-between items-center bg-white rounded-2xl shadow">
          <p>Sử dụng tiêu chí mặc định</p>
          <button
            onClick={() =>
              setWarningValue({
                for: "GetDefaultCriteria",
                type: "YorN",
                title: "Lấy mặc định tiêu chí",
                content:
                  "Bạn có chắc lấy tiêu chí mặc định." +
                  (listCriteria.length > 0 &&
                    "Các tiêu chí bạn đã nhập sẽ bị xóa"),
                handle: "Pending",
                isOpen: true,
              })
            }
            className="bg-[#374B9E] text-white h-full px-5 rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-white hover:text-[#374B9E] active:scale-90"
          >
            Dùng
          </button>
        </div>
        <div className="flex-1 flex flex-col bg-white shadow rounded-2xl overflow-hidden">
          <InputListSearch
            inputName={""}
            inputValue={criteria}
            inputChange={(value) => setCriteria(value)}
            listSearch={criteriaCatalyst}
            placeHolder="Nhập tiêu chí"
            showlist={(item, index) => {
              return (
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    addCriteria(item.name);
                    setCriteria("");
                  }}
                  key={index}
                  className="w-full py-3 bg-white rounded-2xl scale-100 duration-200 ease-in hover:bg-[#374B9E] hover:text-white active:scale-95"
                >
                  {item.name}
                </button>
              );
            }}
          />
          <div className="flex-1 flex flex-col items-center gap-2 overflow-auto scroll-box">
            {waitObject.criteria ? (
              <LoaderPage className={"w-full h-[500px]"} />
            ) : listCriteria.length > 0 ? (
              listCriteria.map((item, index) => (
                <div
                  key={index}
                  className="w-[90%] flex justify-between items-center py-5 border-b-2 border-[#374B9E]"
                >
                  <p>{item.name}</p>
                  <button
                    onClick={() => {
                      setWarningValue({
                        for: "DeleteCriteria",
                        type: "YorN",
                        handle: "Pending",
                        content: "Bạn có chắc muốn xóa " + item.name,
                        isOpen: true,
                        title: "Xóa tiêu chí",
                        object: item.id,
                      });
                    }}
                  >
                    <svg
                      className="w-[25px] h-[29px] fill-[#374B9E]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="flex-1 flex justify-center items-center">
                <p className="text-zinc-400 font-bold">
                  Bạn chưa thêm tiêu chí nào
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[30%] h-[700px] flex flex-col bg-white rounded-2xl shadow">
        <InputListSearch
          className=""
          inputName={""}
          inputValue={plan}
          inputChange={(value) => setPlan(value)}
          listSearch={planCatalyst}
          placeHolder="Nhập phương án"
          showlist={(item, index) => {
            return (
              <button
                key={index}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  addPlan(item.name, item.id);
                  setPlan("");
                }}
                className="w-full py-3 bg-white rounded-2xl scale-100 duration-200 ease-in hover:bg-[#374B9E] hover:text-white active:scale-95"
              >
                {item.name}
              </button>
            );
          }}
        />
        <div className="flex-1 flex flex-col items-center gap-2 overflow-auto scroll-box">
          {waitObject.plan ? (
            <LoaderPage className={"w-full h-[600px]"} />
          ) : listPlan.length > 0 ? (
            listPlan.map((item, index) => (
              <div
                key={index}
                className="w-[90%] flex justify-between items-center py-5 border-b-2 border-[#374B9E]"
              >
                <p>{item.name}</p>
                <button
                  onClick={() => {
                    setWarningValue({
                      for: "DeletePlan",
                      type: "YorN",
                      handle: "Pending",
                      content: "Bạn có chắc muốn xóa " + item.name,
                      isOpen: true,
                      title: "Xóa Phương án",
                      object: item.id,
                    });
                  }}
                >
                  <svg
                    className="w-[25px] h-[29px] fill-[#374B9E]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <p className="text-zinc-400 font-bold">
                Bạn chưa thêm phương án nào
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="w-[15%] h-[700px] flex flex-col bg-white rounded-2xl shadow">
        <div className="flex-1 p-3 flex flex-col items-center gap-2 overflow-auto scroll-box">
          {waitObject.history ? (
            <LoaderPage className={"w-full h-[700px]"} />
          ) : listHistory.length > 0 ? (
            listHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id !== caculatorId) {
                    setWaitObject({
                      plan: "Pending",
                      criteria: "Pending",
                      history: "Pending",
                    });
                    getIdCaculator(item.id);
                    getCriteria();
                    getPlan();
                    getHistory();
                  }
                }}
                className={
                  "w-full p-2 flex flex-col text-start py-5 rounded-2xl shadow border-b-2 scale-100 border-[#374B9E] duration-200 ease-in hover:bg-[#374B9E] hover:text-white active:scale-90 " +
                  (item.id === caculatorId ? "bg-[#E4F4FF]" : "")
                }
              >
                <p>{formatDate(item.dateCreate)}</p>
                <p>Tổng tiêu chí: {item.numCriteria}</p>
                <p>Tổng phương án: {item.numPlan}</p>
              </button>
            ))
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <p className="text-zinc-400 font-bold">
                Chưa có bài tính nào đã tính
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="fixed right-0 bottom-0 p-5">
        <button
          onClick={() => {
            if (
              (listCriteria.length > 2 || listPlan.length > 0) &&
              listCriteria.length <= 9
            ) {
              setIsWindow({ ...isWindow, load: true });
              route.push("/filter_plan");
            } else {
              setWarningValue({
                for: "MissingData",
                title: "Thiếu dữ liệu",
                content:
                  "Cần ít nhất 2 tiêu chí và phương án và không quá 9 tiêu chí",
                type: "N",
                handle: "Pending",
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
