import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, LogOut, User, LayoutDashboard, Flag } from "lucide-react";
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-fllPurple/30 hover:bg-fllPurple/50 text-fllWhite transition-colors text-sm"
        aria-label="Settings and user menu"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden md:inline">{user?.username || 'User'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-fllDark/80 backdrop-blur-md border border-fllPurple/50 rounded-lg shadow-xl py-1 z-50">
          <Link
            to="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-fllWhite hover:text-fllPink hover:bg-fllPurple/30 transition-colors text-sm"
          >
            <User className="w-4 h-4" /> {t('my_account')}
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-fllWhite hover:text-fllPink hover:bg-fllPurple/30 transition-colors text-sm"
            >
              <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
            </Link>
          )}
          <div className="border-t border-fllPurple/50 my-1"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-semibold bg-gradient-to-r from-fllPink to-fllCyan text-white hover:opacity-90 transition-opacity"
          >
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}