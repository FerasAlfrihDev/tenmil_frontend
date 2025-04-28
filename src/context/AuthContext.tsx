import { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'; // Can expand later
};

type Tenant = {
  id: number;
  name: string;
  subdomain: string;
};

type AuthContextType = {
  user: User | null;
  tenant: Tenant | null;
  login: (userData: User) => void;
  logout: () => void;
  setTenant: (tenantData: Tenant) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenantData] = useState<Tenant | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // Optionally clear tenant if you want on logout
    // setTenantData(null);
  };

  const setTenant = (tenantData: Tenant) => {
    setTenantData(tenantData);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, login, logout, setTenant }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};