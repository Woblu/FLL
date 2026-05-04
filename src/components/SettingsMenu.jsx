/**
 * @fileoverview Settings menu dropdown component.
 * Provides access to account, admin panel, guidelines, credits, theme, and language settings.
 * 
 * @module SettingsMenu
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, User, Shield, BookText, Palette, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

/**
 * Valid theme values
 */
const VALID_THEMES = ['cyan', 'mono'];

/**
 * Valid language codes
 */
const VALID_LANGUAGES = ['en', 'es', 'ko', 'ru'];

/**
 * Validates theme value
 * @param {string} theme - Theme to validate
 * @returns {string} Valid theme or default
 */
function validateTheme(theme) {
  // Migrate cyan-light to cyan if user has it stored
  if (theme === 'cyan-light') {
    return 'cyan';
  }
  return VALID_THEMES.includes(theme) ? theme : 'cyan';
}

/**
 * Validates language code
 * @param {string} lang - Language to validate
 * @returns {string} Valid language or default
 */
function validateLanguage(lang) {
  return VALID_LANGUAGES.includes(lang) ? lang : 'en';
}

/**
 * Settings menu component
 * @returns {JSX.Element} Settings menu JSX
 */
export default function SettingsMenu() {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const isMountedRef = useRef(true);
  const menuRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return validateTheme(stored);
  });

  // Apply theme
  useEffect(() => {
    if (!isMountedRef.current) return;

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (
        isMountedRef.current &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handlers
  const handleToggle = useCallback(() => {
    if (isMountedRef.current) {
      setIsOpen(prev => !prev);
    }
  }, []);

  const handleClose = useCallback(() => {
    if (isMountedRef.current) {
      setIsOpen(false);
    }
  }, []);

  const handleThemeChange = useCallback((e) => {
    if (isMountedRef.current) {
      const newTheme = validateTheme(e.target.value);
      setTheme(newTheme);
    }
  }, []);

  const handleLanguageChange = useCallback((e) => {
    if (isMountedRef.current && setLanguage) {
      const newLang = validateLanguage(e.target.value);
      setLanguage(newLang);
    }
  }, [setLanguage]);

  // Check if user is admin/moderator
  const isAdminOrMod = user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  return (
    <div className="relative" ref={menuRef}>
      <button
        title={t('settings') || 'Settings'}
        onClick={handleToggle}
        className="p-2 rounded-md font-semibold bg-button-bg text-text-primary hover:bg-accent/10 transition-colors"
        aria-label={t('settings') || 'Settings'}
        aria-expanded={isOpen}
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-primary-bg rounded-lg shadow-xl border border-primary-bg z-[70] overflow-hidden">
          <div className="bg-ui-bg p-4 space-y-4">
            {/* Admin Panel Link */}
            {isAdminOrMod && (
              <>
                <Link
                  to="/admin"
                  onClick={handleClose}
                  className="flex items-center gap-3 text-text-on-ui font-semibold hover:text-accent transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  <span>{t('admin_panel') || 'Admin Panel'}</span>
                </Link>
                <hr className="border-primary-bg my-2" />
              </>
            )}

            {/* Account Link */}
            {user && (
              <>
                <Link
                  to="/account"
                  onClick={handleClose}
                  className="flex items-center gap-3 text-text-on-ui font-semibold hover:text-accent transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{t('my_account') || 'My Account'}</span>
                </Link>
                <hr className="border-primary-bg my-2" />
              </>
            )}

            {/* Guidelines Link */}
            <Link
              to="/guidelines"
              onClick={handleClose}
              className="flex items-center gap-3 text-text-on-ui font-semibold hover:text-accent transition-colors"
            >
              <BookText className="w-5 h-5" />
              <span>{t('guidelines') || 'Guidelines'}</span>
            </Link>

            {/* Credits Link */}
            <Link
              to="/credits"
              onClick={handleClose}
              className="flex items-center gap-3 text-text-on-ui font-semibold hover:text-accent transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>{t('credits') || 'Credits'}</span>
            </Link>

            <hr className="border-primary-bg my-2" />

            {/* Theme Selector */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-text-on-ui font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t('theme') || 'Theme'}
              </span>
              <select
                value={theme}
                onChange={handleThemeChange}
                className="bg-primary-bg text-text-primary rounded-md p-1 border border-ui-bg focus:outline-none focus:ring-1 focus:ring-accent max-w-[140px]"
              >
                <option value="cyan">Default (Dark)</option>
                <option value="mono">Mono (Dark)</option>
              </select>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-text-on-ui font-semibold">
                {t('language') || 'Language'}
              </span>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-primary-bg text-text-primary rounded-md p-1 border border-ui-bg focus:outline-none focus:ring-1 focus:ring-accent max-w-[140px]"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="ko">한국어</option>
                <option value="ru">Русский</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
