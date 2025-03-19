import { useEffect, useState } from "react";

const API_URL = "http://10.5.6.174:9101/api/surveys";



const SurveyPreview = () => {
    const [questions, setQuestions] = useState([]);
    const [adUser, setAdUser] = useState(null);
    //const [answers, setAnswers] = useState({});
    const [surveyId, setSurveyId] = useState(null);

    const [surveyTitle, setSurveyTitle] = useState("");  // 新增問卷標題 state


    useEffect(() => {
        // 從 sessionStorage 讀取問卷資料
        const storedSurvey = sessionStorage.getItem("surveyPreview");
        if (storedSurvey) {
            setQuestions(JSON.parse(storedSurvey).questions);
            setAdUser(JSON.parse(storedSurvey).username);
            setSurveyId(JSON.parse(storedSurvey).surveyId);
        }
    }, []);
    

     // 🔥 送出問卷，只保留使用者的回答
  const handleSubmit = () => {
    if (!surveyTitle.trim()) {
        alert("問卷標題是必填的！");
        return;  // 停止提交
    }

    const finalData = {
      QuestionTitle: surveyTitle,  
      creator: adUser,
      surveyid:String(surveyId),
      //adStatus: isValidUser,
      questions: questions.map(q => ({
        questionId: String(q.id),
        questionText: q.text,
        questionType: q.type,
        options: q.options || [],  // 可能有 options 的問題
        }))
    };
    console.log("📤 問卷結構 JSON:", JSON.stringify(finalData, null, 2));

    // 送出問卷結構到 API
      fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
    })
        .then(response => response.json())
        .then(data => {
            console.log("問卷送出成功！", data);
            alert("問卷已儲存！");
        })
        .catch(error => {
            console.error("儲存問卷時出錯:", error);
            alert("儲存問卷失敗！");
        });
  };

 
    // 發布問卷的UI
    return (
        
        <div className="p-4 border rounded shadow-md w-96 bg-white">
            <h1>Hi,{adUser}</h1>
            <h2 className="text-lg font-bold mb-4">📋 問卷預覽</h2>
             {/* 問卷標題輸入框 */}
             <div className="mb-4">
                <label className="font-semibold">問卷標題:</label>
                <input
                    type="text"
                    className="border p-2 w-full mt-2"
                    placeholder="請輸入問卷標題"
                    value={surveyTitle}
                    onChange={(e) => setSurveyTitle(e.target.value)}
                />
            </div>
            {questions.length === 0 ? (
                <p className="text-gray-500">沒有可預覽的問卷</p>
            ) : (
                questions.map((q, index) => (
                    <div key={q.id} className="mb-4">
                        <p className="font-semibold">{`Q${index + 1}. ${q.text || "未命名問題"}`}</p>

                        {q.type === "single" && (
                            <div className="mt-2">
                                {q.options.map((option, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`q-${q.id}`}
                                            value={option}
                                            disabled
                                            //onChange={() => handleAnswerChange(q.id, option)}
                                        />
                                        <label>{option || `選項 ${i + 1}`}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {q.type === "multiple" && (
                            <div className="space-y-2">
                                {q.options.map((option, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={option}
                                           // checked={answers[q.id]?.includes(option) || false}
                                            disabled
                                            //onChange={() => handleAnswerChange(q.id, option, true)}
                                        />
                                        <label className="ml-2">{option || "選項"}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {q.type === "dropdown" && (
                            <select className="border p-2 mt-2 w-full" disabled>
                                <option value="">請選擇</option>
                                {q.options.map((option, i) => (
                                    <option key={i} value={option}>
                                        {option || `選項 ${i + 1}`}
                                    </option>
                                ))}
                            </select>
                        )}

                        {q.type === "text" && (
                            <input
                                type="text"
                                className="border p-2 w-full mt-2"
                                placeholder="請輸入回答..."
                                disabled
                                //onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            />
                        )}
                    </div>
                ))
            )}

            <button className="bg-purple-500 text-white px-3 py-1 mt-4 rounded" onClick={handleSubmit}>
                送出問卷
            </button>
        </div>
    );


};

export default SurveyPreview;
