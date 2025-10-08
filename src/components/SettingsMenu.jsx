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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-brand-purple/50 dark:bg-fll-dark border border-brand-purple hover:bg-brand-purple/80 hover:border-fll-pink transition-all duration-300 text-sm text-white"
        aria-label="Settings and user menu"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-fll-dark/90 backdrop-blur-md border border-brand-purple rounded-lg shadow-2xl py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-300 border-b border-brand-purple/50">
            Signed in as <strong>{user.username}</strong>
          </div>
          <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-300">
            <span>{t('darkMode')}</span>
            <ThemeToggle />
          </div>
          <div className="border-t border-brand-purple/50 my-1"></div>
          <Link to="/account" onClick={() => setIsOpen(false)} className="flex items-center w-full gap-3 px-4 py-2 text-gray-300 hover:bg-brand-purple/50 transition-colors text-sm">
            <User className="w-4 h-4" /> {t('myAccount')}
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center w-full gap-3 px-4 py-2 text-gray-300 hover:bg-brand-purple/50 transition-colors text-sm">
              <LayoutDashboard className="w-4 h-4" /> {t('adminDashboard')}
            </Link>
          )}
          <div className="border-t border-brand-purple/50 my-1"></div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/20 transition-colors">
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}