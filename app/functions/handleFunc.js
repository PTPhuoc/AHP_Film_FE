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
