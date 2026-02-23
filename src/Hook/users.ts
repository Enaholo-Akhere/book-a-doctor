import { useMutation, useQuery } from "@tanstack/react-query";
import { profileMe, myBookings, editUser } from "@/services/user.service";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useProfileMe = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ME],
        queryFn: profileMe,
        staleTime: 1000 * 60 * 5, // 5 mins
        retry: false, // auth endpoint
        refetchOnWindowFocus: false,
    });
};

export const useMyBookings = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.MY_BOOKINGS],
        queryFn: myBookings,
        staleTime: 1000 * 60 * 5, // 5 mins
        retry: false, // auth endpoint
        refetchOnWindowFocus: false,
    });
};

export const useEditUser = () => {
    return useMutation({
        mutationFn: editUser
    })
}