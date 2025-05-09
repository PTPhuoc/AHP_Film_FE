"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context";
import axios from "axios";
import LoaderPage from "../LoaderPage";

export default function page() {
  const { warningValue, setWarningValue, isWindow, setIsWindow } =
    useContext(UserContext);
  const [criteria, setCriteria] = useState("");
  const [listCriteria, setListCriteria] = useState([]);
  const [plan, setPlan] = useState({
    id: "",
    name: "",
    category: "",
    imdb: "",
    duration: "",
    director: "",
    awards: "",
    nation: "",
  });
  const [listPlan, setListPlan] = useState([]);
  const [isWait, setIsWait] = useState({
    criteria: true,
    plan: true,
  });
  const [isOption, setIsOption] = useState({
    createPlan: false,
  });

  const getCriteriaCatalyst = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_all_criteria_catalyst/")
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListCriteria(rs.data.criterias.sort((a, b) => a.id - b.id));
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
        setIsWait((prev) => {
          return { ...prev, criteria: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const addCriteriaCatalyst = () => {
    axios
      .post("http://127.0.0.1:8000/api/add_criteria_catalyst/", {
        name: criteria,
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListCriteria(rs.data.criterias.sort((a, b) => a.id - b.id));
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
        setIsWait((prev) => {
          return { ...prev, criteria: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const deleteCriteriaCatalyst = (criteriaId) => {
    axios
      .delete("http://127.0.0.1:8000/api/delete_criteria_catalyst/", {
        params: { criteriaId: criteriaId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListCriteria(rs.data.criterias.sort((a, b) => a.id - b.id));
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
        setIsWait((prev) => {
          return { ...prev, criteria: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const getAllPlanCatalyst = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_all_plan_catalyst/")
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListPlan(rs.data.plans.sort((a, b) => a.id - b.id));
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
        setIsWait((prev) => {
          return { ...prev, plan: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const addPlanCatalyst = () => {
    axios
      .post("http://127.0.0.1:8000/api/add_plan_catalyst/", {
        ...plan,
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListPlan(rs.data.plans.sort((a, b) => a.id - b.id));
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
        setIsWait((prev) => {
          return { ...prev, plan: false };
        });
      })
      .catch((err) => console.log(err));
  };

  const deletePlanCatalyst = (planId) => {
    axios
      .delete("http://127.0.0.1:8000/api/delete_criteria_catalyst/", {
        params: { planId: planId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListPlan(rs.data.plans.sort((a, b) => a.id - b.id));
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
        setIsWait((prev) => {
          return { ...prev, plan: false };
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCriteriaCatalyst();
    getAllPlanCatalyst();
    setIsWindow({ ...isWindow, load: false });
  }, []);

  useEffect(() => {
    if (warningValue.handle === "Access") {
      if (warningValue.for === "DeleteCriteriaCatalyst") {
        deleteCriteriaCatalyst(warningValue.object);
        setWarningValue({
          ...warningValue,
          for: "",
          handle: "Pending",
          object: "",
        });
      } else if (warningValue.for === "DeletePlanCatalyst") {
      }
    }
  }, [warningValue]);

  return (
    <div className="w-full flex flex-wrap h-[840px] justify-center p-5 gap-5">
      <div className="flex flex-col gap-3 items-center w-[30%] min-w-[700px] h-full bg-white rounded-2xl overflow-hidden">
        <div className="flex-[1] flex items-center w-full bg-[#374B9E]">
          <p className="pl-5 text-white">Danh sách tiêu chí</p>
        </div>
        <div className="flex-[9] flex flex-col gap-3 px-3 w-full overflow-auto">
          <div className="flex-[1] flex p-1 border-[1px] border-[#374B9E] rounded-2xl shadow">
            <input
              className="flex-[9] pl-2 outline-none"
              placeholder="Nhập tên tiêu chí"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              type="text"
            />
            <button
              onClick={() => {
                setListCriteria([]);
                setIsWait({ ...isWait, criteria: true });
                addCriteriaCatalyst();
                setCriteria("");
              }}
              disabled={!criteria}
              className={
                criteria
                  ? "flex-[1] bg-[#374B9E] text-white py-3 px-5 rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-white hover:text-[#374B9E] active:scale-90"
                  : "flex-[1] bg-zinc-400 text-white border-zinc-400 py-3 px-5 rounded-2xl shadow border-2 duration-200 ease-in"
              }
            >
              Thêm
            </button>
          </div>
          {listCriteria.length > 0 ? (
            <div className="flex-[9] flex flex-col gap-3 items-center min-h-0 overflow-auto scroll-box">
              {listCriteria.map((item, index) => (
                <div
                  key={index}
                  className="w-full py-2 flex justify-between border-b-2 border-[#374B9E]"
                >
                  <p>{item.name}</p>
                  <button
                    onClick={() => {
                      setWarningValue({
                        for: "DeleteCriteriaCatalyst",
                        type: "YorN",
                        handle: "Pending",
                        content: "Bạn có chắc muốn xóa " + item.name,
                        isOpen: true,
                        title: "Xóa tiêu chí",
                        object: item.id,
                      });
                    }}
                    className="cursor-pointer"
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
              ))}
            </div>
          ) : (
            <div className="flex-[9] flex justify-center items-center">
              {isWait.criteria ? (
                <LoaderPage />
              ) : (
                <p className="font-bold text-zinc-400">Tiêu chí trống</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center w-[60%] min-w-[700px] h-full bg-white rounded-2xl overflow-hidden">
        <div className="flex-[1] px-5 flex justify-between items-center w-full bg-[#374B9E]">
          <p className="text-white">Danh sách phương án</p>
          <button
            onClick={() => {
              if (isOption.createPlan) {
                setPlan({
                  id: "",
                  name: "",
                  category: "",
                  imdb: "",
                  duration: "",
                  director: "",
                  awards: "",
                  nation: "",
                });
              }
              setIsOption({ ...isOption, createPlan: !isOption.createPlan });
            }}
            className="bg-white text-[#374B9E] py-3 px-5 rounded-2xl shadow border-2 border-white scale-100 duration-200 ease-in hover:bg-[#374B9E] hover:text-white active:scale-90"
          >
            Thêm phương án
          </button>
        </div>
        <div className="relative flex-[9] min-h-0 w-full flex">
          <div
            className={
              "absolute z-[1] bg-white w-[35%] h-full border-r-2 border-[#374B9E] flex flex-col min-h-0 justify-between overflow-hidden duration-200 ease-in-out " +
              (isOption.createPlan
                ? "-translate-x-0 p-3"
                : "-translate-x-[100%] p-0 py-3")
            }
          >
            <div className="flex-[9] min-h-0 flex flex-col gap-3">
              <div className="w-full flex justify-between">
                <p>Thêm phương án</p>
                <button
                  onClick={() => {
                    setIsOption({ ...isOption, createPlan: false });
                    setPlan({
                      id: "",
                      name: "",
                      category: "",
                      imdb: "",
                      duration: "",
                      director: "",
                      awards: "",
                      nation: "",
                    });
                  }}
                  className="cursor-pointer "
                >
                  <svg
                    className="w-[25px] h-[29px] fill-[#374B9E]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              </div>
              <input
                className="w-full outline-none p-3 border-[1px] border-[#374B9E] rounded-2xl shadow"
                type="text"
                placeholder="Tên phương án"
                value={plan.name}
                onChange={(e) => setPlan({ ...plan, name: e.target.value })}
              />
              <input
                className="w-full outline-none p-3 border-[1px] border-[#374B9E] rounded-2xl shadow"
                type="text"
                placeholder="Tên thể loại"
                value={plan.category}
                onChange={(e) => setPlan({ ...plan, category: e.target.value })}
              />
              <input
                className="w-full outline-none p-3 border-[1px] border-[#374B9E] rounded-2xl shadow"
                type="text"
                placeholder="Tên đạo diễn"
                value={plan.director}
                onChange={(e) => setPlan({ ...plan, director: e.target.value })}
              />
              <input
                className="w-full outline-none p-3 border-[1px] border-[#374B9E] rounded-2xl shadow no-spinner"
                type="number"
                placeholder="Thời lượng"
                value={plan.duration}
                onChange={(e) => setPlan({ ...plan, duration: e.target.value })}
              />
              <input
                className="w-full outline-none p-3 border-[1px] border-[#374B9E] rounded-2xl shadow no-spinner"
                type="number"
                placeholder="Điểm IMDb"
                value={plan.imdb}
                onChange={(e) => setPlan({ ...plan, imdb: e.target.value })}
              />
              <input
                className="w-full outline-none p-3 border-[1px] border-[#374B9E] rounded-2xl shadow"
                type="text"
                placeholder="Tên giải thưởng"
                value={plan.awards}
                onChange={(e) => setPlan({ ...plan, awards: e.target.value })}
              />
              <input
                className="w-full outline-none p-3 border-[1px] border-[#374B9E] rounded-2xl shadow"
                type="text"
                placeholder="Tên quốc gia"
                value={plan.nation}
                onChange={(e) => setPlan({ ...plan, nation: e.target.value })}
              />
            </div>
            <div className="flex-[1] flex justify-center items-center">
              <button
                onClick={() => {
                  setListPlan([]);
                  setIsWait({ ...isWait, plan: true });
                  addPlanCatalyst();
                  setIsOption({ ...isOption, createPlan: false });
                  setPlan({
                    id: "",
                    name: "",
                    category: "",
                    imdb: "",
                    duration: "",
                    director: "",
                    awards: "",
                    nation: "",
                  });
                }}
                disabled={
                  !plan.name &&
                  !plan.category &&
                  !plan.duration &&
                  !plan.director &&
                  !plan.awards &&
                  !plan.imdb &&
                  !plan.nation
                }
                className={
                  plan.name &&
                  plan.category &&
                  plan.duration &&
                  plan.director &&
                  plan.awards &&
                  plan.imdb &&
                  plan.nation
                    ? "flex-[1] bg-[#374B9E] text-white py-2 px-5 rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-white hover:text-[#374B9E] active:scale-90"
                    : "flex-[1] bg-zinc-400 text-white border-zinc-400 py-3 px-5 rounded-2xl shadow border-2 duration-200 ease-in"
                }
              >
                Xác nhận thêm
              </button>
            </div>
            {plan.id && (
              <div className="flex-[1] flex justify-center items-center">
                <button className="flex-[1] bg-red-500 text-white py-2 px-5 rounded-2xl shadow border-2 border-red-500 scale-100 duration-200 ease-in hover:bg-white hover:text-red-500 active:scale-90">
                  Xóa phương án
                </button>
              </div>
            )}
          </div>
          {listPlan.length > 0 ? (
            <div className="flex-[7] flex overflow-y-auto overflow-x-hidden scroll-box">
              <div className="w-full h-full flex flex-col">
                <div className="flex text-center text-white bg-[#5c7cff]">
                  <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                    Tên phương án
                  </p>
                  <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                    Tên thể loại
                  </p>
                  <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                    Điểm IMDb
                  </p>
                  <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                    Tên đạo diễn
                  </p>
                  <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                    Thời lượng/Phút
                  </p>
                  <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                    Giải thưởng
                  </p>
                  <p className="flex-[1] min-w-0 truncate py-3 px-1">
                    Quốc qua
                  </p>
                </div>
                {listPlan.map((item, index) => (
                  <button
                    onClick={() => {
                      setPlan({
                        id: item.id,
                        name: item.name,
                        category: item.category,
                        imdb: item.imdb,
                        duration: item.duration,
                        director: item.director,
                        awards: item.awards,
                        nation: item.nation,
                      });
                      setIsOption({ ...isOption, createPlan: true });
                    }}
                    key={index}
                    className="flex text-center border-y-2 border-[#374B9E] cursor-pointer scale-100 duration-200 ease-in hover:scale-[1.03]"
                  >
                    <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                      {item.name}
                    </p>
                    <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                      {item.category}
                    </p>
                    <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                      {item.imdb}
                    </p>
                    <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                      {item.director}
                    </p>
                    <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                      {item.duration}
                    </p>
                    <p className="flex-[1] min-w-0 truncate py-3 px-1 border-r-2 border-[#374B9E]">
                      {item.awards}
                    </p>
                    <p className="flex-[1] min-w-0 truncate py-3 px-1 ">
                      {item.nation}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-[7] flex justify-center items-center">
              {isWait.plan ? (
                <LoaderPage />
              ) : (
                <p className="font-bold text-zinc-400">Phương án trống</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
