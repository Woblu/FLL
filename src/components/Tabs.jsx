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

  // NavLink styles now focus on brightness/opacity for the active state
  const navLinkClasses = ({ isActive }) => 
    `px-4 py-2 rounded-md font-semibold transition-all duration-300 text-sm whitespace-nowrap flex items-center gap-2
    ${isActive 
      ? "text-white scale-105" 
      : "text-gray-300 hover:text-white"
    }`;

  return (
    <>
      <header className="sticky top-0 bg-gd-black/80 backdrop-blur-md z-30 border-b border-gd-purple">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          {/* Left Side: Logo and Title */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="FLL Logo" className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <span className="font-bold text-xl transition-all duration-300">The FLL</span>
              </div>
            </Link>
          </div>

          {/* Center: Main Navigation */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
             <NavLink to="/" end className={navLinkClasses}>
                The FLL
              </NavLink>
            
            {user && (
              <NavLink to="/submit-level" className={navLinkClasses}>
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
              className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-gd-purple/50 border border-gd-purple hover:bg-gd-purple/80 hover:border-gd-pink text-white transition-all duration-300 text-sm"
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden md:inline">FLL Stats Viewer</span>
            </button>
            
            {user ? (
              <SettingsMenu />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-gd-purple/50 border border-gd-purple hover:bg-gd-purple/80 hover:border-gd-pink text-white transition-all duration-300 text-sm">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-gradient-to-r from-gd-pink to-cyan-500 text-white hover:opacity-90 transition-opacity hover:scale-105">
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