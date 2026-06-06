import { api } from "@/library/api/axios";

export const bookingHandler = async ({ doctorId }: { doctorId: string }) => {
    const { data } = await api.post(`/bookings/checkout-session/${doctorId}`);
    return data;
};

export const getBookingBySession = async (sessionId: string) => {
    const { data } = await api.get(
        `/bookings/session/${sessionId}`,
    );
    return data.booking;
};