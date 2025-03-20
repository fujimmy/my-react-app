import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { useUser } from "./UserContext"; // 引入 UserContext
import { useNavigate } from 'react-router-dom';  // 引入 useNavigate

const drawerWidth = 240;

const Layout = ({ children }) => {
    const { user, setUser } = useUser(); // 使用 UserContext
    const navigate = useNavigate();  // 使用 useNavigate

    console.log("Current user:", user);  // 查看當前用戶狀態


    const handleLogout = () => {
        // 清除 localStorage 並重置狀態
        localStorage.removeItem("username");
        setUser(null); // 清除 UserContext 中的 user
        navigate("/"); // 導航回到登錄頁面
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* 頂部的 AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        我的系統
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        {user ? (
                            <Typography variant="body1" sx={{ color: "white", marginRight: 2 }}>
                                {`Hello, ${user}`}
                            </Typography>
                        ) : (
                            <p>no user</p>
                        )}

                        {user && (
                            <Button color="inherit" onClick={handleLogout}>
                                登出
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* 左側的 Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
                }}
            >
                <Toolbar />
                <List>
                    <ListItem button component={Link} to="/survey">
                        <ListItemText primary="問卷調查" />
                    </ListItem>
                </List>
            </Drawer>

            {/* 主要內容區域 */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
