import { flutterwaveBookingHandler, getBookingBySessionStripe, getBookingByTransactionFlutterwave, stripeBookingHandler } from "@/services/booking.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useBookingsStripe = () => {
    return useMutation({
        mutationFn: stripeBookingHandler,
    });
};

export const useBookingSessionStripe = (sessionId: string | null) => {
    return useQuery({
        queryKey: ['booking-session', sessionId],
        queryFn: () => getBookingBySessionStripe(sessionId!),
        enabled: !!sessionId, // only fetch if sessionId exists
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useBookingTransactionFlutterwave = (transactionId: string | null) => {
    return useQuery({
        queryKey: ['booking-session', transactionId],
        queryFn: () => getBookingByTransactionFlutterwave(transactionId!),
        enabled: !!transactionId, // only fetch if transactionId exists
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};


export const useBookingsFlutterwave = () => {
    return useMutation({
        mutationFn: flutterwaveBookingHandler,
    });
};