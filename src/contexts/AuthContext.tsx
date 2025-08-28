import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AdminUser, LoginCredentials, AuthState } from '../types/Admin';
import { validateAdminCredentials } from '../utils/security';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AdminUser }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Generate a secure session token
const generateSessionToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate session token
const validateSessionToken = (token: string): boolean => {
  return Boolean(token && token.length === 64 && /^[a-f0-9]+$/i.test(token));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const sessionToken = localStorage.getItem('admin_session_token');
    const savedUser = localStorage.getItem('admin_user');
    
    if (sessionToken && savedUser && validateSessionToken(sessionToken)) {
      try {
        const user = JSON.parse(savedUser);
        // Check if session is not expired (24 hours)
        const sessionTime = localStorage.getItem('admin_session_time');
        if (sessionTime) {
          const sessionAge = Date.now() - parseInt(sessionTime);
          const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxSessionAge) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            return;
          }
        }
      } catch (error) {
        console.error('Invalid session data');
      }
    }
    
    // Clear invalid session data
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_session_time');
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      console.log('🔐 Attempting secure login...');
      
      // Add delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate credentials using secure hash comparison
      const isValid = await validateAdminCredentials(credentials.username, credentials.password);
      
      if (isValid) {
        const user: AdminUser = {
          id: '1',
          username: credentials.username,
          email: 'admin@jozefmarkt.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };

        // Generate secure session token
        const sessionToken = generateSessionToken();
        const sessionTime = Date.now().toString();

        // Store session data
        localStorage.setItem('admin_session_token', sessionToken);
        localStorage.setItem('admin_user', JSON.stringify(user));
        localStorage.setItem('admin_session_time', sessionTime);

        console.log('✅ Secure login successful!');
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        console.log('❌ Login failed - invalid credentials');
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.log('❌ Login error:', error);
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_session_time');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 