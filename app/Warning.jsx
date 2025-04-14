"use client";

import React, { useContext } from "react";
import { UserContext } from "./Context";

export default function Warning() {
  const { warningValue, setWarningValue } = useContext(UserContext);
  return (
    <>
      {warningValue.isOpen ? (
        <div className="fixed z-50 h-full w-full bg-[rgba(163,163,163,0.7)] flex justify-center items-center">
          <div className="w-[500px] h-[400px] bg-white rounded-2xl flex flex-col items-center overflow-hidden">
            <div className="w-full bg-[#bce4ff] p-2 flex justify-between items-center">
              <p>{warningValue.title}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation;
                  setWarningValue({
                    ...warningValue,
                    handle: "Cancel",
                    isOpen: false,
                  });
                }}
                className="p-2 bg-white rounded-full"
              >
                <svg
                  className="w-[30px] h-[30px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
            </div>
            <div className="grow flex justify-center items-center text-center">
              <p>{warningValue.content}</p>
            </div>
            <div className="flex justify-center items-center p-3 w-full gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation;
                  setWarningValue({
                    ...warningValue,
                    handle: "Cancel",
                    isOpen: false,
                  });
                }}
                className="bg-white text-[#374B9E] py-2 w-[40%] rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-[#374B9E] hover:text-white active:scale-90"
              >
                Đóng
              </button>
              {warningValue.type === "YorN" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation;
                      setWarningValue({
                        ...warningValue,
                        handle: "Access",
                        isOpen: false,
                      });
                    }}
                    className="bg-[#374B9E] text-white py-2 w-[40%] rounded-2xl shadow border-2 border-[#374B9E] scale-100 duration-200 ease-in hover:bg-white hover:text-[#374B9E] active:scale-90"
                  >
                    Xác nhận
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
