import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { editDoctor, getAllDoctors, getDoctorById, myAppointments, profileMeDoctor } from "@/services/doctor.service";

export const useProfileMeDoctor = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ME],
        queryFn: () => profileMeDoctor({ id }),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useGetAllDoctors = (searchQuery: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ALL_DOCTORS, searchQuery],
        queryFn: () => getAllDoctors(searchQuery),
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useGetDoctorById = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.DOCTOR_BY_ID, id],
        queryFn: () => getDoctorById(id),
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useMyBookings = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.MY_BOOKINGS],
        queryFn: myAppointments,
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useEditDoctor = () => {
    return useMutation({
        mutationFn: editDoctor
    })
}