import axios from "axios";
import { useEffect, useState } from "react";
const AD_API_URL = "https://10.5.6.174:8982/api/AD/new_emp_chk";

const SurveyForm = () => {
  const [questions, setQuestions] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [answers, setAnswers] = useState({});
  const [adUser, setAdUser] = useState(null);
  const [isValidUser, setIsValidUser] = useState(false);
  const [localIP, setLocalIP] = useState(null);

  useEffect(() => {
    getLocalIP();
  }, []);
  
  useEffect(() => {
    if (localIP) {
      fetchADUser();
    }
  }, [localIP]); // 當 localIP 變更時才執行 fetchADUser()

  const fetchADUser = async () => {
    const username = "jimmy_fu"; // 假設這是登入的使用者

    try {
      if (localIP.startsWith("192.168.")) { //// 本機測試用
        console.log("✅ 本機測試成功:", username,',', localIP);
        setAdUser(username);
        setIsValidUser(true);
      }
      else {
        const response = await axios.get(`/api/AD/new_emp_chk?acct=${username}`, {
          headers: { "X-Api-Key": "admin" }
        });
        //console.log(response);  
        if (response.status === 200) {
          if (response.data.StatusCode === 409 && response.data.Data.detail === "AD Account Conflict.") {
            console.log("✅ AD 驗證成功:", response.data);
            setAdUser(username);
            setIsValidUser(true);
          } else {
            console.error("⚠️ AD 驗證失敗:", '不存在');
            setIsValidUser(false);
          }
        }
      }


    } catch (error) {
      if (error.response) {
        console.error("⚠️ AD 驗證失敗:", error.response ? error.response.data : error.message);
        setIsValidUser(false);
      }
    }
  };

  const getLocalIP = async () => {
    const pc = new RTCPeerConnection();
    pc.createDataChannel("");
    pc.createOffer().then((offer) => pc.setLocalDescription(offer));

    pc.onicecandidate = (event) => {
      if (event && event.candidate && event.candidate.candidate) {
        const localIP = event.candidate.candidate.split(" ")[4];       
        setLocalIP(localIP);
        pc.close();
      }
    };
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: "", type: "single", options: [""] }
    ]);
  };

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

  const addOption = (questionId) => {
    setQuestions(
      questions.map(q =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
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

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

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
      adStatus: isValidUser,
      answers: answers,
    };
    console.log("📤 使用者回答 JSON:", JSON.stringify(answers, null, 2));
    alert("問卷已送出！");
  };

  return (
    <div className="p-4 border rounded shadow-md w-96 bg-white">
      <h2 className="text-lg font-bold mb-2">📝 建立問卷</h2>
      <p className="text-sm text-gray-600">IP: { localIP|| "NA..."}</p>
      <p className="text-sm text-gray-600">AD 使用者: {adUser || "載入中..."}</p>
      <p className="text-sm text-gray-600">驗證狀態: {isValidUser ? "✅ 驗證成功" : "❌ 驗證失敗"}</p>
      {isPreview ? (
        <div>
          <h2 className="text-lg font-bold mb-4">📋 預覽問卷</h2>
          {questions.length === 0 ? (
            <p className="text-gray-500">尚未新增任何問題</p>
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
          <button className="bg-gray-500 text-white px-3 py-1 mt-4 rounded mr-2" onClick={() => setIsPreview(false)}>
            返回編輯
          </button>
          <button className="bg-purple-500 text-white px-3 py-1 mt-4 rounded" onClick={handleSubmit}>
            送出問卷
          </button>
        </div>
      ) : (
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
                  <button className="bg-blue-500 text-white px-3 py-1 mt-2 rounded" onClick={() => addOption(q.id)}>
                    + 新增選項
                  </button>
                </div>
              )}
              <button className="bg-red-500 text-white px-3 py-1 mt-2 rounded" onClick={() => removeQuestion(q.id)}>
                刪除問題
              </button>
            </div>
          ))}
          <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2" onClick={addQuestion}>
            + 新增問題
          </button>
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => setIsPreview(true)}>
            預覽問卷
          </button>
        </div>
      )}
    </div>
  );
};

export default SurveyForm; 