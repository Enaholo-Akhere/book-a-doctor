import { useState } from 'react';
import MyBookings from './MyBookings';
import ProfileSettings from './ProfileSettings';
import { useProfileMe } from '@/Hook/users';
import Loading from '@/components/Loader';
import Error from '@/components/Error';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';
import { useLogout } from '@/Hook/auth/userAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { handleAxiosError } from '@/utils/axiosError';
import { useCutTitle } from '@/Hook/textCut';

const UserDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logout);
  const profileTitle = useCutTitle({
    text1: 'Profile',
    text2: 'Profile Settings',
  });
  const bookingTitle = useCutTitle({ text1: 'Bookings', text2: 'My Bookings' });

  const { data, isError, isLoading, error } = useProfileMe(user?._id || '');

  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout(undefined, {
      onSuccess: (res) => {
        toast.success(res?.message);
        logoutUser();
        navigate('/login');
      },
      onError: (err) => {
        toast.error(handleAxiosError(err));
      },
    });
  };

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
              <button
                onClick={handleLogout}
                className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white  '
              >
                {isPending ? 'Logging out...' : 'Logout'}
              </button>
              <button className='w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white '>
                Delete account
              </button>
            </div>
          </div>
          <div className='md:col-span-2 md:px-[30px] '>
            <div className='px-8 flex gap-2 justify-center'>
              <Button
                title={bookingTitle}
                onClick={() => setTab('bookings')}
                txtColor='gray-800'
                bgColor={`${tab === 'bookings' && 'bg-primaryColor text-white '}`}
                classNameProps={`font-normal p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading- border border-solid border-primaryColor`}
              />
              <Button
                title={profileTitle}
                txtColor='gray-800'
                onClick={() => setTab('settings')}
                bgColor={`${tab === 'settings' && 'bg-primaryColor text-white '}`}
                classNameProps={`font-normal p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading- border border-solid border-primaryColor`}
              />
            </div>

            {tab === 'bookings' && <MyBookings user={data.data} />}
            {tab === 'settings' && <ProfileSettings user={data.data} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
