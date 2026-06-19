import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from '@/store/authStore';
import { handleAxiosError } from "@/utils/axiosError";

const prodURL = import.meta.env.VITE_PROD_BASE_URL
const devURL = import.meta.env.VITE_DEV_BASE_URL
const baseUrl = import.meta.env.MODE === 'production' ? prodURL : devURL

export const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

const refreshApi = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})


api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
);

interface AxiosRequestWithRetry extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token!);
    });
    failedQueue = [];
};

api.interceptors.response.use((response) => response, async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestWithRetry;
    if (!originalRequest) return Promise.reject(error);

        return Promise.reject(error);
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const id = useAuthStore.getState().user?._id;
            console.log('🟡 Refreshing for user');

            const { data } = await refreshApi.post(`/auth/refresh-token/${id}`, null);
            console.log('🟢 Refresh successful, new token:', data);

            const newToken = data.token;
            useAuthStore.getState().setToken(newToken);


            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return api(originalRequest);
        } catch (error) {
            console.log('error', error);
            useAuthStore.getState().logout();

    if (error.response?.status === 401 && !originalRequest._retry) {

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await refreshApi.post('/auth/refresh-token');

            const newToken = data.token;
            useAuthStore.getState().setToken(newToken);


            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            return api(originalRequest);
        } catch (error) {
            processQueue(error, null);


            useAuthStore.getState().logout();

            window.location.href = "/login";

            return Promise.reject(error);
        } finally {
            isRefreshing = false;
        }
    }

    if (error.response?.status === 403) {

        if (handleAxiosError(error) === "Cannot verify user") {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        } else {

            await refreshApi.put('/auth/logout');
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }



        return Promise.reject(error);
    };

    return Promise.reject(error);
}
);

export default api;