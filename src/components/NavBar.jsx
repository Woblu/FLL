/**
 * @fileoverview Global navigation bar component with tabs, settings, stats viewer, and user menu.
 * Appears on all pages. Handles desktop and mobile navigation with proper cleanup and event handling.
 * * @module NavBar
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { BarChart2, LogIn, UserPlus, Menu, X, Upload } from 'lucide-react';
import logo from '../assets/dashrank-logo.webp';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import StatsViewer from './StatsViewer';
import SettingsMenu from './SettingsMenu';
import { LIST_BY_ID, DEFAULT_NAV_LIST_IDS, isStatsViewerListType } from '../config/lists';
import { useNavbarPrefs } from '../contexts/NavbarPrefsContext.jsx';

/**
 * Global navigation bar component
 * Displays tabs, settings, stats viewer, and user menu
 * @returns {JSX.Element} Navigation bar JSX
 */
export default function NavBar() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { navListIds } = useNavbarPrefs();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const isMountedRef = useRef(true);

  // State management
  const [isStatsViewerOpen, setIsStatsViewerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize list type from localStorage or default to 'main'
  const [listType, setListType] = useState(() => {
    const stored = localStorage.getItem('lastViewedList');
    return stored && isStatsViewerListType(stored) ? stored : 'fll';
  });

  // Memoize stats button titles
  const statsButtonTitles = useMemo(() => ({
    main: t('main_stats_viewer'),
    fll: t('main_stats_viewer'),
    unrated: t('unrated_stats_viewer'),
    platformer: t('platformer_stats_viewer'),
    challenge: t('challenge_stats_viewer'),
    speedhack: t('speedhack_stats_viewer'),
    ddl: t('ddl_stats_viewer'),
    hdl: t('hdl_stats_viewer') || 'HDL Stats Viewer',
    future: t('future_stats_viewer'),
    '10sll': t('ten_second_levels_stats_viewer'),
    ill: t('impossible_levels_stats_viewer')
  }), [t]);

  // Memoize navigation tabs (mix-and-match via NavbarPrefsContext → localStorage)
  const tabs = useMemo(() => {
    const enabledIds = Array.isArray(navListIds) ? navListIds : DEFAULT_NAV_LIST_IDS;
    const enabledSet = new Set(enabledIds);
    const ordered = enabledIds.filter((id) => enabledSet.has(id) && LIST_BY_ID[id]);

    const listTabs = ordered.map((id) => {
      const l = LIST_BY_ID[id];
      const path = id === 'fll' ? '/' : `/${l.id}`;
      return { name: t(l.navLabelKey) || l.pageTitle, path, end: path === '/' };
    });

    return listTabs;
  }, [t, navListIds]);

  // Update list type based on current route
  useEffect(() => {
    if (!isMountedRef.current) return;

    const onFllHome = location.pathname === '/' || location.pathname === '';
    const currentPathSegment = onFllHome
      ? 'fll'
      : (location.pathname.split('/')[1] || 'main');
    if (isStatsViewerListType(currentPathSegment)) {
      setListType(currentPathSegment);
      localStorage.setItem('lastViewedList', currentPathSegment);
    } else {
      // Keep stats viewer listType valid even if user is on non-stats pages (e.g. 10sll)
      // by not overwriting listType.
    }
  }, [location.pathname]);

  // Handle click outside mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handleClickOutside(event) {
      if (isMountedRef.current &&
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoized auth buttons component
  const AuthButtons = useMemo(() => {
    if (user) return null;

    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-button-bg text-text-primary hover:bg-accent/10 transition-colors text-sm whitespace-nowrap"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">{t('login')}</span>
        </Link>
        <Link
          to="/register"
          className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-accent text-text-on-ui hover:opacity-90 transition-colors text-sm whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">{t('register')}</span>
        </Link>
      </div>
    );
  }, [user, t]);

  // Handlers
  const handleStatsViewerOpen = useCallback(() => {
    if (isMountedRef.current) {
      setIsStatsViewerOpen(true);
    }
  }, []);

  const handleStatsViewerClose = useCallback(() => {
    if (isMountedRef.current) {
      setIsStatsViewerOpen(false);
    }
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    if (isMountedRef.current) {
      setIsMobileMenuOpen(prev => !prev);
    }
  }, []);

  const handleMobileNavClick = useCallback(() => {
    if (isMountedRef.current) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  // Get current stats title
  const currentStatsTitle = statsButtonTitles[listType] || statsButtonTitles.fll;

  return (
    <>
      <header className="relative bg-header-bg shadow-lg z-[60] border-b border-primary-bg sticky top-0 overflow-x-clip">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 py-2.5">
          {/* Logo */}
          <div className="flex justify-start min-w-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative h-12 w-28 shrink-0 overflow-visible">
                <img
                  src={logo}
                  alt="The FLL"
                  className="absolute left-0 top-1/2 h-24 w-auto max-w-none -translate-y-1/2 object-contain object-left transition-transform duration-200 group-hover:scale-105 origin-left"
                />
              </div>
              <span className="block font-bold text-xl text-accent leading-tight tracking-tight group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] transition-shadow">
                The FLL
                <span className="ml-2 text-xs font-mono text-text-muted">v1.0</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation — centered in the header row */}
          <nav className="hidden md:flex justify-center overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max px-1">
              {tabs.map((tab) => (
                <NavLink
                  key={`${tab.path}-${tab.name}`}
                  to={tab.path}
                  end={tab.end === true}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md font-semibold transition-colors text-sm whitespace-nowrap flex items-center gap-2 ${
                      isActive ? 'bg-accent text-text-on-ui' : 'text-accent hover:bg-accent/20'
                    }`
                  }
                >
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  {tab.name}
                </NavLink>
              ))}
              {user && (
                <NavLink
                  to={`/submit/${listType}`}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md font-semibold transition-colors text-sm whitespace-nowrap flex items-center gap-2 ${
                      isActive ? 'bg-accent text-text-on-ui' : 'text-accent hover:bg-accent/20'
                    }`
                  }
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden lg:inline">Submit {listType.toUpperCase()} level</span>
                  <span className="lg:hidden">Submit</span>
                </NavLink>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex justify-end items-center gap-2 min-w-0">
            <button
              title={currentStatsTitle}
              onClick={handleStatsViewerOpen}
              className="flex items-center gap-2 px-3 py-2 rounded-md font-semibold bg-button-bg text-text-primary hover:bg-accent/10 transition-colors text-sm"
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden lg:inline">{currentStatsTitle}</span>
            </button>

            {user ? <SettingsMenu /> : AuthButtons}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden ml-1">
              <button
                onClick={handleMobileMenuToggle}
                className="p-2 rounded-md bg-button-bg text-text-primary hover:bg-accent/10 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden bg-primary-bg border-b border-primary-bg shadow-lg absolute w-full z-[60]"
          >
            <div className="bg-header-bg w-full h-full">
              <div className="px-4 py-3 space-y-2">
                {tabs.map((tab) => (
                  <NavLink
                    key={`${tab.path}-${tab.name}`}
                    to={tab.path}
                    end={tab.end === true}
                    onClick={handleMobileNavClick}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md font-semibold transition-colors text-sm flex items-center gap-2 ${
                        isActive ? 'bg-accent text-text-on-ui' : 'text-accent hover:bg-accent/20'
                      }`
                    }
                  >
                    {tab.icon && <tab.icon className="w-4 h-4" />}
                    {tab.name}
                  </NavLink>
                ))}
                {user && (
                  <NavLink
                    to={`/submit/${listType}`}
                    onClick={handleMobileNavClick}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md font-semibold transition-colors text-sm flex items-center gap-2 ${
                        isActive ? 'bg-accent text-text-on-ui' : 'text-accent hover:bg-accent/20'
                      }`
                    }
                  >
                    <Upload className="w-4 h-4" />
                    Submit {listType.toUpperCase()} level
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      {isStatsViewerOpen && (
        <StatsViewer
          listType={listType}
          onClose={handleStatsViewerClose}
          title={currentStatsTitle}
        />
      )}
    </>
  );
}
