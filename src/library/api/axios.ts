import axios, { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'

// const devURL = import.meta.env.VITE_BASE_URL
const prodURL = import.meta.env.VITE_PROD_BASE_URL
// const baseUrl = import.meta.env.MODE === 'production' ? prodURL : devURL

export const api = axios.create({
    baseURL: prodURL,
    withCredentials: true,
})

const refreshApi = axios.create({
    baseURL: prodURL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.authorization = `Bearer ${token}`
    }
    return config
})


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

let isRefreshing = false;


api.interceptors.response.use(
    (res) => res,
    async (error) => {
        console.log('🔴 Interceptor hit:', error.response?.status, error.config?.url);
        const originalRequest = error.config as AxiosRequestWithRetry;
        if (!originalRequest) return Promise.reject(error);

        if (originalRequest.url?.includes('/auth/refresh-token')) {
            console.log('🔴 Refresh route failed, rejecting...');
            return Promise.reject(error);
        }
        if (isRefreshing) {
            console.log('🟡 Refresh already in progress, queuing request...');
        }
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log('🟡 401 caught, attempting refresh...');

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const id = useAuthStore.getState().user?._id;
                console.log('🟡 Refreshing for user id:', id);

                const { data } = await refreshApi.post(`/auth/refresh-token/${id}`, null);
                console.log('🟢 Refresh successful, new token:', data.token?.substring(0, 20));

                const newToken = data.token;
                useAuthStore.getState().setToken(newToken);
                originalRequest.headers['authorization'] = `Bearer ${newToken}`;
                processQueue(null, newToken);
                return api(originalRequest);
            } catch (err: any) {
                console.log('🔴 Refresh failed:', err.response?.status, err.response?.data);
                processQueue(err, null);
                useAuthStore.getState().logout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        console.log('🔴 Not a 401, skipping refresh. Status:', error.response?.status);
        return Promise.reject(error);
    }
);

// api.interceptors.response.use(
//     (res) => res,
//     async (error) => {
//         const originalRequest = error.config as AxiosRequestWithRetry;
//         if (!originalRequest) return Promise.reject(error);

//         if (originalRequest.url?.includes('/auth/refresh-token')) {
//             useAuthStore.getState().logout();
//             return Promise.reject(error);
//         }

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 })
//                     .then((token) => {
//                         originalRequest.headers['Authorization'] = `Bearer ${token}`;
//                         return api(originalRequest);
//                     })
//                     .catch((err) => Promise.reject(err));
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 const currentToken = useAuthStore.getState().token;
//                 const id = useAuthStore.getState().user?._id;
//                 if (!currentToken) {
//                     console.warn("No token found in store, logging out.");
//                     useAuthStore.getState().logout();
//                     return Promise.reject(error);
//                 }

//                 const { data } = await refreshApi.post(`/auth/refresh-token/${id}`, null);

//                 const newToken = data.token;
//                 useAuthStore.getState().setToken(newToken);

//                 originalRequest.headers['authorization'] = `Bearer ${newToken}`;

//                 processQueue(null, newToken);

//                 return api(originalRequest);
//             } catch (err) {
//                 processQueue(err, null);
//                 useAuthStore.getState().logout();
//                 return Promise.reject(err);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     }
// );
