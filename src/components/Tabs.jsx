import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { BarChart2, LogIn, Settings, UserPlus, Upload } from "lucide-react";
import logo from "../assets/dashrank-logo.webp";
import { useAuth } from "../contexts/AuthContext.jsx";
import StatsViewer from "./StatsViewer";
import SettingsMenu from "./SettingsMenu";

export default function Tabs() {
  const { user } = useAuth();
  const [isStatsViewerOpen, setIsStatsViewerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 bg-fllDark/80 backdrop-blur-sm z-30 border-b border-fllPurple/50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Side: Logo and Title */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="FLL Logo" className="w-8 h-8" />
              <div>
                <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-fllPink to-fllCyan">The FLL</span>
              </div>
            </Link>
          </div>

          {/* Center: Main Navigation */}
          <nav className="flex-1 flex justify-center items-center gap-2">
             <NavLink
                to="/"
                className={({ isActive }) => `px-4 py-2 rounded-md font-semibold transition-colors text-sm whitespace-nowrap flex items-center gap-2 ${isActive ? "text-fllPink" : "text-fllWhite hover:text-fllPink"}`}
              >
                The FLL
              </NavLink>
            
            {user && (
              <NavLink
                to="/submit-level"
                className={({ isActive }) => `px-4 py-2 rounded-md font-semibold transition-colors text-sm whitespace-nowrap flex items-center gap-2 ${isActive ? "text-fllPink" : "text-fllWhite hover:text-fllPink"}`}
              >
                <Upload className="w-4 h-4" />
                Submit Level
              </NavLink>
            )}
          </nav>

          {/* Right Side: Actions */}
          <div className="flex-1 flex justify-end items-center gap-2">
            <button 
              title="FLL Stats Viewer" 
              onClick={() => setIsStatsViewerOpen(true)} 
              className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-fllPurple/30 hover:bg-fllPurple/50 text-fllWhite transition-colors text-sm"
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden md:inline">FLL Stats Viewer</span>
            </button>
            
            {user ? (
              <SettingsMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-fllPurple/30 hover:bg-fllPurple/50 text-fllWhite transition-colors text-sm">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-gradient-to-r from-fllPink to-fllCyan text-white hover:opacity-90 transition-opacity text-sm">
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {isStatsViewerOpen && <StatsViewer listType="fll" onClose={() => setIsStatsViewerOpen(false)} title="FLL Stats Viewer"/>}
    </>
  );
}