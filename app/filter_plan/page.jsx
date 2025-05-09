"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context";
import axios from "axios";
import InputListSearch from "../InputListSearch";
import LoaderPage from "../LoaderPage";
import { isJsonObject } from "../functions/handleFunc";
import { useRouter } from "next/navigation";

export default function page() {
  const { caculatorId, warningValue, setWarningValue, isWindow, setIsWindow } =
    useContext(UserContext);
  const [listPlan, setListPlan] = useState([]);
  const [listPlanSearch, setListPlanSearch] = useState([]);
  const [listCatalyst, setListCatalyst] = useState([]);
  const [selectOption, setSelectOption] = useState({
    Mã: "",
    "Tên phương án": "",
  });
  const [waitObject, setWaitObject] = useState({
    plan: true,
    catalyst: true,
  });
  const route = useRouter();

  const columnMap = {
    "Thể loại": "category",
    "Đánh giá IMDb": "imdb",
    "Thời lượng": "duration",
    "Đạo diễn": "director",
    "Đề cử & Giải thưởng": "awards",
    "Quốc gia": "nation",
    "Tên phương án": "name",
    Mã: "id",
  };

  const getCatalyst = () => {
    axios
      .get("http://127.0.0.1:8000/api/get_catalyst_menu/", {
        params: { caculatorId: caculatorId },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setListCatalyst(rs.data.catalyst);
          const merged = rs.data.catalyst.reduce((acc, item) => {
            acc[item.name] = "";
            return acc;
          }, {});
          setSelectOption({ ...selectOption, ...merged });
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

  const checkChange = () => {
    let check = false;
    Object.keys(selectOption).forEach((key) => {
      if (selectOption[key] !== "") {
        check = true;
      }
    });
    return check;
  };

  const handleChangePlan = () => {
    axios
      .post("http://127.0.0.1:8000/api/filter_plan/", {
        caculatorId: caculatorId,
        listPlan: listPlanSearch,
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setIsWindow({ ...isWindow, load: true });
          route.push("/visualization");
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

  const filterColumn = (listColumn, listData) => {
    const filteredData = listData.map((item) => {
      const filteredItem = {};
      Object.keys(listColumn).forEach((field) => {
        const key = columnMap[field];
        filteredItem[field] = item[key];
      });
      return filteredItem;
    });
    return filteredData;
  };

  const handleSearch = (option, list = []) => {
    let listSearch = list;

    if (isJsonObject(option)) {
      Object.keys(option).forEach((item) => {
        if (listSearch.length > 0) {
          const key = columnMap[item];
          const value = option[item];

          listSearch = listSearch.filter((itemFilter) => {
            if (item === "Đánh giá IMDb" || item === "Thời lượng") {
              if (value === "") return true;
              return itemFilter[key] === Number(value);
            } else {
              return value
                ? itemFilter[key].toLowerCase().includes(value.toLowerCase())
                : true;
            }
          });
        }
      });

      return listSearch;
    } else {
      return list;
    }
  };

  useEffect(() => {
    if (caculatorId) {
      getPlan();
      getCatalyst();
      setIsWindow({ ...isWindow, load: false });
    }
  }, [caculatorId]);

  useEffect(() => {
    if (listPlan.length > 0) {
      const search = handleSearch(selectOption, listPlan);
      const getColumn = filterColumn(selectOption, search);
      setListPlanSearch(getColumn);
    }
  }, [selectOption, listPlan]);

  useEffect(() => {
    if (warningValue.handle === "Access") {
      if (warningValue.for === "FilterPlan") {
        handleChangePlan();
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
    <div className="w-full p-5 flex justify-center items-center">
      <div className="w-full h-[700px] bg-white flex flex-col overflow-hidden rounded-2xl shadow">
        <div className="w-full p-5 bg-[#374B9E] text-white">
          <p>Lọc phương án</p>
        </div>
        <div className="w-full flex flex-wrap p-5 gap-10">
          {waitObject.catalyst ? (
            <div></div>
          ) : listCatalyst.length > 0 ? (
            listCatalyst.map((item, index) => (
              <InputListSearch
                className="flex-1 min-w-[300px] "
                key={index}
                inputChange={(value) => {
                  let newValue;
                  if (
                    item.name === "Đánh giá IMDb" ||
                    item.name === "Thời lượng"
                  ) {
                    newValue = value.trim() === "" ? "" : parseFloat(value);
                  } else {
                    newValue = value;
                  }
                  setSelectOption((prev) => ({
                    ...prev,
                    [item.name]: newValue,
                  }));
                }}
                inputName={item.name}
                inputValue={selectOption[item.name] ?? ""}
                listSearch={item.listCatalyst}
                placeHolder={"Nhập " + item.name}
                typeInput={
                  item.name === "Đánh giá IMDb" || item.name === "Thời lượng"
                    ? "number"
                    : "text"
                }
                searchAttribute={"listCatalyst"}
                showlist={(el, elIndex) => {
                  return (
                    <button
                      key={elIndex}
                      className="w-full py-3 bg-white rounded-2xl scale-100 duration-200 ease-in hover:bg-[#374B9E] hover:text-white active:scale-95"
                      onMouseDown={(e) => {
                        e.stopPropagation;
                        setSelectOption({ ...selectOption, [item.name]: el });
                      }}
                    >
                      {el}
                    </button>
                  );
                }}
              />
            ))
          ) : (
            <div className=""></div>
          )}
        </div>
        <div className="w-full h-1 bg-[#374B9E] rounded-2xl"></div>
        <div className="w-full h-full flex flex-col overflow-auto scroll-box">
          <div className="flex text-center text-white bg-[#5c7cff]">
            {listCatalyst.length > 0 &&
              Object.keys(selectOption).map((key, index) =>
                key === "Mã" ? (
                  <div key={index}></div>
                ) : (
                  <p
                    key={index}
                    className={
                      "flex-[1] min-w-0 truncate py-3 px-1 border-b-2 border-[#374B9E] " +
                      (index + 1 !== Object.keys(selectOption).length &&
                        "border-r-2")
                    }
                  >
                    {key}
                  </p>
                )
              )}
          </div>
          {waitObject.plan ? (
            <LoaderPage className={"w-full h-full"} />
          ) : listPlanSearch.length > 0 ? (
            listPlanSearch.map((item, index) => (
              <div key={index} className="flex text-center text-[#5c7cff]">
                {Object.keys(item).map((key, index) =>
                  key === "Mã" ? (
                    <div key={index}></div>
                  ) : (
                    <p
                      key={index}
                      className={
                        "flex-[1] min-w-0 truncate py-3 px-1 border-b-2 border-[#374B9E]  " +
                        (index + 1 !== Object.keys(item).length && "border-r-2")
                      }
                    >
                      {item[key]}
                    </p>
                  )
                )}
              </div>
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-zinc-400 font-bold">Không có phương án nào</p>
            </div>
          )}
        </div>
      </div>
      <div className="fixed w-full flex justify-between right-0 bottom-0 p-5">
        <button
          onClick={() => {
            setIsWindow({ ...isWindow, load: true });
            route.push("/");
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
            if (listPlanSearch.length < 2) {
              setWarningValue({
                for: "Warning",
                title: "Thiếu phương án",
                content: "Hãy lọc phương án có ít nhất 2 phương án còn lại.",
                type: "N",
                handle: "Pending",
                isOpen: true,
              });
            } else {
              if (checkChange()) {
                setWarningValue({
                  for: "FilterPlan",
                  title: "Xác nhận lọc",
                  content:
                    "Bạn có chắc muốn thay đổi phương án với kết quả lọc",
                  type: "YorN",
                  handle: "Pending",
                  isOpen: true,
                });
              } else {
                setIsWindow({ ...isWindow, load: true });
                route.push("/visualization");
              }
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
