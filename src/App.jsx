import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import sideDeco from "./assets/c9b562fc33dfe9e93230abab38e1ef32.webp";
import Home from "./pages/Home";
import LevelDetail from "./pages/LevelDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./components/RegisterPage.jsx";
import AccountPage from "./pages/AccountPage";
import ProfileSettingsPage from './pages/account/ProfileSettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import GuidelinesPage from './pages/GuidelinesPage';
import SubmitLevelPage from './pages/SubmitLevelPage';
import Tabs from "./components/Tabs";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import ReloadPrompt from "./components/ReloadPrompt";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="relative min-h-screen flex flex-col overflow-x-hidden font-poppins">
          
          {/* Decorations are in the background layer */}
          <div 
            className="hidden lg:block absolute left-0 top-0 h-full w-32 xl:w-48 opacity-20 z-10 pointer-events-none"
            style={{ 
              backgroundImage: `url(${sideDeco})`, 
              transform: "scaleX(-1)" 
            }}
          ></div>
          <div 
            className="hidden lg:block absolute right-0 top-0 h-full w-32 xl:w-48 opacity-20 z-10 pointer-events-none"
            style={{ 
              backgroundImage: `url(${sideDeco})`
            }}
          ></div>

          {/* Header is given the highest z-index to ensure it and its children (the dropdown) are on top */}
          <div className="relative z-30">
            <Tabs />
          </div>

          {/* Main content sits in the middle layer */}
          <main className="relative z-20 flex-grow p-4 w-full max-w-7xl mx-auto">
            <Routes>
              {/* Core Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/:listType" element={<Home />} />
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
      </LanguageProvider>
    </ThemeProvider>
  );
}