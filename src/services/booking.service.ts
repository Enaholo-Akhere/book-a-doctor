import { api } from "@/library/api/axios";

export const stripeBookingHandler = async ({ doctorId }: { doctorId: string }) => {
    const { data } = await api.post(`/bookings/checkout-session/${doctorId}`);
    return data;
};

export const getBookingBySession = async (sessionId: string) => {
    const { data } = await api.get(
        `/bookings/session/${sessionId}`,
    );
    return data.booking;
};

export const flutterwaveBookingHandler = async ({ amount, name, email }: { amount: string, name: string, email: string }) => {
    const { data } = await api.post('/bookings/flutterwave', { amount, email, name });
    return data;
};
