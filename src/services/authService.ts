import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import type {
  LoginCredentials,
  RegisterData,
  VerifyEmailData,
  ResendOTPData,
  ResetPasswordData,
  AuthResponse,
  RegisterResponse,
  User,
} from "../types/auth.types";

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error("Login service error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Register
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await axiosInstance.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error("Register service error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Verify Email with OTP
  verifyEmail: async (data: VerifyEmailData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        data
      );
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error("VerifyEmail service error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (data: ResendOTPData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_OTP, data);
    return response.data;
  },

  // Generate Reset Password OTP
  generateResetOTP: async (email: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_OTP, { email });
    return response.data;
  },

  // Reset Password with OTP
  resetPassword: async (data: ResetPasswordData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Helper methods
  getToken: () => localStorage.getItem("token"),

  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
