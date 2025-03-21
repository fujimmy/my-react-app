import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // 引入 useNavigate
import { TextField, Button, Typography, Box } from "@mui/material";  // 引入 MUI 組件
import { useUser } from './UserContext';  // 引入 useUser hook

const LoginPage = () => {
  const [account, setAccount] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // 取得 `navigate` 函數
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);


  // 監聽 user 狀態變化，一旦 user 被設置，就跳轉頁面
  useEffect(() => {
    if (user) {
      console.log("user 更新，跳轉到 survey 頁面:" + user);
      navigate("/survey", { replace: true });// 當 user 更新後跳轉到 survey 頁面
    }
  }, [user, navigate]); // 當 user 更新時觸發

  /*useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
        setUser(storedUser);
    }
}, []);*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const data = { account, password };

    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/AD/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "3ce17b00-68c3-41a1-812b-f87017b4dfad",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      //console.log("登入結果:", result);
      if (result.result) {
        //console.log("登入成功，使用 useNavigate 跳轉," + account);        
        setUser(account);
        //navigate('/survey');
        //window.location.href = "/survey"; // 跳轉到問卷頁面
        //setTimeout(() => navigate("/survey", { replace: true }), 100); // **確保 user 更新後再跳轉**
      } else {
        setErrorMessage(result.msg);
      }
    } catch (error) {
      console.error("登入錯誤:", error);
      setErrorMessage("登入失敗，請稍後再試");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#f7f7f7" }}>
      <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2, boxShadow: 2, width: 400 }}>
        <Typography variant="h4" sx={{ mb: 2 }} textAlign="center">登入</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="帳號"
            variant="outlined"
            fullWidth
            value={account||""}
            onChange={(e) => setAccount(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="密碼"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
          >
             {loading ? "登入中..." : "登入"}
          </Button>
          {errorMessage && (
            <Typography color="error" textAlign="center">{errorMessage}</Typography>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
