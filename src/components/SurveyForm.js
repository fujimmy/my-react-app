import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AD_API_URL = "https://10.5.6.174:8982/api/AD/new_emp_chk";

const SurveyForm = () => {
  const [questions, setQuestions] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  //const [adUser, setAdUser] = useState(null);
  const [isValidUser, setIsValidUser] = useState(false);
  const [localIP, setLocalIP] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login"); // 未登入者導回登入頁
    }    
    getLocalIP();
  }, []);

  useEffect(() => {
    if (localIP) {
      fetchADUser();
    }
  }, [localIP]); // 當 localIP 變更時才執行 fetchADUser()

  const fetchADUser = async () => {

    try {
      if (localIP.startsWith("192.168.")) { //// 本機測試用
        console.log("✅ 本機測試成功:", username, ',', localIP);
        //setAdUser(username);
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
            //setAdUser(username);
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


  // 預覽問卷於分頁
  const handlePreview = (surveyId) => {
    //window.open(`/survey-preview?id=${surveyId}`, '_blank');

    const surveyData = {
      questions,
      username
    };
    // 將問卷資料存入 sessionStorage
    sessionStorage.setItem("surveyPreview", JSON.stringify(surveyData));

    // 開啟新分頁
    window.open(`/survey-preview?id=${surveyId}`, '_blank');
  };

  const handleLogout = () => {
    localStorage.clear(); // 清除所有 localStorage 資料    
    window.location.replace("/"); // 強制跳轉，防止返回

  };

  return (
    <div className="p-4 border rounded shadow-md w-96 bg-white">
      <h2 className="text-lg font-bold mb-2">📝 建立問卷</h2>
      <p className="text-sm text-gray-600">IP: {localIP || "NA..."}</p>
      <p className="text-sm text-gray-600">AD 使用者: {username || "載入中..."}</p>
      <p className="text-sm text-gray-600">驗證狀態: {isValidUser ? "✅ 驗證成功" : "❌ 驗證失敗"}</p>


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
        {questions.length > 0 && (
          <button onClick={() => handlePreview(123)}>預覽問卷</button>
        )}
        <button className="bg-red-500 text-white px-3 py-1 rounded mt-2" onClick={handleLogout}>
          登出
        </button>


      </div>
    </div>
  );
};

export default SurveyForm;

/*<button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => setIsPreview(true)}>
            預覽問卷
          </button>*/