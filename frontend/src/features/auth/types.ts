export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password?: string; // Could be optional if phone/OTP is used, but required for basic
}

export interface RegisterCredentials {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}
