import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import Layout Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Import Views
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ProfileView from './views/ProfileView';
import UserManagementView from './views/UserManagementView';

// ==========================================
// AXIOS BASE CONFIGURATION
// ==========================================
axios.defaults.baseURL = 'http://localhost:8080';

export default function App() {
  // ==========================================
  // GLOBAL STATE
  // ==========================================
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState('dashboard');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // ==========================================
  // AXIOS SECURITY INTERCEPTORS
  // ==========================================
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  // If user role restricts views, fallback
  useEffect(() => {
    if (user && view === 'users' && user.role !== 'ADMIN') {
      setView('dashboard');
    }
  }, [view, user]);

  // ==========================================
  // AUTHENTICATION ACTIONS
  // ==========================================
  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const sessionData = response.data;
      setUser(sessionData);
      localStorage.setItem('user_session', JSON.stringify(sessionData));
      setView('dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to authenticate. Please check your connection.';
      setAuthError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    setView('dashboard'); // reset to default view for next login
  };

  const updateSessionProfile = (updatedDetails) => {
    if (!user) return;
    const freshSession = {
      ...user,
      name: updatedDetails.name,
      email: updatedDetails.email,
      contactNumber: updatedDetails.contactNumber,
      ...(updatedDetails.role && { role: updatedDetails.role }),
      ...(updatedDetails.status && { status: updatedDetails.status }),
    };
    setUser(freshSession);
    localStorage.setItem('user_session', JSON.stringify(freshSession));
  };

  // If not authenticated, render Login view directly
  if (!user) {
    return (
      <LoginView
        onLogin={handleLogin}
        loading={authLoading}
        error={authError}
        setError={setAuthError}
      />
    );
  }

  // ==========================================
  // SECURE MAIN VIEW ROUTER
  // ==========================================
  return (
    <div className="app-container">
      {/* Sidebar Layout */}
      <Sidebar view={view} setView={setView} user={user} onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar view={view} user={user} />
        
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {view === 'dashboard' && <DashboardView user={user} setView={setView} />}
          {view === 'users' && user.role === 'ADMIN' && <UserManagementView />}
          {view === 'profile' && <ProfileView user={user} updateSessionProfile={updateSessionProfile} />}
        </main>
      </div>
    </div>
  );
}
