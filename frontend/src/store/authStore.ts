import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // starts true until hydration configures

      login: (user: User, token: string) => {
        Cookies.set("token", token, { expires: 7 });
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        Cookies.remove("token");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user, isLoading: false });
      },
    }),
    {
      name: "auth-storage", // local storage key name
    },
  ),
);
