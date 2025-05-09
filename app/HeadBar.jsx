"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "./Context";

export default function HeadBar() {
  const { isWindow, setIsWindow } = useContext(UserContext);
  return (
    <div className="flex justify-between items-center bg-white px-[30px] py-3">
      <div>
        <Link href={"/"} onClick={() => {setIsWindow({...isWindow, load: true})}}>
          <p className="text-[34px] font-bold">AHP Film</p>
        </Link>
      </div>
      <div className="flex gap-5">
        <Link onClick={() => {setIsWindow({...isWindow, load: true})}} href={"/manage"}>
          <p className="font-bold">Manage</p>
        </Link>
        <Link href={"/about"}>
          <p className="font-bold">About</p>
        </Link>
      </div>
    </div>
  );
}
