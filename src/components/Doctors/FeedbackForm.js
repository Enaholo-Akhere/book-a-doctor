import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
const FeedbackForm = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const handleSubmitReview = async (e) => {
        e.preventDefault();
    };
    return (_jsxs("form", { action: '', onSubmit: handleSubmitReview, children: [_jsxs("div", { children: [_jsx("h3", { className: 'text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0 ', children: "How would you rate the overall experience?*" }), _jsx("div", { children: [...Array(5).keys()].map((_, index) => {
                            index += 1;
                            return (_jsx("button", { type: 'button', onClick: () => setRating(index), onMouseEnter: () => setHover(index), onMouseLeave: () => setHover(rating), onDoubleClick: () => {
                                    setHover(0);
                                    setRating(0);
                                }, className: `${index <= ((rating && hover) || hover)
                                    ? 'text-yellowColor'
                                    : 'text-gray-400'} bg-transparent border-none outline-none text-[22px] cursor-pointer `, children: _jsx("span", { children: _jsx(AiFillStar, {}) }) }, index));
                        }) })] }), _jsxs("div", { className: 'mt-[30px]', children: [_jsx("h3", { className: 'text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0 ', children: "Share your feedback or suggestion*" }), _jsx("textarea", { className: 'border border-solid border-[#0066FF34] focus:outline outline-primaryColor w-full px-4 py-3 rounded-md', rows: 5, placeholder: 'Write your here', onChange: (e) => setReviewText(e.target.value), value: reviewText })] }), _jsx("button", { type: 'submit', className: 'btn mt-5 py-4', children: "Submit Feedback" })] }));
};
export default FeedbackForm;
