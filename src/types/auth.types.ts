export type UserRole = "SuperAdmin" | "Counsellor" | "Agent";

export type UserStatus = "Active" | "Inactive" | "Pending";

export interface User {
  _id: string;
  user_id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  region: string;
  country: string;
  branch_name?: string;
  category: string;
  status: UserStatus;
  email_verified: boolean;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterData {
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface ResendOTPData {
  email: string;
  type: "registration" | "password_reset";
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user_id: string;
    email: string;
    otp?: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
