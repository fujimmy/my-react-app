import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext"; // 引入 UserContext

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const GetSurveyAnswers_API_URL = `${API_BASE_URL}/api/GetSurveyAnswer`;

const SurveyAnswer = () => {
    const { user, setUser } = useUser(); // 使用 UserContext
    const [surveyId, setSurveyId] = useState(null);
    const [survey, setSurvey] = useState(null);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState(null);
    const [answerGlobal, setAnswer] = useState(null);

    // 取得問卷ID並設定
    useEffect(() => {
        const storedSurvey = sessionStorage.getItem("surveyRelease");
        if (!storedSurvey || user != JSON.parse(storedSurvey).user) {
            alert("❌ 你沒有權限查看此問卷！");
        }
        if (storedSurvey) {
            setSurveyId(JSON.parse(storedSurvey).surveyId);
        }
    }, [user]);

    useEffect(() => {
        if (user && surveyId) {
            fetchSurveyData(surveyId);
            fetchPreviousAnswers(user, surveyId);
        }
    }, [user, surveyId]);

    // 獲取問卷資料
    const fetchSurveyData = async (surveyId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/GetSurveys/${surveyId}`);
            //console.log("問卷資料回應:", response.data); // 確認問卷資料回應內容
            if (response.data) {
                //console.log('Survey=',response.data)
                setSurvey(response.data); // 設置問卷資料
            } else {
                console.warn("⚠️ 問卷資料不存在！");
                setSurvey(null); // 確保 survey 為 null 若資料不存在
            }
        } catch (error) {
            console.error("❌ 無法獲取問卷資料:", error);
            setError("無法載入問卷資料，請稍後再試。");
            setSurvey(null);
        }
    };

    // 獲取已填答案
    const fetchPreviousAnswers = async (account, surveyId) => {
        try {
            const response = await axios.get(`${GetSurveyAnswers_API_URL}?account=${user}&surveyId=${surveyId}`);
            console.log("API 回應資料:", response.data);  // 檢查回應內容

            // 確保 response.data 存在，並且 answers 是陣列
            if (!response.data || !Array.isArray(response.data.answers)) {
                console.warn("⚠️ API 回傳的 answers 不是陣列或不存在");
                setResponses({});
                setAnswer({});
                return;
            }

            // 轉換 answers 為 { questionId: answerValue } 的物件格式
            const previousAnswers = response.data.answers.reduce((acc, answer) => {
                acc[answer.questionId] = answer.answerValue;  // 注意 key 大小寫
                return acc;
            }, {});
            setResponses(previousAnswers);
            setAnswer(response.data);
        } catch (error) {
            console.error("❌ 無法獲取填寫過的答案:", error);
            setError("無法獲取問卷答案，請稍後再試。"); // 更新錯誤訊息
            setResponses({}); // 確保即使錯誤也有初始值
            setAnswer({});
        }
    };

    // 渲染問題
    const renderQuestion = (question) => {   
        //console.log('responses=',responses);
       // console.log('questionId=',question.questionId);
        const answer = responses?.[question.questionId] || ""; // 確保不會取到 undefined
        //多選是用string1,string2 儲存,要轉為array
        const answerArray = question.questionType === "multiple" && answer ? answer.split(",") : [];

        //console.log("當前問題:", question); // 確保 question 內容正確
        if (!question || !question.questionId) return null; // 防止渲染錯誤的問題

        switch (question.questionType) {
            case "single":
                return (
                    <div key={question.questionId} className="mb-4">
                        <p className="font-semibold">{question.questionText}</p>
                        {question.options.map((option, index) => (
                            <label key={index} className="block">
                                <input
                                    type="radio"
                                    name={question.questionId}
                                    value={option}
                                    checked={answer === option}
                                    readOnly disabled
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );

            case "multiple":
                return (
                    <div key={question.questionId} className="mb-4">
                        <p className="font-semibold">{question.questionText}</p>
                        {question.options.map((option, index) => (
                            <label key={index} className="block">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={answerArray.includes(option)}
                                    readOnly disabled
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );

            case "dropdown":
                return (
                    <div key={question.questionId} className="mb-4">
                        <p className="font-semibold">{question.questionText}</p>
                        <select
                            className="border p-2 w-full"
                            value={answer || ""}
                            readOnly disabled
                        >
                            <option value="">請選擇</option>
                            {question.options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case "text":
                return (
                    <div key={question.questionId} className="mb-4">
                        <p className="font-semibold">{question.questionText}</p>
                        <input
                            type="text"
                            className="border p-2 w-full"
                            value={answer || ""}
                            readOnly disabled
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }
    if (!survey && !answerGlobal) {
        return <div>🔄 載入問卷中...</div>;
    }
    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow">
            <h3>以下是您回答過的問卷</h3>            
            <h2 className="text-xl font-bold mb-4">{survey.questionTitle}</h2>
            <p>填寫時間:{answerGlobal&&answerGlobal.creationTime}</p>
            <p className="text-gray-600 mb-4">由 {survey.creator} 建立</p>
            {survey.questions && survey.questions.map((question) => renderQuestion(question))}
        </div>
    );
};

export default SurveyAnswer;