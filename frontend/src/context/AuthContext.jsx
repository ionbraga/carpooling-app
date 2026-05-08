import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../api/authService';

export const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: 'carpooling_token',
  user: 'carpooling_user',
};

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [user, setUser] = useState(getSavedUser);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.token, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.token);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    setToken(response.data.token);
    setUser(response.data.user);
    return response;
  }, []);

  const register = useCallback(async (payload) => {
    return authService.register(payload);
  }, []);

  const updateUser = useCallback((nextUser) => {
    setUser((currentUser) => ({
      ...currentUser,
      ...nextUser,
    }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      updateUser,
      logout,
    }),
    [token, user, login, register, updateUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}