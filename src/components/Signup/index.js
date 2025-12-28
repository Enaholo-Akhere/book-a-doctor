import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import signupImg from '@/assets/images/signup.gif';
import avatar from '@/assets/images/doctor-img01.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PassStrength from './PassStre';
const SignupComp = () => {
    const [selectedFile, setSelectedFile] = useState(new File([], ''));
    //   const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        photo: selectedFile,
        gender: '',
        role: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    useEffect(() => { }, []);
    const handleFileInputChange = async (e) => {
        if (e.target.files) {
            const File = e.target.files[0];
            setSelectedFile(File);
        }
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        // Add your form submission logic here
    };
    const classStylings = 'w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer';
    return (_jsx("div", { className: 'px-5 lg:px-0', children: _jsx("div", { className: 'w-full max-w-[1170px] mx-auto rounded-lg shadow-md md:p-10 ', children: _jsxs("div", { className: 'grid grid-cols-1 lg:grid-cols-2 px-3', children: [_jsx("div", { className: 'hidden lg:block bg-primaryColor rounded-l-lg w-[500px] h-[400px]', children: _jsx("figure", { className: 'rounded-l-lg ', children: _jsx("img", { src: signupImg, alt: 'register | book a doctor', className: 'w-full h-full rounded-l-lg' }) }) }), _jsx("div", { className: 'rounded-l-lg lg:pl-16 py-10', children: _jsxs("h3", { className: 'text-headingColor text-[22px] leading-9 font-bold mb-10  ', children: ["Create an ", _jsx("span", { className: 'text-primaryColor', children: "account" }), _jsxs("form", { className: 'py-4 md:py-0', onSubmit: submitHandler, children: [_jsx("div", { className: 'mb-3', children: _jsx("input", { type: 'text', placeholder: 'Full Name', name: 'name', value: formData.name, onChange: handleInputChange, className: classStylings }) }), _jsx("div", { className: 'mb-3', children: _jsx("input", { type: 'email', placeholder: 'Enter your email', name: 'email', value: formData.email, onChange: handleInputChange, className: classStylings }) }), _jsxs("div", { children: [_jsxs("div", { className: 'mb-3 flex border-b-1', children: [_jsx("input", { type: showPassword ? 'text' : 'password', placeholder: 'Password', name: 'password', value: formData.password, onChange: handleInputChange, className: 'w-full pr-4 py-3  border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer' }), _jsx("button", { type: 'button', onClick: () => setShowPassword((prev) => !prev), className: ' text-gray-600 hover:text-gray-800 focus:outline-none', children: showPassword ? _jsx(FaEye, {}) : _jsx(FaEyeSlash, {}) })] }), _jsx(PassStrength, { formData: formData })] }), _jsxs("div", { className: 'mb-3 flex items-center justify-between ', children: [_jsxs("label", { className: 'text-headingColor font-bold text-[15px] leading-7 ', children: ["Are you a:", _jsxs("select", { name: 'role', onChange: handleInputChange, className: 'text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none ', children: [_jsx("option", { value: 'patient', children: "Patient" }), _jsx("option", { value: 'doctor', children: "Doctor" })] })] }), _jsxs("label", { className: 'text-headingColor font-bold text-[15px] leading-7 ', children: ["Gender", _jsxs("select", { name: 'gender', value: formData.gender, onChange: handleInputChange, className: 'text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none ', children: [_jsx("option", { value: '', children: "Select Gender" }), _jsx("option", { value: 'male', children: "Male" }), _jsx("option", { value: 'female', children: "Female" }), _jsx("option", { value: 'other', children: "Other" })] })] })] }), _jsxs("div", { className: 'mb-3 flex items-center gap-3 ', children: [_jsx("figure", { className: 'w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center ', children: _jsx("img", { src: avatar, alt: 'signup | book a doctor', className: 'w-full rounded-full' }) }), _jsxs("div", { className: 'relative w-[130px] h-[50px] ', children: [_jsx("input", { type: 'file', name: 'photo', id: 'customFile', onChange: handleFileInputChange, accept: '.jpg, .png, .jpeg', className: 'absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer  ' }), _jsx("label", { htmlFor: 'customFile', className: 'absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer ', children: "Upload Photo" })] })] }), _jsx("div", { className: 'mt-7', children: _jsx("button", { className: 'w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ', type: 'submit', children: "Signup" }) }), _jsxs("p", { className: 'mt-5 text-textColor text-center text-[15px] font-bold ', children: ["Already have an account?", ' ', _jsx(Link, { to: '/login', className: 'text-primaryColor font-medium ml-1 ', children: "Login" })] })] })] }) })] }) }) }));
};
export default SignupComp;
