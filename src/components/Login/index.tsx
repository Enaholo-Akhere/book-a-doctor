import { Link } from 'react-router-dom';
import { loginSchema, loginType } from '@/utils/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/Hook/auth/userAuth';
import toast from 'react-hot-toast';
import HashLoader from 'react-spinners/HashLoader';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

const LoginComp = () => {
  const Navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginType>({
    resolver: zodResolver(loginSchema),
  });

  const submitHandler = (data: loginType) => {
    mutate(data, {
      onSuccess: (res) => {
        console.log('Login successful', res);
        Navigate('/');
      },
      onError: (err) => {
        const error = err as AxiosError;
        const errorData = error?.response?.data as { message?: string };
        toast.error(errorData?.message || 'Login failed');
      },
    });

    console.log(data);
  };

  return (
    <div className='px-5 lg:px-0'>
      <div className='w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 '>
        <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10 '>
          Hello <span className='text-primaryColor '>Welcome </span>Back 🎉
        </h3>
        <form className='py-4 md:py-0' onSubmit={handleSubmit(submitHandler)}>
          <div className='mb-5'>
            <input
              type='email'
              autoComplete='on'
              placeholder='Enter your email'
              {...register('email')}
              className='w-full py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer '
            />
            {errors.email && (
              <p className='text-red-500 text-sm'>{errors.email.message}</p>
            )}
          </div>
          <div className='mb-5'>
            <div className=' flex border-b-1'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                {...register('password')}
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
                'Login'
              )}
            </button>
          </div>
          <p className='mt-5 text-textColor text-center '>
            Don&apos;t have an account?{' '}
            <Link to='/signup' className='text-primaryColor font-medium ml-1 '>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginComp;
