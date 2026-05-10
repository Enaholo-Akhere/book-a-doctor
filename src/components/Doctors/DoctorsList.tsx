import DoctorCard from './DoctorsCard';
import { doctorsInterface } from '@/types/doctors.ds';
import { useLocation } from 'react-router-dom';
import Loading from '../Loader';
import Error from '../Error';
import { handleAxiosError } from '@/utils/axiosError';
import { AxiosError } from 'axios';

const DoctorsList = ({
  doctorListDetails,
  url,
}: {
  doctorListDetails: {
    isLoading: boolean;
    isError: boolean;
    data: { data: doctorsInterface[] | undefined } | undefined;
    error: AxiosError;
  };
  url: string;
}) => {
  const { pathname } = useLocation();
  const pn = pathname === '/doctors';

  const { isLoading, isError, data, error } = doctorListDetails;

  const handleUrlPath = (id: string) => {
    return pn ? `/doctor/${id}` : url;
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols md:grid-cols-3 gap-5 lg:gap-[30px] ${
        pn ? 'mt-[30px] lg:mt-[55px] lg:grid-cols-4' : ''
      } `}
    >
      {isLoading && (
        <div className='flex justify-center items-center h-[200px] w-full col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 '>
          <Loading />
        </div>
      )}
      {isError && (
        <div className='flex justify-center items-center h-[200px] w-full col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 '>
          <Error errorMessage={handleAxiosError(error)} />
        </div>
      )}
      {!isLoading &&
        !isError &&
        data &&
        data?.data?.map((doctor: doctorsInterface) => {
          return (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              url={handleUrlPath(doctor._id)}
            />
          );
        })}
    </div>
  );
};

export default DoctorsList;
