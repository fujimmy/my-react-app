import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, ListItemButton, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { Link, useNavigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useUser } from "./UserContext"; // 引入 useUser hook

const drawerWidth = 240;

const Layout = () => {
    const { user, setUser } = useUser(); // 使用 UserContext
    const navigate = useNavigate();  // 使用 useNavigate
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(true);

    //console.log("Current user:", user);  // 查看當前用戶狀態

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(storedUser);  // ✅ 讀取 localStorage
        } else {
            navigate("/"); // ✅ 沒有登入就導回首頁
        }
        setLoading(false);
    }, [setUser, navigate]);


    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        // 清除 localStorage 並重置狀態
        localStorage.removeItem("username");
        setUser(null); // 清除 UserContext 中的 user
        navigate("/"); // 導航回到登錄頁面
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
            <CssBaseline />

            {/* 頂部的 AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        我的系統
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        {user && (
                            <Typography variant="body1" sx={{ color: "white", marginRight: 2 }}>
                                {`Hello, ${user}`}
                            </Typography>
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
                open={open}
                sx={{
                    width: open ? drawerWidth : 60,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: open ? drawerWidth : 60, transition: "width 0.3s" },
                }}
            >
                <Toolbar>
                    <IconButton onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
                <List>
                    <ListItemButton component={Link} to="/survey">
                        <ListItemText primary="問卷調查" />
                    </ListItemButton >
                </List>
            </Drawer>

            {/* 主要內容區域 */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
                <Toolbar />
                <Outlet />  {/* ✅ 這裡讓子頁面能夠顯示 */}
            </Box>
        </Box>
    );
};

export default Layout;
