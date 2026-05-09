import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [artisan, setArtisan]   = useState(null);
  const [loading, setLoading]   = useState(true);

  // Rehydrate from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem('virasat_artisan');
    const token  = localStorage.getItem('virasat_token');
    if (stored && token) {
      setArtisan(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('virasat_token',   data.token);
    localStorage.setItem('virasat_artisan', JSON.stringify(data.artisan));
    setArtisan(data.artisan);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('virasat_token',   data.token);
    localStorage.setItem('virasat_artisan', JSON.stringify(data.artisan));
    setArtisan(data.artisan);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('virasat_token');
    localStorage.removeItem('virasat_artisan');
    setArtisan(null);
  };

  return (
    <AuthContext.Provider value={{ artisan, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
