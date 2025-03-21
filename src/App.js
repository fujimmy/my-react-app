import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { UserProvider } from './components/UserContext';  // 引入 UserProvider
import Layout from "./components/Layout"; // 新增 Layout
import SurveyPage from "./components/SurveyForm";
import LoginPage from "./components/LoginPage";
import SurveyPreview from "./components/SurveyPreview";
import SurveyRelease from "./components/SurveyRelease";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route path="survey" element={<SurveyPage />} />
            <Route path="survey-preview" element={<SurveyPreview />} />
            <Route path="survey-release" element={<SurveyRelease />} />
          </Route>
          
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
/*{ 404 頁面 }
          <Route path="*" element={"/"} />*/