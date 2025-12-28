import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import avatarIcon from '@/assets/images/avatar-icon.png';
import { formatDate } from '@/utils/formatDate';
import { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import FeedbackForm from './FeedbackForm';
const Feedback = () => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    return (_jsxs("div", { children: [_jsxs("div", { className: 'mb-[50px]', children: [_jsx("h4", { className: 'text-[20px] leading-[30px] font-bold text-headingColor mb-[30px] ', children: "All reviews (326)" }), _jsxs("div", { className: 'flex justify-between gap-10 mb-[30px] ', children: [_jsxs("div", { className: 'flex gap-3', children: [_jsx("figure", { className: 'w-10 h-10 rounded-full', children: _jsx("img", { src: avatarIcon, alt: 'client feedback | book a doctor', className: 'w-full' }) }), _jsxs("div", { children: [_jsx("h5", { className: 'text-[16px] leading-6 text-primaryColor font-bold ', children: "Tom Benjamin" }), _jsx("p", { className: 'text-[14px] leading-6 text-textColor ', children: formatDate({ date: '05-14-2025' }) }), _jsx("p", { className: 'text__para mt-3 font-medium text-[15px] ', children: "Good services, highly recommend \uD83D\uDC4D" })] })] }), _jsx("div", { className: 'flex gap-1', children: [...Array(5).keys()].map((_, index) => (_jsx(AiFillStar, { color: '#0067FF' }, index + 1))) })] })] }), !showFeedbackForm && (_jsx("div", { className: 'text-center', children: _jsx("button", { onClick: () => setShowFeedbackForm(true), className: 'btn cursor-pointer py-4', children: "Give Feedback" }) })), showFeedbackForm && _jsx(FeedbackForm, {})] }));
};
export default Feedback;
