import { jsx as _jsx } from "react/jsx-runtime";
import { doctors } from '@/assets/data/doctors';
import DoctorCard from './DoctorsCard';
import { useLocation } from 'react-router-dom';
const DoctorsList = () => {
    const { pathname } = useLocation();
    const pn = pathname === '/doctors';
    return (_jsx("div", { className: `grid grid-cols-1 sm:grid-cols md:grid-cols-3 gap-5 lg:gap-[30px] ${pn ? 'mt-[30px] lg:mt-[55px] lg:grid-cols-4' : ''} `, children: doctors.map((doctor) => (_jsx(DoctorCard, { doctor: doctor }, doctor.id))) }));
};
export default DoctorsList;
