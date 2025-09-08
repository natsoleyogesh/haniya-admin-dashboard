
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Updated User interface to match API response
interface User {
    id: number;
    name: string;
    email: string;
    usertype: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: { email?: string; password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('authToken'));
  const [user, setUser] = useState<User | null>(() => {
      const savedUser = localStorage.getItem('authUser');
      return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
        const response = await fetch('https://haniya.natsol.in/api/admin/login', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error('Login failed with status:', response.status);
            return false;
        }

        const data = await response.json();

        if (data.status === true) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('authUser', JSON.stringify(data.user));
            setIsAuthenticated(true);
            setUser(data.user);
            return true;
        } else {
            console.error('Login failed:', data.message);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setIsAuthenticated(false);
            setUser(null);
            return false;
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
        return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Function to update user profile information
  const updateUser = async (data: { email?: string; password?: string }): Promise<void> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              if (data.email) {
                  setUser(prevUser => {
                      if (prevUser) {
                          const updatedUser = { ...prevUser, email: data.email! };
                          localStorage.setItem('authUser', JSON.stringify(updatedUser));
                          return updatedUser;
                      }
                      return null;
                  });
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
