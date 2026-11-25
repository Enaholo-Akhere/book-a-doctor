import { api } from "@/library/api/axios";
import { useAuthStore } from "@/store/authStore";
import type { feedbackType } from "@/utils/authSchema";
import { ReviewInterface } from "@/types/doctors.ds";
export const review = async ({ id, payload }: { id: string; payload: feedbackType }) => {
    const userId = useAuthStore.getState().user?._id

    const { data } = await api.post(`/reviews/${id}/${userId}`, payload, {
        headers: {
            'Accept': 'application/json',
        },
    });
    return data;
};

export const getReviews = async () => {
    const { data }: { data: { data: ReviewInterface[] } } = await api.get(`/reviews`, {
        headers: {
            'Accept': 'application/json',
        },
    });
    return data.data;
};