import { useState } from 'react';
import MyBookings from './MyBookings';
import ProfileSettings from './ProfileSettings';
import { useProfileMe } from '@/Hook/users';
import Loading from '@/components/Loader';
import Error from '@/components/Error';
import { AxiosError } from 'axios';

const UserDashboard = () => {
  const { data, isError, isLoading, error } = useProfileMe();

  const [tab, setTab] = useState<string>('bookings');
  const errMsg = error as AxiosError;
  const errorData = errMsg?.response?.data as { message?: string };
  return (
    <div className='max-w-[1170px] px-5 mx-auto'>
      {isLoading && <Loading />}
      {isError && <Error errorMessage={errorData?.message} />}
      {!isError && !isLoading && data && (
        <div className='grid md:grid-cols-3 gap-10 '>
          <div className='pb-[50px] px-[30px] rounded-md '>
            <div className='flex items-center justify-center'>
              <figure className='w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor '>
                <img
                  src={data.data.photo?.imageUrl}
                  alt='user image'
                  className='w-full h-full rounded-full'
                />
              </figure>
            </div>
            <div className='mt-4 text-center'>
              <h3 className='text-[18px] leading-[30px] text-headingColor font-bold '>
                {data.data.name}
              </h3>
              <p className='text-textColor text-[15px] leading-6 font-medium  '>
                {data.data.email}
              </p>
              <p className='text-textColor text-[15px] leading-6 font-medium  '>
                Blood Type:{' '}
                <span className='ml-2 text-headingColor text-[22px] leading-8  '>
                  {data.data.bloodType || 'Not set'}
                </span>
              </p>
            </div>
            <div className='mt-[50px] md:mt-[100px]'>
              <button className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white  '>
                Logout
              </button>
              <button className='w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white '>
                Delete account
              </button>
            </div>
          </div>
          <div className='md:col-span-2 md:px-[30px] '>
            <div className='px-8'>
              <button
                onClick={() => setTab('bookings')}
                className={`${tab === 'bookings' && 'bg-primaryColor text-white font-normal'} p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading- border border-solid border-primaryColor`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setTab('settings')}
                className={`${tab === 'settings' && 'bg-primaryColor text-white font-normal'} py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading- border border-solid border-primaryColor`}
              >
                Profile Settings
              </button>
            </div>
            {tab === 'bookings' && <MyBookings />}
            {tab === 'settings' && <ProfileSettings user={data.data} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
