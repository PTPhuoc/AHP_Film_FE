"use client";

import React, { useContext } from "react";
import HeadBar from "./HeadBar";
import Warning from "./Warning";
import { UserContext } from "./Context";
import LoaderPage from "./LoaderPage";

export default function Root({ children }) {
  const { isWindow } = useContext(UserContext);
  return (
    <div>
      {isWindow.load && (
        <div className="fixed z-50 top-0 left-0 w-full h-full bg-white flex justify-center items-center">
          <LoaderPage className={"w-full h-[500px]"} />
        </div>
      )}
      <Warning />
      <HeadBar />
      {children}
    </div>
  );
}
