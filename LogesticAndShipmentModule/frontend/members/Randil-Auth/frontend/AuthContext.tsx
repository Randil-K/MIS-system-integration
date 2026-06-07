import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// TODO: Define the User interface based on your User entity
interface User {
  id: number;
  name: string;
  email: string;
  role: string; // e.g., 'ADMIN', 'USER', 'MANAGER'
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Replace with actual API call
    // const response = await fetch('http://localhost:8080/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!response.ok) throw new Error('Login failed');
    // const data = await response.json();
    // setUser(data.user);
    // localStorage.setItem('user', JSON.stringify(data.user));
    // localStorage.setItem('authToken', data.token);

    // Temporary mock login
    const mockUser: User = { id: 1, name: 'Test User', email, role: 'ADMIN' };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // TODO: Replace with actual API call
    // const response = await fetch('http://localhost:8080/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, password }),
    // });
    // if (!response.ok) throw new Error('Registration failed');

    console.log('Register:', { name, email, password });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
