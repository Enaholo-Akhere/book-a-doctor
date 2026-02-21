import { api } from "@/library/api/axios";

export const profileMe = async () => {
    const { data } = await api.get('/users/profile/me');

    return data;
};
