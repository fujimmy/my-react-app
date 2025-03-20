import React, { createContext, useState, useContext, useEffect } from 'react';

// 創建 Context
export const UserContext = createContext();

// 用來提供 UserContext 的組件
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 在應用啟動時從 localStorage 或 sessionStorage 獲取 username
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 用來消費 UserContext 的 hook
export const useUser = () => useContext(UserContext);
