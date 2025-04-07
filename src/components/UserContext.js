import React, { createContext, useState, useContext, useEffect } from 'react';

// 創建 Context
const UserContext = createContext();

// 過期時間（例如：30 分鐘 = 1800000 毫秒）
const EXPIRY_TIME = 30 * 60 * 1000;

const getUserFromLocalStorage = () => {
  const itemStr = localStorage.getItem("user");
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
      // 已過期，清除
      localStorage.removeItem("user");
      return null;
    }

    return item.value;
  } catch (e) {
    // 資料異常，也清除
    localStorage.removeItem("user");
    return null;
  }
};

// 用來提供 UserContext 的組件
export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getUserFromLocalStorage()); // 初始化 user 狀態
  const setUser = (newUser) => {
    if (newUser) {
      const now = new Date().getTime();
      const item = {
        username: newUser,
        expiry: now + EXPIRY_TIME,
      };
      localStorage.setItem("user", JSON.stringify(item));
    } else {
      localStorage.removeItem("user");
    }

    setUserState(newUser);
  };

  //const [user, setUser] = useState(() => localStorage.getItem("user") || null);
  // 在應用啟動時從 localStorage 或 sessionStorage 獲取 username
  /*useEffect(() => {
    if (user) {
      localStorage.setItem("user", user);  // 存儲 user 到 localStorage
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);*/

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 傳出 UserContext 的 hook
export const useUser = () => useContext(UserContext);
