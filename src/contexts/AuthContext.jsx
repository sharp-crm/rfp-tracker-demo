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
    // Initialize authentication state
    const initializeAuth = async () => {
      try {
        const success = await authService.initializeAuth();
        if (success) {
          const user = authService.getCurrentUser();
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((isAuth, user) => {
      setCurrentUser(user);
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const result = await authService.signIn(email, password);
      
      if (result.success) {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setIsLoading(true);
      const result = await authService.signUp(email, password, userData);
      
      if (result.success) {
        return { success: true, message: 'Account created successfully. Please check your email for verification.' };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (updates) => {
    if (currentUser) {
      try {
        const result = await authService.updateProfile(currentUser.id, updates);
        if (result.success) {
          const updatedUser = authService.getCurrentUser();
          setCurrentUser(updatedUser);
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'No user logged in' };
  };

  const hasPermission = (permission) => {
    return authService.hasPermission(permission);
  };

  const getAllUsers = async () => {
    try {
      const result = await authService.getAllUsers();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    signUp,
    logout,
    updateUserProfile,
    hasPermission,
    getAllUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 