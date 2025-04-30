import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(storedIsAdmin);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = (userData, adminMode = false) => {
    setIsAuthenticated(true);
    setIsAdmin(adminMode);
    if (!adminMode && userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    navigate(isAdmin ? '/admin-login' : '/login');
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isAdmin,
      user,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);