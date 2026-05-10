export const handleAxiosError = (error: any): string => {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return (axiosError?.response?.data?.message ||
        error?.message ||
        'An error occurred while fetching doctor data.');
}