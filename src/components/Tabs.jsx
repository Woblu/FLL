import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom"; // Import useLocation
import { BarChart2, LogIn, UserPlus, Upload } from "lucide-react";
import logo from "../assets/dashrank-logo.webp";
import { useAuth } from "../contexts/AuthContext.jsx";
import StatsViewer from "./StatsViewer";
import SettingsMenu from "./SettingsMenu";

export default function Tabs() {
  const { user } = useAuth();
  const location = useLocation(); // Get the current URL location
  const [isStatsViewerOpen, setIsStatsViewerOpen] = useState(false);

  // Determine the current list from the URL path
  const currentListType = location.pathname.startsWith('/hdl') ? 'hdl' : 'main';

  const navLinkClasses = ({ isActive }) => 
    `px-4 py-2 rounded-md font-semibold transition-all duration-300 text-sm whitespace-nowrap flex items-center gap-2
    ${isActive 
      ? "text-gray-900 dark:text-white scale-105" 
      : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    }`;
    
  const buttonClasses = "flex items-center gap-2 px-3 py-2 rounded-md font-semibold border text-sm transition-all duration-300 bg-white dark:bg-ui-bg/50 border-gray-300 dark:border-accent/30 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-ui-bg/80 hover:border-gray-400 dark:hover:border-accent";

  return (
    <>
      <header className="sticky top-0 bg-white/80 dark:bg-ui-bg/80 backdrop-blur-md z-30 border-b border-gray-200 dark:border-accent/30">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Side */}
          <div className="flex items-center gap-3 group">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="FLL Logo" className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">The FLL</span>
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-2">
             <NavLink to="/" end className={navLinkClasses}>
                FLL
              </NavLink>
             <NavLink to="/hdl" className={navLinkClasses}>
                HDL
              </NavLink>
            
            {user && (
              // This link is now dynamic
              <NavLink to={`/submit/${currentListType}`} className={navLinkClasses}>
                <Upload className="w-4 h-4" />
                Submit {currentListType.toUpperCase()} Level
              </NavLink>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* There is now only one Stats Viewer button */}
            <button 
              title={`${currentListType.toUpperCase()} Stats Viewer`}
              onClick={() => setIsStatsViewerOpen(true)} 
              className={buttonClasses}
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden md:inline">{currentListType.toUpperCase()} Stats</span>
            </button>
            
            {user ? (
              <SettingsMenu />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className={buttonClasses}>
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all hover:scale-105">
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* The StatsViewer modal is now dynamic */}
      {isStatsViewerOpen && <StatsViewer listType={currentListType} onClose={() => setIsStatsViewerOpen(false)} title={`${currentListType.toUpperCase()} Stats Viewer`}/>}
    </>
  );
}