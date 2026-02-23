// import DoctorCard from '@/components/Doctors/DoctorsCard';
// import { doctorsInterface } from '@/types/doctorsInterface';
import Loading from '@/components/Loader';
import Error from '@/components/Error';
import { useMyBookings } from '@/Hook/users';

const MyBookings = () => {
  const { data, isLoading, isError, error } = useMyBookings();

  return (
    <div>
      {isLoading && <Loading />}
      {isError && (
        <Error errorMessage={error?.message || 'Failed to load bookings'} />
      )}
      {!isLoading && !isError && !data?.length && (
        <h2 className='mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor'>
          You have no bookings yet 👍{' '}
        </h2>
      )}
      {!isLoading && !isError && data?.length > 0 && (
        <h2 className='mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor'>
          Bookings: {data.length}
        </h2>
      )}
    </div>
  );
};

export default MyBookings;
