import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { validateSession } from "../services/authService";

// Define user and auth state types
interface User {
  _id: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  email: string;
  avatar?: string;
  role: "admin" | "student";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  register: (user: User, token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      register: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem("token", token);
      },
      login: async (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem("token", token);

        // ✅ Fix: Ensure TypeScript recognizes checkSession
        // await get().checkSession();
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("token");
      },

      checkSession: async () => {
        const token = get().token || localStorage.getItem("token");
        const storedUser = get().user;
        if (!token || !storedUser) {
          set({ user: null, token: null, isAuthenticated: false });
          return;
        }

        const response = await validateSession(token);

        if (response.status === "success") {
          const validatedUserId = response.data?.user?.userId;
          if (validatedUserId !== storedUser._id) {
            console.warn("User ID mismatch. Logging out...");
            set({ user: null, token: null, isAuthenticated: false });
            localStorage.removeItem("token");
          } else {
            set({ user: storedUser, token, isAuthenticated: true });
          }
        } else {
          console.warn("Session validation failed. Logging out...");
          set({ user: null, token: null, isAuthenticated: false });
          localStorage.removeItem("token");
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
