import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import SurveyPage from "./components/SurveyForm"; // 確保路徑正確
import LoginPage from "./components/LoginPage";


function App() {
  const [user, setUser] = useState(null); // 存放登入者資訊

  return (    
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage setUser={setUser} />} />
      <Route path="/survey" element={<SurveyPage user={user} />} />
    </Routes>
  </Router>
  );
}

export default App;
