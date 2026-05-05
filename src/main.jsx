// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

// Older deployments registered a PWA service worker; it can keep serving stale index.html + hashed
// chunks (white screen / wrong nav) until a hard refresh. Unregister so normal reloads pick up new builds.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
}
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { NavbarPrefsProvider } from './contexts/NavbarPrefsContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The router should be at the top level */}
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <NavbarPrefsProvider>
            <App />
          </NavbarPrefsProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);