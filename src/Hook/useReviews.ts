import { useMutation, useQuery } from "@tanstack/react-query";
import { review, getReviews } from "@/services/review.service";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useReviews = () => {
    return useMutation({
        mutationFn: review,
    });
};


// export const useGetReviews = () => {
//     return useMutation({
//         mutationFn: async () => {
//             const { data } = await getReviews();
//             return data;
//         },
//     });
// }

export const useGetReviews = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ALL_REVIEWS],
        queryFn: getReviews,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
