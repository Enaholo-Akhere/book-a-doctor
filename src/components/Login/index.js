import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
const LoginComp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (_jsx("div", { className: 'px-5 lg:px-0', children: _jsxs("div", { className: 'w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 ', children: [_jsxs("h3", { className: 'text-headingColor text-[22px] leading-9 font-bold mb-10 ', children: ["Hello ", _jsx("span", { className: 'text-primaryColor ', children: "Welcome " }), "Back \uD83C\uDF89"] }), _jsxs("form", { className: 'py-4 md:py-0', children: [_jsx("div", { className: 'mb-5', children: _jsx("input", { type: 'email', placeholder: 'Enter your email', name: 'email', value: formData.email, onChange: handleInputChange, className: 'w-full py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer ' }) }), _jsx("div", { className: 'mb-5', children: _jsx("input", { type: 'password', placeholder: 'Password', name: 'password', value: formData.password, onChange: handleInputChange, className: 'w-full py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer ' }) }), _jsx("div", { className: 'mt-7', children: _jsx("button", { className: 'w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ', type: 'submit', children: "Login" }) }), _jsxs("p", { className: 'mt-5 text-textColor text-center ', children: ["Don't have an account?", ' ', _jsx(Link, { to: '/signup', className: 'text-primaryColor font-medium ml-1 ', children: "Register" })] })] })] }) }));
};
export default LoginComp;
