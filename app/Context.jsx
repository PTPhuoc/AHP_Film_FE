"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { syncFunc } from "./functions/handleFunc";

export const UserContext = createContext();

export function Context({ children }) {
  const [caculatorId, setCaculatorId] = useState("");
  const [isWindow, setIsWindow] = useState({
    load: true,
  });

  const [warningValue, setWarningValue] = useState({
    for: "",
    title: "Cảnh báo",
    content: "",
    isOpen: false,
    type: "YorN",
    handle: "Pending",
    object: "",
  });

  const getIdCaculator = (id) => {
    axios
      .get("http://127.0.0.1:8000/api/get_caculator", {
        params: { id: id },
      })
      .then((rs) => {
        if (rs.data.status === "Success") {
          setCaculatorId(rs.data.caculator.id);
          window.localStorage.setItem("caculatorId", rs.data.caculator.id);
        } else {
          window.localStorage.setItem("caculatorId", "");
          setCaculatorId("");
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
    let getCaculatorId = "";
  
    const fetchId = async () => {
      const result = await syncFunc(() => {
        const id = window.localStorage.getItem("caculatorId");
        if (id) {
          getCaculatorId = id;
          return true;
        }
        return false;
      }, 3, 500);
  
      if (result && getCaculatorId) {
        getIdCaculator(getCaculatorId);
      } else {
        getIdCaculator("");
      }
    };
  
    fetchId();
  }, []);

  return (
    <UserContext.Provider
      value={{
        caculatorId,
        setCaculatorId,
        warningValue,
        setWarningValue,
        getIdCaculator,
        isWindow,
        setIsWindow,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
