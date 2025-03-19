import { Outlet, Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const username = localStorage.getItem("username"); // 檢查是否已登入
  const location = useLocation(); // 取得當前路徑

  if (!username) {
    // 未登入時，跳轉到 /login 並帶上原本的路徑
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />; // 已登入就顯示對應的頁面
};

export default ProtectedRoute;
