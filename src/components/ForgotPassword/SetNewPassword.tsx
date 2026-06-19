import { setNewPasswordSchema, setNewPasswordType } from '@/utils/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import HashLoader from 'react-spinners/HashLoader';
import { handleAxiosError } from '@/utils/axiosError';
import PassStrength from '../Signup/PassStre';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useSetPassword } from '@/Hook/auth/userAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SetNewPasswordComp = () => {
  const { mutate, isPending } = useSetPassword();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<setNewPasswordType>({
    resolver: zodResolver(setNewPasswordSchema),
  });

  const passwordValue = watch('password');

  const submitHandler = (data: setNewPasswordType) => {
    if (!token || !id) {
      toast.error('Invalid reset link.');
      return;
    }

    mutate(
      { password: data.password, token, id },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          navigate('/login');
        },
        onError: (error) => {
          toast.error(handleAxiosError(error));
        },
      }
    );
  };

  return (
    <div className='px-5'>
      <div className='w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 p-5 '>
        <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10 '>
          Set New Password
        </h3>
        <form className='py-4 md:py-0' onSubmit={handleSubmit(submitHandler)}>
          <div>
            <div className='mb-3 flex border-b-1'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='New Password'
                {...register('password')}
                onFocus={() => setShowCheckPassword(true)}
                onBlur={() => {
                  if (!passwordValue) setShowCheckPassword(false);
                }}
                className='w-full pr-4 py-3 border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor'
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='text-gray-600 hover:text-gray-800'
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className='mb-3 flex border-b-1'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Confirm Password'
                {...register('confirmPassword')}
                onFocus={() => setShowCheckPassword(true)}
                onBlur={() => {
                  if (!passwordValue) setShowCheckPassword(false);
                }}
                className='w-full pr-4 py-3 border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor'
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='text-gray-600 hover:text-gray-800'
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className='text-red-500 text-sm'>
                {errors.confirmPassword.message}
              </p>
            )}

            {showCheckPassword && <PassStrength password={passwordValue} />}
          </div>
          <div className='mt-7'>
            <button
              className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 cursor-pointer '
              type='submit'
            >
              {isPending ? (
                <div className='flex justify-center'>
                  <HashLoader size={20} color='#fff' />
                </div>
              ) : (
                'Set Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetNewPasswordComp;
