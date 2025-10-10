import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from 'react-router-dom';
import DoctorsList from './DoctorsList';
const DoctorsComp = ({ title, subtitle, }) => {
    const { pathname } = useLocation();
    const pn = pathname === '/doctors';
    return (_jsx("section", { children: _jsxs("div", { className: 'container', children: [_jsxs("div", { className: `lg:w-[470px] mx-auto ${pn ? 'mb-[-100px]' : 'mb-[50px]'}`, children: [_jsx("h2", { className: 'heading text-center', children: title }), _jsx("p", { className: 'text__para text-center', children: subtitle })] }), _jsx(DoctorsList, {})] }) }));
};
export default DoctorsComp;
