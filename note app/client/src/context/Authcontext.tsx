import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, verifyOTP, sendOTP } from '../services/auth.service';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const value = {
    user,
    loading,
    error,
    loginWithGoogle: async () => {
      try {
        const userData = await loginWithGoogle();
        handleLogin(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    },
    verifyOTP: async (email: string, otp: string) => {
      try {
        const userData = await verifyOTP(email, otp);
        handleLogin(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'OTP verification failed');
      }
    },
    sendOTP: async (email: string) => {
      try {
        await sendOTP(email);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send OTP');
      }
    },
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}