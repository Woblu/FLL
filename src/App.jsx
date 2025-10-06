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

// Assets
import sideDeco from "./assets/c9b562fc33dfe9e93230abab38e1ef32.webp";

export default function App() {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-fllDark text-gray-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fllPurple/20 to-fllDark flex flex-col overflow-x-hidden">
        <div 
          className="hidden lg:block absolute left-0 top-0 h-full w-32 xl:w-48 opacity-10 z-10"
          style={{ backgroundImage: `url(${sideDeco})`, backgroundRepeat: "repeat-y", backgroundPosition: "0px -1.5rem", transform: "scaleX(-1)" }}
        ></div>
        
        <Tabs />

        <main className="flex-grow p-4 w-full max-w-7xl mx-auto z-20">
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

        <div 
          className="hidden lg:block absolute right-0 top-0 h-full w-32 xl:w-48 opacity-10 z-10"
          style={{ backgroundImage: `url(${sideDeco})`, backgroundRepeat: "repeat-y", backgroundPosition: "0px -1.5rem" }}
        ></div>
        
        <ReloadPrompt />
      </div>
    </LanguageProvider>
  );
}