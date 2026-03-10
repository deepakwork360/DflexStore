import axiosInstance from "../../lib/axios";
import { LoginCredentials, RegisterCredentials, AuthResponse } from "./types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      credentials,
    );
    return response.data;
  },
};
