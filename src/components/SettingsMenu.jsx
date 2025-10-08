import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM for portals
import { Link, useNavigate } from "react-router-dom";
import { Settings, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import ThemeToggle from './ThemeToggle.jsx';

// The Dropdown Menu as a separate component to be used in the Portal
const DropdownContent = ({ user, onClose, triggerRef }) => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  // Calculate position based on the trigger button
  const rect = triggerRef.current?.getBoundingClientRect();
  const style = {
    top: rect ? rect.bottom + 8 : 0, // 8px margin from the button
    right: rect ? window.innerWidth - rect.right - rect.width / 2 + 128 : 0, // Adjust to align
  };

  return (
    <div 
      style={style}
      className="fixed w-56 bg-fll-dark/90 backdrop-blur-md border border-brand-purple rounded-lg shadow-2xl py-1 z-[999]"
    >
      <div className="px-4 py-2 text-sm text-gray-300 border-b border-brand-purple/50">
        Signed in as <strong>{user.username}</strong>
      </div>
      <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-300">
        <span>{t('darkMode')}</span>
        <ThemeToggle />
      </div>
      <div className="border-t border-brand-purple/50 my-1"></div>
      <Link to="/account" onClick={onClose} className="flex items-center w-full gap-3 px-4 py-2 text-gray-300 hover:bg-brand-purple/50 transition-colors text-sm">
        <User className="w-4 h-4" /> {t('myAccount')}
      </Link>
      {user?.role === 'ADMIN' && (
        <Link to="/admin" onClick={onClose} className="flex items-center w-full gap-3 px-4 py-2 text-gray-300 hover:bg-brand-purple/50 transition-colors text-sm">
          <LayoutDashboard className="w-4 h-4" /> {t('adminDashboard')}
        </Link>
      )}
      <div className="border-t border-brand-purple/50 my-1"></div>
      <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/20 transition-colors">
        <LogOut className="w-4 h-4" /> {t('logout')}
      </button>
    </div>
  );
};


export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null); // Ref for the button
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  return (
    <>
      <button
        ref={buttonRef} // Attach ref to the button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-brand-purple/50 dark:bg-fll-dark border border-brand-purple hover:bg-brand-purple/80 hover:border-fll-pink transition-all duration-300 text-sm text-white"
        aria-label="Settings and user menu"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && ReactDOM.createPortal(
        <DropdownContent user={user} onClose={() => setIsOpen(false)} triggerRef={buttonRef} />,
        document.body // Render the dropdown into the document body
      )}
    </>
  );
}