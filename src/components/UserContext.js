import React, { createContext, useState, useContext, useEffect } from 'react';

// 創建 Context
const UserContext = createContext();

// 用來提供 UserContext 的組件
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem("user") || null);

  // 在應用啟動時從 localStorage 或 sessionStorage 獲取 username
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", user);  // 存儲 user 到 localStorage
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 傳出 UserContext 的 hook
export const useUser = () => useContext(UserContext);
