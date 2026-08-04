import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token);

  const isAdmin = Boolean(
    user &&
      Array.isArray(user.roles) &&
      user.roles.some((r) => (typeof r === 'string' ? r : r?.name) === 'admin')
  );

  const isGuest = Boolean(user && user.isGuest);

  const persistToken = useCallback((newToken) => {
    if (newToken) {
      try {
        localStorage.setItem(TOKEN_KEY, newToken);
      } catch {
        // storage unavailable; token lives only in memory
      }
      setToken(newToken);
    } else {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        // ignore
      }
      setToken(null);
    }
  }, []);

  const persistUser = useCallback((newUser) => {
    if (newUser) {
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      } catch {
        // storage unavailable
      }
      setUser(newUser);
    } else {
      try {
        localStorage.removeItem(USER_KEY);
      } catch {
        // ignore
      }
      setUser(null);
    }
  }, []);

  /**
   * Called after a successful login / register response.
   * Expects { token, user } from the API.
   */
  const login = useCallback(
    ({ token: newToken, user: newUser }) => {
      persistToken(newToken);
      persistUser(newUser);
    },
    [persistToken, persistUser]
  );

  /**
   * Called after a successful guest-register response.
   * Marks the user as a guest so the UI can prompt full registration later.
   */
  const loginAsGuest = useCallback(
    ({ token: newToken, user: newUser }) => {
      persistToken(newToken);
      persistUser({ ...newUser, isGuest: true });
    },
    [persistToken, persistUser]
  );

  /**
   * Update the cached user profile (e.g. after PATCH /users/me).
   */
  const updateUser = useCallback(
    (updatedUser) => {
      persistUser(updatedUser);
    },
    [persistUser]
  );

  /**
   * Clear all auth state — used on logout or token expiry.
   */
  const logout = useCallback(() => {
    persistToken(null);
    persistUser(null);
  }, [persistToken, persistUser]);

  /**
   * Decode the JWT payload without verifying the signature.
   * Returns null if the token is absent or malformed.
   */
  const getTokenPayload = useCallback(() => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }, [token]);

  /**
   * Returns true when the stored JWT has expired.
   */
  const isTokenExpired = useCallback(() => {
    const payload = getTokenPayload();
    if (!payload || typeof payload.exp !== 'number') return false;
    return Date.now() >= payload.exp * 1000;
  }, [getTokenPayload]);

  // Auto-logout when the token expires (checked on mount and whenever token changes).
  useEffect(() => {
    if (!token) return;

    if (isTokenExpired()) {
      logout();
      return;
    }

    const payload = getTokenPayload();
    if (!payload || typeof payload.exp !== 'number') return;

    const msUntilExpiry = payload.exp * 1000 - Date.now();
    const timerId = setTimeout(() => {
      logout();
    }, msUntilExpiry);

    return () => clearTimeout(timerId);
  }, [token, isTokenExpired, getTokenPayload, logout]);

  const value = {
    token,
    user,
    loading,
    setLoading,
    isAuthenticated,
    isAdmin,
    isGuest,
    login,
    loginAsGuest,
    logout,
    updateUser,
    getTokenPayload,
    isTokenExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
