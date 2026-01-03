import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'user' | 'packer' | 'mover' | 'packer_mover' | 'admin';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulated login - replace with actual API call
    const mockUser: User = {
      id: '1',
      email,
      name: 'John Doe',
      role: 'user',
      createdAt: new Date(),
    };
    setUser(mockUser);
  };

  const signup = async (data: SignupData) => {
    // Simulated signup - replace with actual API call
    const mockUser: User = {
      id: '1',
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      createdAt: new Date(),
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
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
