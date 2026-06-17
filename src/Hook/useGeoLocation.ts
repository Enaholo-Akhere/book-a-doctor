import { getGeolocationService } from "@/services/geo-location.service";
import { useQuery } from "@tanstack/react-query";

export const useGeolocation = () => {
    return useQuery({
        queryKey: ['geo-location',],
        queryFn: getGeolocationService,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
