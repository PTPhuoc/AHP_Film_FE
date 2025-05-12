import React from "react";

export default function About() {
  return (
    <div className="w-full p-5 flex flex-grow justify-center items-center">
      <div className="w-[50%] h-[760px] flex flex-col items-center justify-center bg-white px-5 gap-10 rounded-2xl shadow">
        <div>
          <p className="text-[30px] font-bold">
            NHÓM 3 - CNPM 1 - HỆ HỔ TRỢ RA QUYẾT ĐỊNH
          </p>
        </div>
        <div className="w-full">
          <p className="font-bold">THÀNH VIÊN</p>
          <div className="w-[50%] h-[2px] bg-[#374B9E] rounded-4xl"></div>
        </div>
        <div className="flex flex-col gap-10 w-full justify-center">
          <div>
            <p>PHAN TÂN PHƯỚC - 1050080070</p>
          </div>
          <div>
            <p>PHẠM NGỌC HÀ MINH - 1050080061</p>
          </div>
          <div>
            <p>LÊ VŨ ANH KIỆT - 1050080065</p>
          </div>
          <div>
            <p>LÊ QUỐC VIỆT - 1050080083</p>
          </div>
        </div>
        <div className="w-full">
          <p className="font-bold">ĐỀ TÀI</p>
          <div className="w-[50%] h-[2px] bg-[#374B9E] rounded-4xl"></div>
        </div>
        <div className="w-full text-center">
          <p>
            HỆ HỔ TRỢ RA QUYẾT ĐỊNH LỰA CHỌN PHIM LẺ XEM VỚI PHƯƠNG PHÁP AHP
          </p>
          <p>GVHD: TS. DƯƠNG THỊ THÚY NGA</p>
        </div>
      </div>
    </div>
  );
}
