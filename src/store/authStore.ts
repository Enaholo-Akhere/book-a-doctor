import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';
import { persist } from "zustand/middleware";

interface User {
    id: string;
    name: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    photo: {
        imageUrl: string;
        publicId: string;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setToken: (token: string) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user: User, token: string) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                }),
            setToken: (token: string) =>
                set((state) => ({
                    token,
                    user: state.user,
                    isAuthenticated: true,
                })),



            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "auth-storage", // localStorage key
        }
    )
);
