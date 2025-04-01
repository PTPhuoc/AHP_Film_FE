import Link from "next/link";
import React from "react";

export default function HeadBar() {
  return (
    <div className="flex justify-between items-center bg-white px-[30px] py-3">
      <div>
        <Link href={"/"}>
          <p className="text-[34px] font-bold">AHP Film</p>
        </Link>
      </div>
      <div>
        <Link href={"/about"}>
          <p className="font-bold">About</p>
        </Link>
      </div>
    </div>
  );
}
