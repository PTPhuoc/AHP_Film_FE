import * as XLSX from "xlsx";

export const syncFunc = (callback, time, delay) => {
  return new Promise((resolve) => {
    let count = 0;
    const timeInterval = setInterval(() => {
      if (count === time) {
        clearInterval(timeInterval);
        resolve(false);
      }
      const result = callback();
      count++;
      if (result) {
        clearInterval(timeInterval);
        resolve(true);
      }
    }, delay);
  });
};

export const isJsonObject = (obj) => {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
};

export const parseFraction = (str) => {
  if (typeof str === "number") return parseFloat(str.toFixed(4));
  if (!str.includes("/")) return parseFloat(parseFloat(str).toFixed(4));

  const [numerator, denominator] = str.split("/").map(Number);
  const result = numerator / denominator;
  return parseFloat(result.toFixed(4));
};

export const readExcel = (file) => {
  return new Promise((resolve, reject) => {
    try {
      if (!file) {
        resolve([]);
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        const header = rows[0].slice(1);
        const matrix = [];

        for (let i = 1; i < rows.length; i++) {
          const rawRow = rows[i];
          const isEmptyRow = rawRow.every(
            (cell) => cell === "" || cell === undefined || cell === null
          );
          if (isEmptyRow) break;

          const row = rawRow.slice(1); // Bỏ cột đầu (label dòng)
          const parseRow = row.map(item => {return parseFraction(item)})
          matrix.push(parseRow);
        }

        resolve({
          header,
          matrix,
          labels: rows.slice(1).map((r) => r[0]),
        });
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject("Có dữ liệu không đúng trong file. Hãy kiểm tra!");
    }
  });
};
