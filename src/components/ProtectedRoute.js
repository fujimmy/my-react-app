// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from './UserContext';  // 假設你用來判斷用戶是否登錄的 hook

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();  // 確保從上下文中獲取 user

  if (!user) {
    // 如果沒有用戶，則跳轉到登錄頁面
    return <Navigate to="/" replace />;
  }

  return children;  // 如果有用戶，則顯示子路由
};

export default ProtectedRoute;
