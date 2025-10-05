import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { BarChart2, LogIn, Settings } from "lucide-react";
import logo from "../assets/dashrank-logo.webp";
import { useAuth } from "../contexts/AuthContext.jsx";
import StatsViewer from "./StatsViewer";
import SettingsMenu from "./SettingsMenu";

export default function Tabs() {
  const { user } = useAuth();
  const [isStatsViewerOpen, setIsStatsViewerOpen] = useState(false);

  return (
    <>
      <header className="relative bg-white dark:bg-gray-900 shadow-lg z-30 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Side: Logo and Title */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="TLL List Logo" className="w-8 h-8" />
              <div>
                <span className="font-bold text-xl text-cyan-600 dark:text-cyan-400">TLL List</span>
              </div>
            </Link>
          </div>

          {/* Center: Main Navigation */}
          <nav className="flex-1 flex justify-center">
             <NavLink
                to="/"
                className={({ isActive }) => `px-4 py-2 rounded-md font-semibold transition-colors text-sm whitespace-nowrap flex items-center gap-2 ${isActive ? "bg-cyan-600 text-white" : "text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-700/50"}`}
              >
                The List
              </NavLink>
          </nav>

          {/* Right Side: Actions */}
          <div className="flex-1 flex justify-end items-center gap-2">
            <button 
              title="TLL Stats Viewer" 
              onClick={() => setIsStatsViewerOpen(true)} 
              className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors text-sm"
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden md:inline">TLL Stats Viewer</span>
            </button>
            
            {user ? (
              <SettingsMenu />
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors text-sm">
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}
          </div>
        </div>
      </header>
      {isStatsViewerOpen && <StatsViewer listType="tll" onClose={() => setIsStatsViewerOpen(false)} title="TLL Stats Viewer"/>}
    </>
  );
}