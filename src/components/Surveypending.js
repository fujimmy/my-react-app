import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // 引入 useNavigate
import { TextField, Button, Typography, Box } from "@mui/material";  // 引入 MUI 組件
import { useUser } from './UserContext';  // 引入 useUser hook
import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const SURVEY_API_URL = `${API_BASE_URL}/api/Pendingsuveybyuser`;

const Surveypending = () => {
    const [surveyTemplates, setSurveyTemplates] = useState([]);
    const navigate = useNavigate();
    const { user, setUser } =useUser(); // 使用 UserContext

    useEffect(() => {
        //console.log("SurveyPage 已載入");
        fetchSurveyTemplates();
    }, []);


    // 取得問卷模板列表
    const fetchSurveyTemplates = async () => {
        try {
            console.log("使用者:", user);
            const response = await axios.get(`${SURVEY_API_URL}?account=${user}`);
            //console.log(response);
            if (response.status === 200) {
                setSurveyTemplates(response.data);
            }
        } catch (error) {
            console.error("❌ 無法載入問卷模板:", error);
        }
    };

    // 查看現有問卷於分頁
  const handleRelease = (surveyId) => {
    //console.log(surveyId);
    const surveyData = {
      user,
      surveyId
    };
    // 將問卷資料存入 sessionStorage
    sessionStorage.setItem("surveyRelease", JSON.stringify(surveyData));

    // 開啟新分頁
    navigate('/survey-release');
    //window.open(`/survey-release`, '_blank');
  };

    return (
        <div className="p-4 border rounded shadow-md w-96 bg-white">
            {/* 現有問卷模板列表 */}
            <div className="mt-6">
                <h3 className="text-lg font-bold">📋 以下是您尚未填寫的問卷!</h3>
                {surveyTemplates.length === 0 ? (
                    <p className="text-gray-500">目前沒有任何問卷模板。</p>
                ) : (
                    surveyTemplates.map((template,index) => (
                        <div key={template.surveyid} className="border-b mb-2 pb-2">
                            <p className="font-semibold">{`No${index+1}:${template.title}`}</p>
                            <button
                                onClick={() => handleRelease(template.surveyid)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                填寫問卷
                            </button>
                            
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
export default Surveypending;


