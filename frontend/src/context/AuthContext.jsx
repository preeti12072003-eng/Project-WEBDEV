import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken } from '../api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Where each role lands after login.
export const homeForRole = (role) =>
  ({ donor: '/donor', receiver: '/receiver', admin: '/admin' }[role] || '/login');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session on page refresh.
  useEffect(() => {
    if (!getToken()) return setLoading(false);
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('fr_token'))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ token, user }) => {
    localStorage.setItem('fr_token', token);
    setUser(user);
    return user;
  };

  const login = async (email, password) =>
    saveSession(await api('/auth/login', { method: 'POST', body: { email, password } }));

  const register = async (form) =>
    saveSession(await api('/auth/register', { method: 'POST', body: form }));

  const logout = () => {
    localStorage.removeItem('fr_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
