import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
const FaqItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleAccordion = () => {
        setIsOpen((prev) => !prev);
    };
    return (_jsxs("div", { className: 'p-3 lg:p-5 rounded-[12px] border border-solid border-[#D9DCE2] mb-5 cursor-pointer ', children: [_jsxs("div", { className: 'flex items-center justify-between gap-5', children: [_jsx("h4", { className: 'text-[16px] leading-4 lg:text-[20px] lg:leading-5 text-headingColor ', children: item.question }), _jsx("div", { className: `${isOpen && 'bg-primaryColor text-white border-none'} w-7 h-7 lg:w-8 lg:h-8 border border-solid border-[#141F21] rounded flex items-center justify-center`, onClick: toggleAccordion, children: isOpen ? _jsx(AiOutlineMinus, {}) : _jsx(AiOutlinePlus, {}) })] }), isOpen && (_jsx("div", { className: 'mt-4', children: _jsx("p", { className: ' text-[14px] leading-6 lg:text-[16px] lg:leading-8 font-[400] text-textColor pl-[10px] border-l-2 border-l-gray-400 ', children: item.content }) }))] }));
};
export default FaqItem;
