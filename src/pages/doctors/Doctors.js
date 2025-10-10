import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import DoctorsComp from '../../components/Doctors';
import Testimonial from '@/components/Testimonial';
const Doctors = () => {
    return (_jsxs(_Fragment, { children: [_jsx("section", { className: 'bg-[#fff9ea]', children: _jsxs("div", { className: 'container text-center', children: [_jsx("h2", { className: 'heading', children: "Find a Doctor" }), _jsxs("div", { className: 'max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between ', children: [_jsx("input", { type: 'search', className: 'py-4 pl-4 pr-2 bg-transparent w-[50%] focus:outline-none cursor-pointer placeholder:text-textColor', placeholder: 'Search Doctor' }), _jsx("button", { className: 'btn mt-0 rounded-[0px] rounded-r-md ', children: "Search" })] })] }) }), _jsx("section", { children: _jsx(DoctorsComp, { title: '', subtitle: '' }) }), _jsx("section", { children: _jsx(Testimonial, {}) })] }));
};
export default Doctors;
