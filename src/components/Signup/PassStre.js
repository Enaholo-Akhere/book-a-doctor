import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { usePasswordStrength } from '@/Hook/passwordStrength';
const PassStrength = ({ formData }) => {
    const { passwordValidation, passwordStrength } = usePasswordStrength(formData.password);
    const pStrength = (() => {
        if (passwordStrength.length <= 2) {
            return _jsx("p", { className: 'text-[12px] text-red-600', children: "Weak Password" });
        }
        if (passwordStrength.length === 3) {
            return _jsx("p", { className: 'text-[12px] text-yellow-500', children: "Medium Password" });
        }
        if (passwordStrength.length === 4) {
            return _jsx("p", { className: 'text-[12px] text-green-500', children: "Strong Password" });
        }
    })();
    console.log('passwordStrength:', passwordStrength.length);
    return (_jsxs("div", { className: 'relative overflow-hidden flex justify-between', children: [_jsxs("div", { className: `flex  ease-in-out duration-200 lg:justify-start lg:flex-row gap-2 relative ${formData.password.length ? 'top-[0px]' : 'top-[-25px]'}`, children: [_jsxs("div", { className: 'flex justify-between items-center gap-2 text-[11px] font-extralight', children: [_jsx("p", { children: "Uppercase" }), _jsx("p", { className: 'text-green-500', children: passwordValidation.isUpperCase ? (_jsx(FaCheckCircle, { className: 'text-green-500 text-md' })) : (_jsx(FaTimesCircle, { className: 'text-red-500 text-md' })) })] }), _jsxs("div", { className: 'flex justify-between items-center gap-2 text-[11px] font-extralight', children: [_jsx("p", { children: "Length" }), _jsx("p", { className: 'text-green-500', children: passwordValidation.isLength ? (_jsx(FaCheckCircle, { className: 'text-green-500 text-md' })) : (_jsx(FaTimesCircle, { className: 'text-red-500 text-md' })) })] }), _jsxs("div", { className: 'flex justify-between items-center gap-2 text-[11px] font-extralight', children: [_jsx("p", { children: "Character" }), _jsx("p", { className: 'text-green-500', children: passwordValidation.isCharacter ? (_jsx(FaCheckCircle, { className: 'text-green-500 text-md' })) : (_jsx(FaTimesCircle, { className: 'text-red-500 text-md' })) })] }), _jsxs("div", { className: 'flex justify-between items-center gap-2 text-[11px] font-extralight', children: [_jsx("p", { children: "Number" }), _jsx("p", { className: 'text-green-500', children: passwordValidation.isNumber ? (_jsx(FaCheckCircle, { className: 'text-green-500 text-md' })) : (_jsx(FaTimesCircle, { className: 'text-red-500 text-md' })) })] })] }), _jsx("div", { className: `ease-in-out duration-200 relative ${formData.password.length ? 'top-[0px]' : 'top-[-25px]'}`, children: pStrength })] }));
};
export default PassStrength;
