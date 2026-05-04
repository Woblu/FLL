// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
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