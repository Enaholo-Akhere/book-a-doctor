import { api } from "@/library/api/axios";
import { HealthProfileInput } from "@/types/users";

export const profileMe = async ({ id }: { id: string }) => {
    const { data } = await api.get(`/users/profile/me/${id}`);

    return data;
};

export const myBookings = async () => {
    const { data } = await api.get('/users/appointments/my-appointments');

    return data;
};

export const editUser = async ({ id, formData }: { id: string, formData: FormData }) => {
    const { data } = await api.put(`/users/${id}`, formData, {
        headers: {
            'Accept': 'application/json',
        },
    });
    return data;
};


export const updateHealthProfile = async (body: HealthProfileInput) => {
    const { data } = await api.patch('/users/me/health', body);
    return data;
};

export const deleteMyAccount = async () => {
    const { data } = await api.delete('/users/me');
    return data;
};
