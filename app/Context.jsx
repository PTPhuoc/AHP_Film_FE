"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function Context({ children }) {
  const [caculatorId, setCaculatorId] = useState("");

  const [warningValue, setWarningValue] = useState({
    for: "",
    title: "Cảnh báo",
    content: "",
    isOpen: false,
    type: "YorN",
    handle: "Pending",
    object: ""
  })

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
          alert(rs.data.message ? rs.data.message : rs.data.error);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const id = window.localStorage.getItem("caculatorId");
    if (id) {
      getIdCaculator(id);
    } else {
      getIdCaculator("");
    }
  }, []);

  return (
    <UserContext.Provider value={{ caculatorId, setCaculatorId, warningValue, setWarningValue, getIdCaculator }}>
      {children}
    </UserContext.Provider>
  );
}
