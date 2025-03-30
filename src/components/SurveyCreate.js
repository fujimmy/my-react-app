import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext"; // 引入 UserContext
import { v4 as uuidv4 } from 'uuid';


const SurveyCreate = () => {
  const [questions, setQuestions] = useState([]);
  const { user, setUser } =useUser(); // 使用 UserContext
  const navigate = useNavigate();


  const updateQuestionText = (id, value) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, text: value } : q)));
  };
  const updateQuestionType = (id, value) => {
    setQuestions(
      questions.map(q =>
        q.id === id
          ? { ...q, type: value, options: value !== "text" ? [""] : [] }
          : q
      )
    );
  };

  const updateOption = (questionId, index, value) => {
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
          : q
      )
    );
  };
  const removeOption = (questionId, index) => {
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q
      )
    );
  };
  const addOption = (questionId) => {
    setQuestions(
      questions.map(q =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };
  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: uuidv4(), text: "", type: "single", options: [""] }
    ]);
  };
  const generateTimestamp = (format = "yyyyMMddhhmmsss") => {
    const now = new Date();
    const pad = (num, len) => num.toString().padStart(len, '0');  // 補零函式

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1, 2);  // 月份補零
    const day = pad(now.getDate(), 2);
    const hours = pad(now.getHours(), 2);
    const minutes = pad(now.getMinutes(), 2);
    const seconds = pad(now.getSeconds(), 2);
    const milliseconds = pad(now.getMilliseconds(), 3);  // 毫秒補零

    // 儲存中間結果
    let formattedDate = format
      .replace("yyyy", year)
      .replace("MM", month)
      .replace("dd", day)
      .replace("hh", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);

    // 特別處理 "sss" 不被多次替換
    formattedDate = formattedDate.replace("sss", milliseconds);
    return formattedDate;
  };

  // 預覽問卷於分頁
  const handlePreview = (surveyId) => {
    //window.open(`/survey-preview?id=${surveyId}`, '_blank');

    const surveyData = {
      questions,
      user,
      surveyId
    };
    // 將問卷資料存入 sessionStorage
    sessionStorage.setItem("surveyPreview", JSON.stringify(surveyData));

    // 開啟新分頁
    //window.open(`/survey-preview?id=${surveyId}`, '_blank');
    navigate(`/survey-preview?id=${surveyId}`);
  };

return (
    <div>
        <h2 className="text-lg font-bold mb-4">📝 建立問卷</h2>
        {questions.map((q, index) => (
          <div key={q.id} className="border p-3 mb-4 rounded bg-gray-100">
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder={`問題 ${index + 1}`}
              value={q.text}
              onChange={(e) => updateQuestionText(q.id, e.target.value)}
            />
            <select className="border p-2 w-full" value={q.type} onChange={(e) => updateQuestionType(q.id, e.target.value)}>
              <option value="single">單選</option>
              <option value="multiple">多選</option>
              <option value="dropdown">下拉選單</option>
              <option value="text">文字輸入</option>
            </select>
            {(q.type === "single" || q.type === "multiple" || q.type === "dropdown") && (
              <div className="mt-2">
                {q.options.map((option, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="border p-2 w-full"
                      value={option}
                      onChange={(e) => updateOption(q.id, i, e.target.value)}
                      placeholder={`選項 ${i + 1}`}
                    />
                    {q.options.length > 1 && (
                      <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeOption(q.id, i)}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button className="bg-blue-500 text-white px-3 py-1 mt-2 rounded" button="true" onClick={() => addOption(q.id)}>
                  + 新增選項
                </button>
              </div>
            )}
            <button className="bg-red-500 text-white px-3 py-1 mt-2 rounded" button="true" onClick={() => removeQuestion(q.id)}>
              刪除問題
            </button>
          </div>
        ))}

        <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2" onClick={addQuestion}>
          + 新增問題
        </button>
        {questions.length > 0 && (

          <button onClick={() => handlePreview(generateTimestamp("MMddhhmmss"))}>預覽問卷</button>
        )}     
      </div>
);
}
export default SurveyCreate;