import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BsArrowRight } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';
const ServiceCard = ({ item, index }) => {
    const { name, desc, bgColor, textColor } = item;
    const { pathname } = useLocation();
    const pn = pathname === '/services';
    return (_jsxs("div", { className: `${pn ? 'py-[0px]' : 'py-[30px]'} px-3 lg:px-5 flex flex-col justify-between gap-2`, children: [_jsx("h2", { className: 'text-[26px] leading-9 text-headingColor font-[700] ', children: name }), _jsx("p", { className: 'text-[16px] leading-7 font-[400] text-textColor mt-4 ', children: desc }), _jsxs("div", { className: 'flex items-center justify-between mt-[30px] ', children: [_jsx(Link, { to: '/doctors', className: 'w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none', children: _jsx(BsArrowRight, { className: 'group-hover:text-white w-6 h-5' }) }), _jsx("span", { className: 'w-[44px] h-[44px] flex items-center justify-center text-[18px] leading-[30px] font-[600]', style: {
                            background: `${bgColor}`,
                            color: `${textColor}`,
                            borderRadius: '6px 0 0 6px',
                        }, children: index + 1 })] })] }));
};
export default ServiceCard;
