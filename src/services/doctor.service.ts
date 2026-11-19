import { api } from "@/library/api/axios";
import { doctorsInterface } from "@/types/doctors.ds";

export const profileMeDoctor = async ({ id }: { id: string }) => {
    const { data } = await api.get(`/doctors/profile/me/${id}`);

    return data;
};

export const getAllDoctors = async (searchQuery: string) => {
    const { data } = await api.get(`/doctors?search=${searchQuery}`);

    return data;
};

export const getDoctorById = async (id: string) => {
    const { data }: { data: { data: doctorsInterface } } = await api.get(`/doctors/${id}`);

    return data;
};

export const myAppointments = async () => {
    const { data } = await api.get('/doctors/appointments/my-appointments');

    return data;
};

export const editDoctor = async ({ id, formData }: { id: string, formData: FormData }) => {
    const { data } = await api.put(`/doctors/${id}`, formData, {
        headers: {
            'Accept': 'application/json',
        },
    });
    return data;
};


export const updateBookingStatus = async ({ bookingId, status }: { bookingId: string; status: 'approved' | 'cancelled' }) => {
    const { data } = await api.patch(`/doctors/me/appointments/${bookingId}/status`, { status });
    return data;
};

export const deleteMyDoctorAccount = async () => {
    const { data } = await api.delete('/doctors/me');
    return data;
};
