import { useQuery } from "@tanstack/react-query";
import { profileMe } from "@/services/user.service";
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