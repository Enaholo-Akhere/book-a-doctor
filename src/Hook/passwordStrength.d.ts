export declare const usePasswordStrength: (password: string) => {
    passwordValidation: {
        isCharacter: boolean;
        isNumber: boolean;
        isUpperCase: boolean;
        isLength: boolean;
    };
    passwordStrength: number[];
};
