import { flutterwaveBookingHandler, getBookingBySession, stripeBookingHandler } from "@/services/booking.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useBookingsStripe = () => {
    return useMutation({
        mutationFn: stripeBookingHandler,
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

export const useBookingsFlutterwave = () => {
    return useMutation({
        mutationFn: flutterwaveBookingHandler,
    });
};