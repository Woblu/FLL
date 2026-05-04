import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { DEFAULT_NAV_LIST_IDS } from '../config/lists';
import { loadNavbarPrefs, saveNavbarPrefs } from '../utils/navbarPrefs';

const NavbarPrefsContext = createContext(null);

export function NavbarPrefsProvider({ children }) {
  const [navListIds, setNavListIds] = useState(() => {
    const stored = loadNavbarPrefs();
    const ids = stored?.navListIds;
    return Array.isArray(ids) && ids.length > 0 ? ids : DEFAULT_NAV_LIST_IDS;
  });

  useEffect(() => {
    saveNavbarPrefs({ navListIds });
  }, [navListIds]);

  const resetNavListIds = useCallback(() => {
    setNavListIds(DEFAULT_NAV_LIST_IDS);
  }, []);

  const value = useMemo(
    () => ({ navListIds, setNavListIds, resetNavListIds }),
    [navListIds, resetNavListIds],
  );

  return (
    <NavbarPrefsContext.Provider value={value}>
      {children}
    </NavbarPrefsContext.Provider>
  );
}

export function useNavbarPrefs() {
  const ctx = useContext(NavbarPrefsContext);
  if (!ctx) {
    throw new Error('useNavbarPrefs must be used within a NavbarPrefsProvider');
  }
  return ctx;
}

