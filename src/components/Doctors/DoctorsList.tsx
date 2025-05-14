import { doctors } from '@/assets/data/doctors';
import DoctorCard from './DoctorsCard';
import { doctorsInterface } from '@/types/doctors.ds';
import { useLocation } from 'react-router-dom';

const DoctorsList = () => {
  const { pathname } = useLocation();
  const pn = pathname === '/doctors';

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols md:grid-cols-3 gap-5 lg:gap-[30px] ${
        pn ? 'mt-[30px] lg:mt-[55px] lg:grid-cols-4' : ''
      } `}
    >
      {doctors.map((doctor: doctorsInterface) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorsList;
