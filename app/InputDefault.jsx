import React from "react";

export default function ButtonDefault({
  className,
  typeInput = "text",
  placeholder,
  nameInput,
  valueInput,
  inputChange,
  handleClick,
}) {
  return (
    <div
      className={
        "w-full flex border-[1px] border-[#374B9E] rounded-2xl p-2 " + className
      }
    >
      <input
        type={typeInput}
        className="grow outline-none pl-2"
        placeholder={placeholder}
        name={nameInput}
        value={valueInput}
        onChange={(e) => inputChange(e.target.value)}
      />
      <button
        disabled={!valueInput}
        onClick={() => handleClick()}
        className={
          valueInput
            ? "bg-[#374B9E] text-white py-3 px-5 rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-white hover:text-[#374B9E] active:scale-90"
            : "bg-zinc-400 text-white border-zinc-400 py-3 px-5 rounded-2xl shadow border-2 duration-200 ease-in"
        }
      >
        Thêm
      </button>
    </div>
  );
}
