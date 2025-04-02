import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "./UserContext"; // 引入 UserContext

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const SURVEY_API_URL = `${API_BASE_URL}/api/Completedsuveysbyuser`;

const SurveyCompleted = () => {
    const { user, setUser } = useUser(); // 使用 UserContext
    const navigate = useNavigate();
    const [surveyTemplates, setSurveyTemplates] = useState([]);
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
        navigate('/survey-answer');
        //window.open(`/survey-release`, '_blank');
    };

    return (
        <div className="p-4 border rounded shadow-md w-96 bg-white">
            {/* 現有問卷模板列表 */}
            <div className="mt-6">
                <h3 className="text-lg font-bold">📋 以下是您已填寫的問卷!</h3>
                {surveyTemplates.length === 0 ? (
                    <p className="text-gray-500">目前沒有問卷。</p>
                ) : (
                    surveyTemplates.map((template, index) => (                  

                        <div key={template.surveyid} className="border-b mb-2 pb-2">
                            <p className="font-semibold">{`No${index + 1}:${template.questionTitle}`}</p>
                            <p className="text-gray-500">{`填寫時間:${template.creationTime}`}</p>
                            
                            <button
                                onClick={() => handleRelease(template.surveyId)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                查看問卷
                            </button>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default SurveyCompleted;