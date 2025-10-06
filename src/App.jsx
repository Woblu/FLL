import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Core Pages
import Home from "./pages/Home";
import LevelDetail from "./pages/LevelDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./components/RegisterPage.jsx";
import AccountPage from "./pages/AccountPage";
import ProfileSettingsPage from './pages/account/ProfileSettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import GuidelinesPage from './pages/GuidelinesPage';
import SubmitLevelPage from './pages/SubmitLevelPage';

// Core Components
import Tabs from "./components/Tabs";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import ReloadPrompt from "./components/ReloadPrompt";

export default function App() {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-[#1a001a] text-white text-shadow-outline-purple flex flex-col overflow-x-hidden font-poppins">
        
        {/* Decorations are now children of the main dark container */}
        <div className="side-decoration left"></div>
        <div className="side-decoration right"></div>
        
        <Tabs />

        {/* Added padding here to create space for the decorations */}
        <main className="flex-grow p-4 pl-[300px] pr-[300px] w-full max-w-7xl mx-auto z-10">
          <Routes>
            {/* Core Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/level/:listType/:levelId" element={<LevelDetail />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected User Routes */}
            <Route path="/submit-level" element={<ProtectedRoute><SubmitLevelPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfileSettingsPage />} />
            </Route>

            {/* Protected Admin Route */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></Route>} />

          </Routes>
        </main>
        
        <ReloadPrompt />
      </div>
    </LanguageProvider>
  );
}