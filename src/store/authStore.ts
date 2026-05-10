import { doctorsInterface } from '@/types/doctors.ds';
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
    _id: string;
}


interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setToken: (token: string) => void;
    updateUser: (user: User) => void;
    updateDoctor: (user: doctorsInterface) => void;
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
            updateUser: (updatedUser: User) => {
                set((prev) => ({
                    ...prev,
                    user: updatedUser,
                    isAuthenticated: prev.isAuthenticated,
                }));
            },
            updateDoctor: (updatedUser: doctorsInterface) => {
                set((prev) => ({
                    ...prev,
                    user: { ...prev.user, ...updatedUser } as User,
                    isAuthenticated: prev.isAuthenticated,
                }));
            },

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
