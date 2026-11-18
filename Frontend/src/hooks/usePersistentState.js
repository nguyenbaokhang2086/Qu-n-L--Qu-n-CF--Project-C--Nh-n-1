import { useLayoutEffect, useState } from "react";

export const usePersistentState = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key);
      return savedValue === null ? initialValue : JSON.parse(savedValue);
    } catch (error) {
      console.error(`Không thể đọc dữ liệu đã lưu "${key}" từ trình duyệt.`, error);
      return initialValue;
    }
  });

  useLayoutEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Không thể lưu dữ liệu "${key}" vào trình duyệt.`, error);
    }
  }, [key, value]);

  return [value, setValue];
};
