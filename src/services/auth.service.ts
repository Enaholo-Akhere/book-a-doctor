import { api } from "@/library/api/axios";
import { forgotPasswordType, loginType } from "@/utils/authSchema";


interface setPasswordPayload {
    password: string;
    token: string;
    id: string;
}

export const registerUser = async (payload: FormData) => {
    const { data } = await api.post('/auth/register', payload, {
        headers: {
            'Accept': 'application/json',
        },
    });
    return data;
};

export const loginUser = async (payload: loginType) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
};

export const forgotPassword = async (payload: forgotPasswordType) => {
    const { data } = await api.post('/auth/forgot-password', payload);
    return data;
};

export const setPassword = async (payload: setPasswordPayload) => {
    const { data } = await api.post(`/auth/set-password/?id=${payload.id}&token=${payload.token}`, { password: payload.password });
    return data;
};

export const verifyUser = async (payload: { token: string, id: string }) => {
    const { data } = await api.post(`/auth/verify-email?token=${payload.token}&id=${payload.id}`);
    return data;
};

export const logoutUser = async () => {
    const { data } = await api.put('/auth/logout');
    return data;
};

