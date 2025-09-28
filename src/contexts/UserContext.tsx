import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import apiService from '../services/api';
import { errorHandler } from '../services/errorHandler';
import type { User, ApiResponse, BackendLoginResponse } from '../services/types';

// Extended user interface with groups and permissions
export interface ExtendedUser extends User {
  groups?: string[];
  permissions?: string[];
  isNew?: boolean;
  lastLogin?: string;
  profileComplete?: boolean;
}

export interface UserState {
  user: ExtendedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requiresPasswordChange: boolean;
}

export type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: ExtendedUser }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'SET_PASSWORD_CHANGE_REQUIRED'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<ExtendedUser> }
  | { type: 'CLEAR_ERROR' };

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  requiresPasswordChange: false,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requiresPasswordChange: action.payload.isNew || false,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    
    case 'SET_PASSWORD_CHANGE_REQUIRED':
      return {
        ...state,
        requiresPasswordChange: action.payload,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
}

export interface UserContextType {
  state: UserState;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; requiresPasswordChange?: boolean; message?: string }>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  updateUser: (updates: Partial<ExtendedUser>) => void;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasGroup: (group: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAnyGroup: (groups: string[]) => boolean;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Initialize user from stored data on mount
  useEffect(() => {
    const initializeUser = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const storedUser = apiService.getStoredUser();
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        
        if (storedUser && token && apiService.isAuthenticated()) {
          // Try to refresh user data from server
          try {
            const response = await apiService.getCurrentUser();
            const responseData = response.data as ApiResponse<ExtendedUser>;
            if (responseData.success && responseData.data) {
              const userData = responseData.data as ExtendedUser;
              dispatch({ type: 'SET_USER', payload: userData });
              // Update stored user data
              localStorage.setItem('user', JSON.stringify(userData));
            } else {
              // Use stored user data if server request fails
              dispatch({ type: 'SET_USER', payload: storedUser });
            }
          } catch (error) {
            // Use stored user data if server is unreachable
            dispatch({ type: 'SET_USER', payload: storedUser });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize user session' });
      }
    };

    initializeUser();
  }, []);

  // Listen for auth events
  useEffect(() => {
    const handleAuthEvents = (event: CustomEvent) => {
      switch (event.type) {
        case 'auth:unauthorized':
        case 'auth:logout':
          dispatch({ type: 'LOGOUT' });
          break;
        case 'auth:forbidden':
          dispatch({ type: 'SET_ERROR', payload: 'Access forbidden. You do not have permission to access this resource.' });
          break;
      }
    };

    window.addEventListener('auth:unauthorized', handleAuthEvents as EventListener);
    window.addEventListener('auth:logout', handleAuthEvents as EventListener);
    window.addEventListener('auth:forbidden', handleAuthEvents as EventListener);

    return () => {
      window.removeEventListener('auth:unauthorized', handleAuthEvents as EventListener);
      window.removeEventListener('auth:logout', handleAuthEvents as EventListener);
      window.removeEventListener('auth:forbidden', handleAuthEvents as EventListener);
    };
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await apiService.login(credentials);
      
      // Debug logging
      console.log('Login response:', response.data);
      
      // Use error handler to process the backend response
      const loginData = errorHandler.handleBackendResponse<BackendLoginResponse['data']>(
        response.data, 
        'Login'
      );
      
      if (!loginData) {
        throw new Error('Invalid login response data');
      }
      
      const { access, refresh, email, name, tenant_id, is_new, groups, permissions } = loginData;
      
      // Create user data in the format our app expects
      const userData: ExtendedUser = {
        id: tenant_id, // Using tenant_id as user id for now
        email,
        name,
        role: 'user', // Default role, can be enhanced later
        subdomain: tenant_id,
        groups: groups || [],
        permissions: permissions || [],
        isNew: is_new || false,
        lastLogin: new Date().toISOString(),
        profileComplete: true,
      };
      
      // Store auth tokens (using access token as the main token)
      apiService.setAuthToken(access);
      
      // Store refresh token separately
      localStorage.setItem('refresh_token', refresh);
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(userData));
      
      dispatch({ type: 'SET_USER', payload: userData });
      
      return {
        success: true,
        requiresPasswordChange: userData.isNew || false,
      };
    } catch (error: any) {
      // Error handling is now done by the error handler via toasts
      // Just return failure result without setting local error state
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await apiService.logout();
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expiration');
      
      dispatch({ type: 'LOGOUT' });
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await apiService.post('/users/change-password', {
        currentPassword,
        newPassword,
      });

      // Use error handler to process the response
      errorHandler.handleBackendResponse(response.data, 'Change Password');
      
      // If we get here, the request was successful
      // Update user to no longer be new
      if (state.user) {
        const updatedUser = { ...state.user, isNew: false };
        dispatch({ type: 'UPDATE_USER', payload: { isNew: false } });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      dispatch({ type: 'SET_PASSWORD_CHANGE_REQUIRED', payload: false });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error: any) {
      // Error handling is now done by the error handler via toasts
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, message: 'Failed to change password' };
    }
  };

  const updateUser = (updates: Partial<ExtendedUser>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    
    // Update stored user data
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    if (!apiService.isAuthenticated()) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiService.getCurrentUser();
      const responseData = response.data as ApiResponse<ExtendedUser>;
      if (responseData.success && responseData.data) {
        const userData = responseData.data as ExtendedUser;
        dispatch({ type: 'SET_USER', payload: userData });
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Don't set error state for refresh failures
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const hasPermission = (permission: string): boolean => {
    return state.user?.permissions?.includes(permission) || false;
  };

  const hasGroup = (group: string): boolean => {
    return state.user?.groups?.includes(group) || false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!state.user?.permissions) return false;
    return permissions.some(permission => state.user!.permissions!.includes(permission));
  };

  const hasAnyGroup = (groups: string[]): boolean => {
    if (!state.user?.groups) return false;
    return groups.some(group => state.user!.groups!.includes(group));
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: UserContextType = {
    state,
    login,
    logout,
    changePassword,
    updateUser,
    refreshUser,
    hasPermission,
    hasGroup,
    hasAnyPermission,
    hasAnyGroup,
    clearError,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
