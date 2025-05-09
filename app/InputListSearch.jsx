"use client";

import React, { useState } from "react";

export default function InputListSearch({
  className = "",
  typeInput = "text",
  inputValue,
  inputName,
  listSearch = [],
  inputChange,
  showlist,
  searchAttribute = "name",
  placeHolder = "Nhập",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleSearch = (list) => {
    let search = list;
    if (inputValue) {
      search = search.filter((item) =>
        item[searchAttribute]
          ? typeof item[searchAttribute] === "string"
            ? item[searchAttribute]
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            : item[searchAttribute] === inputValue
          : typeof item === "string"
          ? item.toLowerCase().includes(inputValue.toLowerCase())
          : item === inputValue
      );
    }
    return search;
  };

  const filteredList = handleSearch(listSearch);

  return (
    <div className={"relative w-full h-[80px] " + className}>
      <input
        className="relative w-full h-full p-3 outline-none z-[3] bg-white border-[2px] border-[#374B9E] rounded-2xl no-spinner"
        type={typeInput}
        name={inputName}
        value={inputValue}
        placeholder={placeHolder}
        onChange={(e) => inputChange(e.target.value)}
        onClick={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      <div
        className={
          "absolute top-0 left-0 z-[2] w-full p-1 bg-zinc-200 flex flex-col gap-2 overflow-auto scroll-none mt-[40px] border-[1px] border-[#374B9E] rounded-xl duration-200 ease-in-out " +
          (isOpen ? "max-h-[400px] pt-[45px]" : "max-h-0 pt-0")
        }
      >
        {listSearch.length > 0 && filteredList.length > 0 ? (
          filteredList.map((item, index) => showlist(item, index))
        ) : (
          <div className="w-full flex justify-center items-center text-center">
            <p className="p-3 bg-white rounded-2xl w-full">Không có tiêu chí</p>
          </div>
        )}
      </div>
    </div>
  );
}
