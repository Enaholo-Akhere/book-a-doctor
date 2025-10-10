import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FaqList from './FaqList';
import faqImg from '@/assets/images/faq-img.png';
const Faq = () => {
    return (_jsx("section", { children: _jsx("div", { className: 'container', children: _jsxs("div", { className: 'flex justify-between gap-[50px] lg:gap-20 m-auto ', children: [_jsx("div", { className: 'w-full md:w-[40%] h-full hidden md:block', children: _jsx("div", { className: 'lg:w-[400px] 2xl:w-[450px] ', children: _jsx("img", { src: faqImg, alt: 'doctors website', className: 'w-full h-full' }) }) }), _jsxs("div", { className: 'w-full md:w-[60%]', children: [_jsx("h2", { className: 'heading', children: "Most questions by our beloved patients" }), _jsx(FaqList, {})] })] }) }) }));
};
export default Faq;
