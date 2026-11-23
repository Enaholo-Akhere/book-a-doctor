export const handleAxiosError = (error: unknown): string => {
    const axiosError = error as {
        message?: string;
        response?: { data?: { message?: string } };
    };
    return (axiosError?.response?.data?.message ||
        axiosError?.message ||
        'An error occurred while fetching doctor data.');
}
