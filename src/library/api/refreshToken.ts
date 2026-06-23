// src/api/utils/refreshToken.ts
import { useAuthStore } from "@/store/authStore";
import { refreshApi } from "@/library/api/axios";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const refreshToken = async (): Promise<string> => {

    if (isRefreshing && refreshPromise) return refreshPromise;

    isRefreshing = true;

    refreshPromise = refreshApi
        .post("/auth/refresh-token")
        .then(({ data }) => {
            useAuthStore.getState().setToken(data.token);
            return data.token as string;
        })
        .catch((error) => {
            useAuthStore.getState().logout();
            window.location.href = "/login";
            return Promise.reject(error);
        })
        .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
        });

    return refreshPromise;
};