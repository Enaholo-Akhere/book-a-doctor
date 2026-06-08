import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser, verifyUser, logoutUser, forgotPassword, setPassword } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser,

    });
};

export const useLogin = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setAuth(data.data, data.token);
        },
    });
}

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
    });
}
export const useSetPassword = () => {
    return useMutation({
        mutationFn: setPassword,
    });
}

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: verifyUser,
    });
}

export const useLogout = () => {
    return useMutation({
        mutationFn: logoutUser,
    });
}


