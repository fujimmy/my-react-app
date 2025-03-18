import { useEffect, useState } from "react";


const SurveyPreview = () => {
    const [questions, setQuestions] = useState([]);
    const [adUser, setAdUser] = useState(null);

    const [answers, setAnswers] = useState({});

    useEffect(() => {
        // 從 sessionStorage 讀取問卷資料
        const storedSurvey = sessionStorage.getItem("surveyPreview");
        if (storedSurvey) {
            setQuestions(JSON.parse(storedSurvey).questions);
            setAdUser(JSON.parse(storedSurvey).username);
        }
    }, []);

    // 🔥 更新使用者的回答
    const handleAnswerChange = (questionId, value, isMultiple = false) => {
        setAnswers(prevAnswers => {
            if (isMultiple) {
                const selectedOptions = prevAnswers[questionId] || [];
                const updatedOptions = selectedOptions.includes(value)
                    ? selectedOptions.filter(option => option !== value) // 取消選擇
                    : [...selectedOptions, value]; // 新增選擇

                return { ...prevAnswers, [questionId]: updatedOptions };
            } else {
                return { ...prevAnswers, [questionId]: value };
            }
        });
    };

     // 🔥 送出問卷，只保留使用者的回答
  const handleSubmit = () => {
    const finalData = {
      adUser: adUser,
      //adStatus: isValidUser,
      answers: answers,
    };
    console.log("📤 使用者回答 JSON:", JSON.stringify(finalData, null, 2));
    alert("問卷已送出！");
  };

    return (
        <div className="p-4 border rounded shadow-md w-96 bg-white">
            <h2 className="text-lg font-bold mb-4">📋 問卷預覽</h2>
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
                                            onChange={() => handleAnswerChange(q.id, option)}
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
                                            checked={answers[q.id]?.includes(option) || false}
                                            onChange={() => handleAnswerChange(q.id, option, true)}
                                        />
                                        <label className="ml-2">{option || "選項"}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {q.type === "dropdown" && (
                            <select className="border p-2 mt-2 w-full" onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
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
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
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
