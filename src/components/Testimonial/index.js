import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from 'react-router-dom';
import TestimonialSwiper from './TestimonialSwiper';
const Testimonial = () => {
    const { pathname } = useLocation();
    const pn = pathname === '/doctors';
    return (_jsx("section", { className: `${pn ? 'mt-[-150px]' : ''}`, children: _jsxs("div", { className: 'container', children: [_jsxs("div", { className: 'lg:w-[470px] mx-auto mb-[50px]', children: [_jsx("h2", { className: 'heading text-center', children: "What our patients say" }), _jsx("p", { className: 'text__para text-center', children: "Hear from the patients whose lives we\u2019ve touched through compassionate, expert healthcare." })] }), _jsx(TestimonialSwiper, {})] }) }));
};
export default Testimonial;
