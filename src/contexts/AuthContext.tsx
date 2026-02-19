import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/authService";
import type { User, LoginCredentials, RegisterData, VerifyEmailData } from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  canDelete: boolean;
  canViewCommission: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<{ email: string; userId: string }>;
  verifyEmail: (data: VerifyEmailData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    setIsLoading(true);
    try {
      const token = authService.getToken();
      const storedUser = authService.getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      authService.clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      if (response.success && response.data) {
        return {
          email: response.data.email,
          userId: response.data.user_id,
        };
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Registration failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const verifyEmail = async (data: VerifyEmailData) => {
    try {
      const response = await authService.verifyEmail(data);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Verification failed. Please check your code.";
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        canDelete: user?.role === "SuperAdmin",
        canViewCommission: user?.role === "SuperAdmin" || user?.role === "Agent",
        login,
        register,
        verifyEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
