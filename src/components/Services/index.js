import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ServiceList from './ServiceList';
const ServicesComp = ({ title, subtitle, }) => {
    return (_jsx("section", { children: _jsxs("div", { className: 'container', children: [_jsxs("div", { className: 'lg:w-[470px] mx-auto mb-[50px]', children: [_jsx("h2", { className: 'heading text-center', children: title }), _jsx("p", { className: 'text__para text-center', children: subtitle })] }), _jsx(ServiceList, {})] }) }));
};
export default ServicesComp;
