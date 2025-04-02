import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { UserProvider } from './components/UserContext';  // 引入 UserProvider
import Layout from "./components/Layout"; // 新增 Layout
import Mainpage from "./components/Mainpage"; // 新增 indexpage
import SurveyPage from "./components/SurveyForm";
import LoginPage from "./components/LoginPage";
import SurveyPreview from "./components/SurveyPreview";
import SurveyRelease from "./components/SurveyRelease";
import SurveyCreate from "./components/SurveyCreate";
import Surveypending from "./components/Surveypending";
import SurveyCompleted from "./components/SurveyCompleted";
import SurveyAnswer  from "./components/SurveyAnswer";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route path="mainpage" element={<Mainpage />} />            
            <Route path="survey" element={<SurveyPage />} />
            <Route path="survey-pending" element={<Surveypending />} />           
            <Route path="survey-preview" element={<SurveyPreview />} />
            <Route path="survey-release" element={<SurveyRelease />} />
            <Route path="survey-create" element={<SurveyCreate />} />
            <Route path="survey-completed" element={<SurveyCompleted />} />
            <Route path="survey-answer" element={<SurveyAnswer />} />           
          </Route>
          
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
/*{ 404 頁面 }
          <Route path="*" element={"/"} />*/