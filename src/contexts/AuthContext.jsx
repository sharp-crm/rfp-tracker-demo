import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      const user = authService.getCurrentUser();
      const authStatus = authService.checkAuthStatus();
      
      setCurrentUser(user);
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (email, password) => {
    const success = authService.login(email, password);
    
    if (success) {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    
    return success;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (updates) => {
    if (currentUser) {
      const success = authService.updateProfile(currentUser.id, updates);
      if (success) {
        const updatedUser = authService.getCurrentUser();
        setCurrentUser(updatedUser);
      }
      return success;
    }
    return false;
  };

  const hasPermission = (permission) => {
    return authService.hasPermission(permission);
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUserProfile,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 