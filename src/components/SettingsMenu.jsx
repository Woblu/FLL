import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle'; // Import the new ThemeToggle component

export default function SettingsMenu({ user, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleMyAccount = () => {
    onClose();
    navigate('/account');
  };

  const handleAdminDashboard = () => {
    onClose();
    navigate('/admin');
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-fllDark rounded-md shadow-lg py-1 z-50">
      <div className="block px-4 py-2 text-sm text-gray-300 border-b border-fllPurple/50">
        {user ? user.username : 'Guest'}
      </div>
      
      {/* --- NEW: Dark Mode Toggle --- */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-gray-300 text-sm">{t('darkMode')}</span>
        <ThemeToggle />
      </div>

      <button
        onClick={handleMyAccount}
        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-fllPurple"
      >
        {t('myAccount')}
      </button>

      {user?.isAdmin && (
        <button
          onClick={handleAdminDashboard}
          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-fllPurple"
        >
          {t('adminDashboard')}
        </button>
      )}

      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/20"
      >
        {t('logout')}
      </button>
    </div>
  );
}