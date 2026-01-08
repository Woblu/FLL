import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Initialize the navigate function

  // 3. Renamed to signOut and added navigation
  const signOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login'); // Redirects the user
  };

  // Alias for compatibility
  const logout = signOut;

  // Fetch user data from database to get latest role
  const fetchUserData = async (authToken) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      const response = await axios.get('/api/me');
      setUser({
        id: response.data.id,
        username: response.data.username,
        role: response.data.role,
      });
      return true;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // If token is invalid, clear it
      if (error.response?.status === 401) {
        signOut();
        return false;
      }
      // Fallback to JWT data if API call fails
      try {
        const decodedToken = jwtDecode(authToken);
        setUser({
          id: decodedToken.userId,
          username: decodedToken.username,
          role: decodedToken.role,
        });
        return true;
      } catch (decodeError) {
        console.error("Invalid token found, logging out.", decodeError);
        signOut();
        return false;
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            signOut();
            setLoading(false);
            return;
          }
          
          // Fetch user data from database to get latest role
          await fetchUserData(token);
        } catch (error) {
          console.error("Invalid token found, logging out.", error);
          signOut();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Refresh user data from database (useful when role is updated)
  const refreshUser = async () => {
    if (token) {
      await fetchUserData(token);
    }
  };

  // 4. Renamed to signOut to match the function name
  const value = { user, token, loading, login, signOut, logout, refreshUser };
  
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};