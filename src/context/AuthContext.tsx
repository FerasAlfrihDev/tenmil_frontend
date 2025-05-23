// context/AuthContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { apiCall } from '../utils/api';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

type Tenant = {
  id: number;
  name: string;
  subdomain: string;
};

type AuthContextType = {
  user: User | null;
  tenant: Tenant | null;
  login: (token?: string) => Promise<void>; // token is optional now
  logout: () => void;
  setTenant: (tenant: Tenant) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenantData] = useState<Tenant | null>(null);

  const login = async () => {
    try {
      const userData: User[] = await apiCall('/users/user', 'GET');
      setUser(userData[0]);
      localStorage.setItem('user', JSON.stringify(userData[0])); // 🧠 cache it
    } catch (error) {
      logout(); // fallback
      console.error('Failed to fetch user after login:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  };

  const setTenant = (tenantData: Tenant) => {
    setTenantData(tenantData);
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    const cachedUser = localStorage.getItem('user');

    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
    if (token) login().catch(() => logout());
  }, []);

  return (
    <AuthContext.Provider value={{ user, tenant, login, logout, setTenant }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
