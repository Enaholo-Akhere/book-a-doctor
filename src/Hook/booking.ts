import { bookingHandler, getBookingBySession } from "@/services/booking.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useBookings = () => {
    return useMutation({
        mutationFn: bookingHandler,
    });
};

export const useBookingSession = (sessionId: string | null) => {
    return useQuery({
        queryKey: ['booking-session', sessionId],
        queryFn: () => getBookingBySession(sessionId!),
        enabled: !!sessionId, // only fetch if sessionId exists
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};