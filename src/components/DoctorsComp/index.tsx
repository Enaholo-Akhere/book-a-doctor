import { useLocation } from 'react-router-dom';
import DoctorsList from './DoctorsList';

const DoctorsComp = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  const { pathname } = useLocation();
  const pn = pathname === '/doctors';
  return (
    <section>
      <div className='container'>
        <div
          className={`lg:w-[470px] mx-auto ${pn ? 'mb-[-100px]' : 'mb-[50px]'}`}
        >
          <h2 className='heading text-center'>{title}</h2>
          <p className='text__para text-center'>{subtitle}</p>
        </div>
        <DoctorsList />
      </div>
    </section>
  );
};

export default DoctorsComp;
