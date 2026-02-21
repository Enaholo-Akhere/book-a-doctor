import axios, { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'

export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
})

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.authorization = `Bearer ${token}`
    }
    return config
})

let isRefreshing = false

interface FailedRequest {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token); // Pass the token back to the .then()
        }
    });
    failedQueue = [];
};

interface AxiosRequestWithRetry extends InternalAxiosRequestConfig {
    _retry?: boolean
}

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config as AxiosRequestWithRetry;
        if (!originalRequest) return Promise.reject(error);

        if (originalRequest.url?.includes('/auth/refresh-token')) {
            useAuthStore.getState().logout();
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const currentToken = useAuthStore.getState().token;
                if (!currentToken) {
                    console.warn("No token found in store, logging out.");
                    useAuthStore.getState().logout();
                    return Promise.reject(error);
                }

                const { data } = await refreshApi.post('/auth/refresh-token', null);

                const newToken = data.token;
                useAuthStore.getState().setToken(newToken);

                originalRequest.headers['authorization'] = `Bearer ${newToken}`;

                processQueue(null, newToken);

                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                useAuthStore.getState().logout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
