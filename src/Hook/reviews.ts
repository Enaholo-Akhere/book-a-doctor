import { useMutation } from "@tanstack/react-query";
import { review } from "@/services/review.service";

export const useReviews = () => {
    return useMutation({
        mutationFn: review,
    });
};
