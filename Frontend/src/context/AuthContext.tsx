import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthUser {
  prenom: string;
  nom: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (prenom: string, nom: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, _password: string) => {
    // TODO: Remplacer par ta propre logique d'authentification (API, etc.)
    await new Promise((resolve) => setTimeout(resolve, 700));
    setUser({ prenom: '', nom: '', email });
  };

  const register = async (prenom: string, nom: string, email: string, _password: string) => {
    // TODO: Remplacer par ta propre logique d'inscription (API, etc.)
    await new Promise((resolve) => setTimeout(resolve, 700));
    setUser({ prenom, nom, email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return ctx;
}