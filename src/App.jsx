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
      {/* Side decorations are fixed and sit on the edges of the viewport */}
      <div className="side-decoration left"></div>
      <div className="side-decoration right"></div>

      {/* The main content area is pushed to the center by the margins defined in index.css */}
      <div className="main-content-area">
        <div className="relative min-h-screen text-white text-shadow-outline-purple flex flex-col overflow-x-hidden font-poppins">
          
          <Tabs />

          <main className="flex-grow p-4 w-full max-w-7xl mx-auto z-10">
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
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            </Routes>
          </main>
          
          <ReloadPrompt />
        </div>
      </div>
    </LanguageProvider>
  );
}