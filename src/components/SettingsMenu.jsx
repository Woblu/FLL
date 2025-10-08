import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import ThemeToggle from './ThemeToggle.jsx';

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

  if (!user) return null;

  const buttonClasses = "flex items-center gap-2 px-3 py-2 rounded-md font-semibold border text-sm transition-all duration-300 bg-white dark:bg-ui-bg/50 border-gray-300 dark:border-accent/30 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-ui-bg/80 hover:border-gray-400 dark:hover:border-accent";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-label="Settings and user menu"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-ui-bg/90 backdrop-blur-md border border-gray-200 dark:border-accent/30 rounded-lg shadow-2xl py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-accent/50">
            Signed in as <strong>{user.username}</strong>
          </div>

          <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            <span>{t('darkMode')}</span>
            <ThemeToggle />
          </div>

          <div className="border-t border-gray-200 dark:border-accent/50 my-1"></div>

          <Link
            to="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-accent/50 transition-colors text-sm"
          >
            <User className="w-4 h-4" /> {t('myAccount')}
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-accent/50 transition-colors text-sm"
            >
              <LayoutDashboard className="w-4 h-4" /> {t('adminDashboard')}
            </Link>
          )}

          <div className="border-t border-gray-200 dark:border-accent/50 my-1"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}