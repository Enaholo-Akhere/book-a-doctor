import { useMemo } from 'react';
import { checkUpperCase, checkNumber, specialCharacter, wordCount } from '@/utils/checkCase';


export const usePasswordStrength = (password: string) => {
    const passwordValidation = useMemo(() => ({
        isCharacter: specialCharacter(password),
        isNumber: checkNumber(password),
        isUpperCase: checkUpperCase(password),
        isLength: wordCount(password),
    }), [password]);

    const passwordStrength = useMemo(() => {
        const numArr: number[] = [];
        if (passwordValidation.isCharacter) numArr.push(1);
        if (passwordValidation.isNumber) numArr.push(2);
        if (passwordValidation.isUpperCase) numArr.push(3);
        if (passwordValidation.isLength) numArr.push(4);
        return numArr;
    }, [passwordValidation]);

    return { passwordValidation, passwordStrength };
};

