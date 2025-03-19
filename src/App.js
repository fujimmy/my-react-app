import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import SurveyPage from "./components/SurveyForm"; // 確保路徑正確
import LoginPage from "./components/LoginPage";
import SurveyPreview from "./components/SurveyPreview";
import SurveyRelease from "./components/SurveyRelease";
import ProtectedRoute from "./components/ProtectedRoute";



function App() {
  const [user, setUser] = useState(null); // 存放登入者資訊

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />

        {/* 受保護的頁面（登入後才能進入） */}
        <Route element={<ProtectedRoute />}>
          <Route path="/survey" element={<SurveyPage user={user} />} />
          <Route path="/survey-preview" element={<SurveyPreview />} />
          <Route path="/survey-release" element={<SurveyRelease />} />
        </Route>

         {/* 404 頁面 */}
         <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
