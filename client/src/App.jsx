import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import ChatbotSurvey from './components/Chatbotsurveys';
import Dashboard from './components/Dashboard';
import Contactus from "./components/Contactus";
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomepageWrapper />} />
            <Route path="/survey" element={<ChatbotSurveyWrapper />} />
            <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/contact" element={<Contactus />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Wrappers to handle navigation logic
const HomepageWrapper = () => {
  const navigate = useNavigate();
  const startSurvey = () => navigate('/survey');
  return <Homepage onStartSurvey={startSurvey} />;
};

const ChatbotSurveyWrapper = () => {
  const navigate = useNavigate();
  const finishSurvey = () => navigate('/dashboard');
  return <ChatbotSurvey onComplete={finishSurvey} />;
};

export default App;
