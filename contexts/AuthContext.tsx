
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Added User interface to hold user data
interface User {
    email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // Add user to context
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: { email?: string; password?: string }) => Promise<void>; // Add updateUser function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            if (email && password) {
                setIsAuthenticated(true);
                setUser({ email }); // Set user on successful login
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null); // Clear user data on logout
  };

  // Function to update user profile information
  const updateUser = async (data: { email?: string; password?: string }): Promise<void> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              if (data.email) {
                  setUser(prevUser => prevUser ? { ...prevUser, email: data.email! } : null);
              }
              // Password change is simulated. In a real application, this would be an API call.
              resolve();
          }, 500);
      });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};