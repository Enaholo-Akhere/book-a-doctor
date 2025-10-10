import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({ title, onClick, btnType, bgColor = 'bg-primaryColor', txtColor = 'text-white', btnWidth = 'w-fit', py = 'md:py-4 py-3', px = 'md:px-[30px] px-[20px] ', classNameProps, }) => {
    return (_jsx("button", { onClick: onClick, type: btnType, className: `${bgColor} ${txtColor} ${btnWidth} ${px} ${py} hover:cursor-pointer hover:bg-primaryColor2 ease-in-out font-[600] rounded-[52px] text-[12px] md:text-[16px] ${classNameProps} `, children: title }));
};
export default Button;
