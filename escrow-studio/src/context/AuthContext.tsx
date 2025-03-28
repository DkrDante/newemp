
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  userType: 'client' | 'freelancer' | 'moderator';
  isLoggedIn: boolean;
}

interface AuthContextProps {
  user: UserProfile | null;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string, userType: 'client' | 'freelancer') => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email: string, password: string) => {
    // In a real app, this would call an API to authenticate
    // For now, we'll simulate a successful login
    const mockUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      userType: 'client',
      isLoggedIn: true,
    };
    setUser(mockUser);
  };

  const signup = (name: string, email: string, password: string, userType: 'client' | 'freelancer') => {
    // In a real app, this would call an API to create a user
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      email,
      userType,
      isLoggedIn: true,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...profile });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        signup, 
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
