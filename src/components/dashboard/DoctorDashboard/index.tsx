import Error from '@/components/Error';
import Loading from '@/components/Loader';
import { useProfileMeDoctor } from '@/Hook/doctors';
import Tabs from './Tabs';
import { useState } from 'react';
import { doctorsInterface } from '@/types/doctors.ds';
import startIcon from '@/assets/images/Star.png';
import DoctorAbout from '@/components/Doctors/DoctorAbout';
import Profile from './Profile';
import { useAuthStore } from '@/store/authStore';
import Appointments from './appointments';
import { handleAxiosError } from '@/utils/axiosError';

const DoctorDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useProfileMeDoctor(user?._id || '');

  console.log('error', error);

  const data: doctorsInterface = userData?.data;

  const [tabs, setTabs] = useState('overview');

  return (
    <div className='max-w-[1170px] px-5 mx-auto '>
      {isLoading && <Loading />}
      {isError && <Error errorMessage={handleAxiosError(error)} />}
      {!isLoading && !isError && data && (
        <div className='grid lg:grid-cols-3 gap-[30px] lg:gap-[50px] '>
          <Tabs tab={tabs} setTab={setTabs} />
          <div className='lg:col-span-2'>
            {data.isApproved === 'pending' && (
              <div className='flex items-center p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg'>
                <svg
                  aria-hidden={true}
                  className='flex-shrink-0 w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 28 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  ></path>
                </svg>
                <span className='sr-only'>Info</span>
                <p className='ml-3 text-sm font-medium'>
                  To get approval please complete your profile. We&apos;ll
                  review manually and approve within 3 days
                </p>
              </div>
            )}
            <div className='mt-8'>
              {tabs === 'overview' && (
                <div>
                  <div className='flex items-center gap-4 mb-10'>
                    <figure className='max-w-[200px] max-h-[200px]'>
                      <img
                        src={data.photo.imageUrl}
                        alt='doctor-image CareConnect '
                      />
                    </figure>
                    <div>
                      <span
                        className={` ${data.specialization ? 'bg-[#ccf0f3]' : 'bg-red-50 text-red-600'} text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold`}
                      >
                        {data.specialization || 'Specialization not provided'}
                      </span>
                      <h3 className='text-[22px] leading-9 font-bold text-headingColor mt-3 '>
                        {data.name}
                      </h3>
                      <div className='flex items-center gap-[6px] '>
                        <span className='flex items-center gap-[6px] text-headingColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold  '>
                          <img
                            src={startIcon}
                            alt='doctor-ratings-CareConnect '
                          />
                          {data.averageRating}
                        </span>
                        <span className='text-textColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold  '>
                          ({data.totalRating})
                        </span>
                      </div>
                      <p className='text__para font-[15px] lg:max-w-[390px] leading-6 '>
                        {data.bio}
                      </p>
                    </div>
                  </div>
                  <DoctorAbout data={data} />
                </div>
              )}
              {tabs === 'appointments' && (
                <Appointments appointments={data.appointments} />
              )}
              {tabs === 'settings' && <Profile data={data} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
