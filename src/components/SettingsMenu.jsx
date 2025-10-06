import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-gd-purple/50 border border-gd-purple hover:bg-gd-purple/80 hover:border-gd-pink text-gd-white transition-all duration-300 text-sm"
        aria-label="Settings and user menu"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden md:inline">{user?.username || 'User'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gd-black/90 backdrop-blur-md border border-gd-purple rounded-lg shadow-2xl shadow-gd-purple/30 py-1 z-50">
          <Link
            to="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center w-full gap-3 px-4 py-2 text-gd-white hover:text-gd-pink hover:bg-gd-purple/50 transition-colors text-sm"
          >
            <User className="w-4 h-4" /> {t('my_account')}
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full gap-3 px-4 py-2 text-gd-white hover:text-gd-pink hover:bg-gd-purple/50 transition-colors text-sm"
            >
              <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
            </Link>
          )}
          <div className="border-t border-gd-purple/50 my-1"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-semibold bg-gradient-to-r from-gd-pink to-gd-cyan text-white hover:opacity-90 transition-opacity"
          >
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}