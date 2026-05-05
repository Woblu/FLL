/**
 * @fileoverview Main application component.
 * Defines all routes and application layout structure.
 * Handles conditional rendering of layout decorations based on route.
 * * @module App
 */

import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import LevelDetail from "./pages/LevelDetail";
import PlayerProfile from "./pages/PlayerProfile";
import PlayerList from "./components/PlayerList";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./components/RegisterPage";
import NavBar from "./components/NavBar";
import sideDeco from "./assets/c9b562fc33dfe9e93230abab38e1ef32.webp";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ListPagesAtmosphere from './components/ListPagesAtmosphere';
import LoadingSpinner from "./components/LoadingSpinner";

const AccountPage = lazy(() => import("./pages/AccountPage"));
const ProfileSettingsPage = lazy(() => import("./pages/account/ProfileSettingsPage"));
const FriendsPage = lazy(() => import("./pages/account/FriendsPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminReportsPage = lazy(() => import("./pages/AdminReportsPage"));
const PersonalRecordDetail = lazy(() => import("./pages/PersonalRecordDetail"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const CreateLayoutPage = lazy(() => import("./pages/layouts/CreateLayoutPage"));
const LayoutDetailPage = lazy(() => import("./pages/layouts/LayoutDetailPage"));
const SubmitLevelPage = lazy(() => import("./pages/SubmitLevelPage"));

const RouteFallback = () => <LoadingSpinner message="Loading..." />;

/**
 * Application layout wrapper component
 * Conditionally renders layout decorations (side decorations and tabs) based on route
 * * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child routes to render
 * @returns {JSX.Element} Layout wrapper JSX
 */
const AppLayout = ({ children }) => {
  const location = useLocation();

  // Level detail uses AREDL-style full-bleed art + translucent overlays — hide atmosphere
  // so grids/glows do not show through the level image.
  const isLevelDetailPage = location.pathname.startsWith('/level/');

  return (
    // 'relative' anchors absolute atmosphere + side decorations to this column
    <div className="relative min-h-screen text-text-primary flex flex-col overflow-x-hidden">
      {!isLevelDetailPage && <ListPagesAtmosphere />}
      {/*
        Match list/home edge tones behind the semi-transparent side art: full atmosphere is omitted
        on level detail so the HDL backdrop stays clean; vignette-only keeps strip perceived opacity aligned.
      */}
      {isLevelDetailPage && (
        <div className="pointer-events-none absolute inset-0 z-[10] overflow-hidden" aria-hidden>
          <div className="list-pages-atmosphere-vignette absolute inset-0" />
        </div>
      )}

      {/* LEFT SIDE DECORATION - z-50 */}
      <div
        className="hidden lg:block absolute left-0 top-0 bottom-0 w-32 xl:w-48 opacity-[0.38] z-50 pointer-events-none"
        style={{ 
            backgroundImage: `url(${sideDeco})`, 
            backgroundRepeat: "repeat-y", 
            backgroundPosition: "0px -1.5rem", 
            transform: "scaleX(-1)" // Mirror image for left side
        }}
      ></div>

      {/* MAIN CONTENT LAYER - z-20 sits below the decorations */}
      <main id="main-content" className="relative z-20 flex-grow p-4 w-full max-w-7xl mx-auto" tabIndex={-1}>
        {children}
      </main>

      {/* RIGHT SIDE DECORATION - z-50 */}
      <div
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-32 xl:w-48 opacity-[0.38] z-50 pointer-events-none"
        style={{ 
            backgroundImage: `url(${sideDeco})`, 
            backgroundRepeat: "repeat-y", 
            backgroundPosition: "0px -1.5rem" 
        }}
      ></div>
      

    </div>
  );
};

/**
 * Main application component
 * Defines all application routes and their corresponding components
 * NavBar on all pages; main content in AppLayout (with atmosphere on list-style routes)
 * * @returns {JSX.Element} Application JSX
 */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-primary-bg text-text-primary">
      {/* Skip link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-text-on-ui focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg focus:ring-accent focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:[clip:auto]"
      >
        Skip to main content
      </a>
        {/* Full chrome only when not in maintenance */}
        <NavBar />

        <AppLayout>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Redirect root to main list */}
            <Route path="/" element={<Home />} />
            <Route path="/fll" element={<Navigate to="/" replace />} />

            <Route
              path="/submit/:listType"
              element={
                <ProtectedRoute>
                  <SubmitLevelPage />
                </ProtectedRoute>
              }
            />

          {/* 404 - before /:listType so "404" is not treated as listType */}
          
          {/* Main public lists */}
          <Route path="/:listType" element={<Home />} />
          <Route path="/level/:listType/:levelId" element={<LevelDetail />} />                
          <Route path="/players" element={<PlayerList />} />
          {/*
            List-scoped profile first so /players/main/zoink is not captured as playerName="main".
            Hub at /players/:playerName lists links to each list the player has data on.
          */}
          <Route path="/players/:listType/:playerName" element={<PlayerProfile />} />
          <Route path="/players/:playerName" element={<PlayerProfile />} />
         
          
          {/* User-specific routes (require authentication) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/progression" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/progression/:recordId" element={<ProtectedRoute><PersonalRecordDetail /></ProtectedRoute>} />
          <Route path="/u/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          

                   {/* Account management routes (require authentication) */}
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileSettingsPage />} />
            <Route path="friends" element={<FriendsPage />} />
          </Route>

          {/* Admin routes (require admin/moderator role) */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
            <Route index element={<div className="text-text-primary text-center"><h1>Welcome to the Admin Dashboard!</h1><p>Select a section to manage.</p></div>} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>

{/* Catch-all for unknown paths */}
<Route path="*" element={<Navigate to="/main" replace />} />
          </Routes>
          </Suspense>
        </AppLayout>



    </div>
  );
}