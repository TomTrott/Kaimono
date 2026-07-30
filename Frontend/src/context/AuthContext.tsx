import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '@/services/api';

interface AuthUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (prenom: string, nom: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: { firstname: string; lastname: string; email: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me.php')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login.php', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (
    prenom: string,
    nom: string,
    email: string,
    password: string,
  ) => {
    const res = await api.post('/auth/register.php', {
      firstname: prenom,
      lastname: nom,
      email,
      password,
    });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    api.post('/auth/logout.php').catch(() => {});
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = async (data: { firstname: string; lastname: string; email: string }) => {
    const res = await api.put('/users/me.php', data);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return ctx;
}