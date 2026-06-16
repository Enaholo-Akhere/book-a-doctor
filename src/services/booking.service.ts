import { api } from "@/library/api/axios";

export const stripeBookingHandler = async ({ doctorId }: { doctorId: string }) => {
    const { data } = await api.post(`/bookings/checkout-session/${doctorId}`);
    return data;
};

export const getBookingBySessionStripe = async (sessionId: string) => {
    const { data } = await api.get(
        `/bookings/session/${sessionId}`,
    );
    return data.booking;
};

export const getBookingByTransactionFlutterwave = async (transactionId: string, doctorId: string) => {
    if (transactionId) {
        const { data } = await api.get(
            `/bookings/flutterwave/verify/${doctorId}/?transactionId=${transactionId}`,
        );
        return data.data;
    }

};

export const flutterwaveBookingHandler = async ({ amount, name, email, doctorId }: { doctorId: string; amount: string, name: string, email: string }) => {
    const { data } = await api.post(`/bookings/flutterwave/${doctorId}`, { amount, email, name });
    return data.data;
};
