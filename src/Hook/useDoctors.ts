import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { DoctorResponse, DoctorsResponse } from "@/library/api/server";
import { updateBookingStatus, editDoctor, getAllDoctors, getDoctorById, myAppointments, profileMeDoctor } from "@/services/doctor.service";

export const useProfileMeDoctor = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.DOCTOR_ME, id],
        queryFn: () => profileMeDoctor({ id }),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

/**
 * `initialData` is what the server already fetched for the page (it may be
 * up to 10 minutes old). It renders straight away, and the
 * `initialDataUpdatedAt: 0` marks it stale so React Query refreshes it in
 * the background once the page is open.
 */
export const useGetAllDoctors = (searchQuery: string, initialData?: DoctorsResponse) => {
    return useQuery({
        queryKey: [QUERY_KEYS.ALL_DOCTORS, searchQuery],
        queryFn: () => getAllDoctors(searchQuery),
        initialData,
        initialDataUpdatedAt: 0,
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

/** See useGetAllDoctors for how `initialData` is used. */
export const useGetDoctorById = (id: string, initialData?: DoctorResponse) => {
    return useQuery({
        queryKey: [QUERY_KEYS.DOCTOR_BY_ID, id],
        queryFn: () => getDoctorById(id),
        initialData,
        initialDataUpdatedAt: 0,
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useMyBookings = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.MY_APPOINTMENTS],
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

export const useUpdateBookingStatus = () => {
    return useMutation({
        mutationFn: updateBookingStatus
    })
}
