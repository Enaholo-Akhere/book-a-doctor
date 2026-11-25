'use client';
import DoctorCard from './DoctorsCard';
import { doctorsInterface } from '@/types/doctors.ds';
import { usePathname } from 'next/navigation';
import Loading from '../Loader';
import Error from '../Error';
import { handleAxiosError } from '@/utils/axiosError';
import { AxiosError } from 'axios';
import { doctorPath } from '@/utils/doctorPath';

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
  const pathname = usePathname();
  const pn = pathname === '/doctors';

  const { isLoading, isError, data, error } = doctorListDetails;

  const handleUrlPath = (doctor: doctorsInterface) => {
    return pn ? doctorPath(doctor) : url;
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
      {!isLoading && !isError && data?.data?.length === 0 && (
        <p className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 py-12 text-center text-textColor'>
          No doctors found. Try a different name or specialty.
        </p>
      )}
      {!isLoading &&
        !isError &&
        data &&
        data?.data?.map((doctor: doctorsInterface) => {
          return (
            <div key={doctor._id} data-aos='fade-up' data-aos-delay='200'>
              <DoctorCard
                doctor={doctor}
                url={handleUrlPath(doctor)}
              />
            </div>
          );
        })}
    </div>
  );
};

export default DoctorsList;
