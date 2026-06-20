import { useLocation } from 'react-router-dom';
import DoctorsList from './DoctorsList';
import { doctorsInterface } from '@/types/doctors.ds';
import { AxiosError } from 'axios';
import FadeInSection from '../Motions/motion';

const DoctorsComp = ({
  title,
  subtitle,
  isLoading,
  isError,
  data,
  error,
}: {
  title: string;
  subtitle: string;
  isLoading: boolean;
  isError: boolean;
  data: { data: doctorsInterface[] | undefined } | undefined;
  error: AxiosError<unknown, undefined>;
}) => {
  const { pathname } = useLocation();
  const pn = pathname === '/doctors';
  return (
    <FadeInSection>
      <section>
        <div className='container'>
          <div className={` mx-auto ${pn ? 'mb-[-100px]' : 'mb-[50px]'}`}>
            <h2 className='heading text-center'>{title}</h2>
            <p className='text__para text-center'>{subtitle}</p>
          </div>
          <DoctorsList
            doctorListDetails={{ isLoading, isError, data, error }}
            url='/doctors'
          />
        </div>
      </section>
    </FadeInSection>
  );
};

export default DoctorsComp;
