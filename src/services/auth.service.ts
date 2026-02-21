import { api } from "@/library/api/axios";
import { loginType } from "@/utils/authSchema";

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

export const verifyUser = async (payload: { token: string, id: string }) => {
    const { data } = await api.post(`/auth/verify-email?token=${payload.token}&id=${payload.id}`);
    return data;
};

