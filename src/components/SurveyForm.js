import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "./UserContext"; // 引入 UserContext

const AD_API_URL = "https://10.5.6.174:8982/api/AD/new_emp_chk";

const SURVEY_API_URL = "http://10.5.6.174:9101/api/Lookupsurveys";
const Delete_SURVEY_API_URL = "http://10.5.6.174:9101/api/Deletesurveys";

const SurveyForm = () => {
  const { user, setUser } =useUser(); // 使用 UserContext
  const [questions, setQuestions] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);
  const [localIP, setLocalIP] = useState(null);
  const navigate = useNavigate();
  const [surveyTemplates, setSurveyTemplates] = useState([]);

  useEffect(() => {
    getLocalIP();
    fetchSurveyTemplates();
  }, []);

  useEffect(() => {
    if (localIP) {
      fetchADUser();
    }
  }, [localIP]); // 當 localIP 變更時才執行 fetchADUser()

  const fetchADUser = async () => {

    try {
      if (localIP.startsWith("192.168.")) { //// 本機測試用
        console.log("✅ 本機測試成功:", user, ',', localIP);
        //setAdUser(user);
        setIsValidUser(true);
      }
      else {
        const response = await axios.get(`/api/AD/new_emp_chk?acct=${user}`, {
          headers: { "X-Api-Key": "admin" }
        });
        //console.log(response);  
        if (response.status === 200) {
          if (response.data.StatusCode === 409 && response.data.Data.detail === "AD Account Conflict.") {
            console.log("✅ AD 驗證成功:", response.data);
            //setAdUser(user);
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
      { id: uuidv4(), text: "", type: "single", options: [""] }
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
      user,
      surveyId
    };
    // 將問卷資料存入 sessionStorage
    sessionStorage.setItem("surveyPreview", JSON.stringify(surveyData));

    // 開啟新分頁
    //window.open(`/survey-preview?id=${surveyId}`, '_blank');
    navigate(`/survey-preview?id=${surveyId}`);
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

  const handleLogout = () => {
    localStorage.clear(); // 清除所有 localStorage 資料    
    window.location.replace("/"); // 強制跳轉，防止返回

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

  // 取得問卷模板列表
  const fetchSurveyTemplates = async () => {
    try {
      const response = await axios.get(SURVEY_API_URL);
      //console.log(response);
      if (response.status === 200) {
        setSurveyTemplates(response.data);
      }
    } catch (error) {
      console.error("❌ 無法載入問卷模板:", error);
    }
  };

  // 新增刪除模板的邏輯
  /*const deleteSurveyTemplate = async (surveyId) => {
   try {
     const response = await axios.delete(`${Delete_SURVEY_API_URL}/${surveyId}`);
     if (response.status === 200) {
       console.log("問卷模板已成功刪除:", surveyId);
       alert("問卷模板已成功刪除！");
       // 從本地狀態中移除已刪除的模板
       setSurveyTemplates(surveyTemplates.filter((template) => template.surveyid !== surveyId));
     }
   } catch (error) {
     console.error("❌ 刪除問卷模板失敗:", error);
     alert("刪除問卷模板失敗！");
   }
 };
*/
  const handleDeleteSurveyTemplate = (surveyId) => {
    // 顯示確認對話框
    const isConfirmed = window.confirm("您確定要刪除這個問卷模板嗎？這個操作無法復原！");

    if (isConfirmed) {
      // 發送刪除請求到後端
      fetch(`${Delete_SURVEY_API_URL}/${surveyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("刪除問卷模板時出現錯誤");
          }
          return response.json();
        })
        .then(data => {
          console.log("問卷模板已成功刪除:", data);
          alert(`問卷模板 ID: ${surveyId} 已成功刪除！`);

          // 重新載入問卷模板列表
          fetchSurveyTemplates();
        })
        .catch(error => {
          console.error("刪除問卷模板時出錯:", error);
          alert("刪除問卷模板失敗！請稍後再試");
        });
    } else {
      console.log("取消刪除操作");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-96 bg-white">
      <p className="text-sm text-gray-600">IP: {localIP || "NA..."}</p>
      <p className="text-sm text-gray-600">AD 使用者: {user || "載入中..."}</p>
      <p className="text-sm text-gray-600">驗證狀態: {isValidUser ? "✅ 驗證成功" : "❌ 驗證失敗"}</p>

      {/* 現有問卷模板列表 */}
      <div className="mt-6">
        <h3 className="text-lg font-bold">📋 現有問卷模板</h3>
        {surveyTemplates.length === 0 ? (
          <p className="text-gray-500">目前沒有任何問卷模板。</p>
        ) : (
          surveyTemplates.map((template) => (
            <div key={template.surveyid} className="border-b mb-2 pb-2">
              <p className="font-semibold">{template.title}</p>
              <button
                onClick={() => handleRelease(template.surveyid)}
                className="text-blue-500 hover:text-blue-700"
              >
                查看問卷
              </button>
              {/* 刪除問卷模板 */}
              <button
                onClick={() => handleDeleteSurveyTemplate(template.surveyid)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                刪除
              </button>
            </div>
          ))
        )}
      </div>

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
        <button className="bg-red-500 text-white px-3 py-1 rounded mt-2" onClick={handleLogout}>
          登出
        </button>


      </div>
    </div>
  );
};
export default SurveyForm;