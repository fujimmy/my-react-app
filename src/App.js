import { BrowserRouter as Router, Routes, Route, Navigate , useNavigate} from "react-router-dom";
import React from "react";
import { UserProvider } from './components/UserContext';  // 引入 UserProvider
import Layout from "./components/Layout"; // 新增 Layout
import SurveyPage from "./components/SurveyForm"; 
import LoginPage from "./components/LoginPage";
import SurveyPreview from "./components/SurveyPreview";
import SurveyRelease from "./components/SurveyRelease";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* 受保護的頁面，嵌套在 Layout 內 */}
        
        <Route element={<ProtectedRoute/>}>        
          <Route
            path="/survey"
            element={
              <Layout>
                <SurveyPage/>
              </Layout>
            }
          />
          <Route
            path="/survey-preview"
            element={
              <Layout>
                <SurveyPreview />
              </Layout>
            }
          />
          <Route
            path="/survey-release"
            element={
              <Layout>
                <SurveyRelease />
              </Layout>
            }
          />
        </Route>

        {/* 404 頁面 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
