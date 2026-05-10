import { api } from "@/library/api/axios";
import { useAuthStore } from "@/store/authStore";
import { feedbackType } from "@/utils/authSchema";

export const review = async ({ id, payload }: { id: string; payload: feedbackType }) => {
    const userId = useAuthStore.getState().user?._id

    const { data } = await api.post(`/reviews/${id}/${userId}`, payload, {
        headers: {
            'Accept': 'application/json',
        },
    });
    return data;
};