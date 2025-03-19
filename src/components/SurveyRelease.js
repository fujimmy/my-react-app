import { useEffect, useState } from "react";
import axios from "axios";

const SURVEY_API_URL = "http://10.5.6.174:9101/api/Getsurveys";


const SurveyRelease = () => {
    const [adUser, setAdUser] = useState(null);
    const [answers, setAnswers] = useState({});
    const [survey_Id, setSurveyId] = useState(null);
    const [survey, setSurvey] = useState(null);
    const [responses, setResponses] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        // 從 sessionStorage 讀取問卷資料
        const storedSurvey = sessionStorage.getItem("surveyRelease");
        if (storedSurvey) {
            //console.log(storedSurvey)
            setAdUser(JSON.parse(storedSurvey).username);
            setSurveyId(JSON.parse(storedSurvey).surveyId);

        }
    }, []);

    // 當 survey_Id 有值時才 fetch
    useEffect(() => {
        if (survey_Id) {
            fetchSurveyData(survey_Id);
        }
    }, [survey_Id]);

    // 取得api問卷模板資料
    const fetchSurveyData = async (id) => {
        try {
            //console.log(id);
            const response = await axios.get(`${SURVEY_API_URL}/${id}`);
            //console.log(response);
            if (response.status === 200) {
                setSurvey(response.data);
            }
        } catch (err) {
            setError("❌ 讀取問卷失敗，請稍後再試");
            console.error("API 錯誤:", err);
        }
    };

    // 處理使用者回答
    const handleResponseChange = (questionId, questionText, answervalue, isMultipleChoice = false) => {
        setResponses(prevResponses => {
            // 如果是多選題，直接使用陣列；否則使用原始值
            const newValue = isMultipleChoice ? answervalue : answervalue;

            return {
                ...prevResponses,
                [questionId]: { questionId, questionText, answervalue: newValue }
            };
        });
    };


    // 渲染不同類型的問題
    const renderQuestion = (question) => {
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
                                    onChange={() => handleResponseChange(question.questionId, question.questionText, option)}
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
                                    checked={responses[question.questionId]?.answervalue?.includes(option) || false}
                                    onChange={(e) => {
                                        const selectedOptions = responses[question.questionId]?.answervalue || [];
                                        const newOptions = e.target.checked
                                            ? [...selectedOptions, option]
                                            : selectedOptions.filter((o) => o !== option);

                                        handleResponseChange(question.questionId, question.questionText, newOptions, true);
                                    }}
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
                            onChange={(e) => handleResponseChange(question.questionId, question.questionText, e.target.value)}
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
                            placeholder="請輸入答案"
                            onChange={(e) => handleResponseChange(question.questionId, question.questionText, e.target.value)}
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

    if (!survey) {
        return <div>🔄 載入中...</div>;
    }

    /*const handleSubmit = () => {
        const finalData = {
            QuestionTitle: survey.title,
            surveyid: String(survey_Id),
            answers: Object.values(responses)
        };
        console.log("📤 問卷結構 JSON:", JSON.stringify(finalData, null, 2));
    }*/
    const handleSubmit = () => {
        const finalData = {
            questiontitle: survey.title,
            creator:adUser,
            surveyid: String(survey_Id),
            answers: Object.keys(responses).map((questionId) => {
                const { questionText, answervalue } = responses[questionId];
                return {
                    questionId: questionId,
                    questionText: questionText,
                    answerValue: Array.isArray(answervalue) ? answervalue.join(",") : answervalue // 多選題轉為字串
                };
            })
        };
        console.log("📤 問卷結構 JSON:", JSON.stringify(finalData, null, 2));
    }

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow">
            <h1>Hi,{adUser}</h1>
            <h2 className="text-xl font-bold mb-4">{survey.title}</h2>
            <p className="text-gray-600 mb-4">由 {survey.creator} 建立</p>

            {survey.questions.map((question) => renderQuestion(question))}

            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={handleSubmit}>
                提交問卷
            </button>
        </div>
    );
};
export default SurveyRelease;
