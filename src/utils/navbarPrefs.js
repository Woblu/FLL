const STORAGE_KEY = 'navbarPrefs';

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function loadNavbarPrefs() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== 'object') return null;
  return parsed;
}

export function saveNavbarPrefs(prefs) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs ?? {}));
}

