import { useLogout } from '@/Hook/auth/userAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { handleAxiosError } from '@/utils/axiosError';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { useState } from 'react';

interface TabsProps {
  tab: string;
  setTab: (tab: string) => void;
}

const Tabs = ({ tab, setTab }: TabsProps) => {
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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

  return (
    <div className=''>
      <span className='lg:hidden '>
        {isMenuOpen ? (
          <FaArrowLeftLong
            className='w-6 h-6 cursor-pointer'
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
        ) : (
          <FaArrowRightLong
            className='w-6 h-6 cursor-pointer'
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
        )}
      </span>
      <div
        className={`absolute lg:relative transform transition-transform duration-300 ${!isMenuOpen && '-translate-x-[500px]'} lg:translate-x-0 flex flex-col p-[38px] bg-white shadow-2xl items-center h-max rounded-md z-1
      `}
      >
        <button
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
            setTab('overview');
          }}
          className={`
            ${tab === 'overview' ? 'bg-indigo-100 text-primaryColor  ' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
        >
          Overview
        </button>
        <button
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
            setTab('appointments');
          }}
          className={`
            ${tab === 'appointments' ? 'bg-indigo-100 text-primaryColor  ' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
        >
          Appointments
        </button>
        <button
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
            setTab('settings');
          }}
          className={`
            ${tab === 'settings' ? 'bg-indigo-100 text-primaryColor  ' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
        >
          Profile
        </button>
        <div className='mt-[80px] w-full'>
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
    </div>
  );
};

export default Tabs;
