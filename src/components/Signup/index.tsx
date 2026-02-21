import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import signupImg from '@/assets/images/signup.gif';
import avatar from '@/assets/images/upload_avatar.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PassStrength from './PassStre';
import { registrationSchema, registrationType } from '@/utils/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRegister } from '@/Hook/auth/userAuth';
import toast from 'react-hot-toast';
import HashLoader from 'react-spinners/HashLoader';
import { useNavigate } from 'react-router-dom';

const SignupComp = () => {
  const Navigate = useNavigate();

  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCheckPassword, setShowCheckPassword] = useState(false);

  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<registrationType>({
    resolver: zodResolver(registrationSchema),
  });

  const passwordValue = watch('password');

  const submitHandler = (data: registrationType) => {
    if (!data.photo || data.photo.length === 0) {
      toast.error('Photo is required please upload a photo');
      return;
    }

    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('role', data.role);
    formData.append('phone', data.phone);
    formData.append('gender', data.gender);
    formData.append('photo', data.photo[0]);

    mutate(formData, {
      onSuccess: () => {
        toast.success('Signup successful');
        Navigate('/login');
      },
      onError: (err) => {
        const error = err as AxiosError;
        const errorData = error?.response?.data as { message?: string };
        toast.error(errorData?.message || 'Signup failed');
      },
    });
  };

  const classStylings =
    'w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer';

  return (
    <div className='px-5 lg:px-0'>
      <div className='w-full max-w-[1170px] mx-auto rounded-lg shadow-md md:p-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 px-3'>
          {/* Image */}
          <div className='hidden lg:block bg-primaryColor rounded-l-lg w-[500px] h-[400px]'>
            <figure>
              <img
                src={signupImg}
                alt='register'
                className='w-full h-full rounded-l-lg'
              />
            </figure>
          </div>

          {/* Form */}
          <div className='rounded-l-lg lg:pl-16 py-10 lg:mt-[-56px]'>
            <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>
              Create an <span className='text-primaryColor'>account</span>
            </h3>

            <form
              className='py-4 md:py-0'
              onSubmit={handleSubmit(submitHandler)}
            >
              {/* Name */}
              <div className='mb-3'>
                <input
                  type='text'
                  placeholder='Full Name'
                  {...register('name')}
                  className={classStylings}
                />
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className='mb-3'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  {...register('email')}
                  className={classStylings}
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className='mb-3'>
                <input
                  type='tel'
                  placeholder='Phone number (+2349012345678)'
                  {...register('phone')}
                  className={classStylings}
                />
                {errors.phone && (
                  <p className='text-red-500 text-sm'>{errors.phone.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className='mb-3 flex border-b-1'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
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

                {errors.password && (
                  <p className='text-red-500 text-sm'>
                    {errors.password.message}
                  </p>
                )}

                {showCheckPassword && <PassStrength password={passwordValue} />}
              </div>

              {/* Role & Gender */}
              <div className='mb-3 flex items-center justify-between'>
                <label className='text-headingColor font-bold text-[15px]'>
                  Are you a:
                  <select
                    {...register('role')}
                    className='text-textColor font-semibold text-[15px] px-4 py-3 focus:outline-none'
                  >
                    <option value=''>Select Role</option>
                    <option value='patient'>Patient</option>
                    <option value='doctor'>Doctor</option>
                  </select>
                </label>

                <label className='text-headingColor font-bold text-[15px]'>
                  Gender
                  <select
                    {...register('gender')}
                    className='text-textColor font-semibold text-[15px] px-4 py-3 focus:outline-none'
                  >
                    <option value=''>Select Gender</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                  </select>
                </label>
              </div>

              {/* Upload */}
              <div className='mb-3 flex items-center gap-3'>
                <figure className='w-[60px] h-[60px] rounded-full border-2 border-primaryColor flex items-center justify-center'>
                  <img
                    src={preview || avatar}
                    alt='avatar'
                    className='w-full rounded-full h-full object-cover'
                  />
                </figure>

                <div className='relative w-[130px] h-[50px]'>
                  <Controller
                    name='photo'
                    control={control}
                    render={({ field }) => (
                      <input
                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                        type='file'
                        accept='.jpg,.jpeg,.png'
                        id='customFile'
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          setPreview(URL.createObjectURL(e.target.files![0]));
                        }}
                      />
                    )}
                  />
                  <label
                    htmlFor='customFile'
                    className='absolute inset-0 flex items-center px-3 py-2 text-[15px] font-semibold rounded-lg truncate cursor-pointer bg-[#0066ff46] text-headingColor'
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              <div className='mt-7'>
                <button
                  type='submit'
                  disabled={isPending}
                  className='w-full bg-primaryColor text-white text-[18px] rounded-lg px-4 py-3 cursor-pointer'
                >
                  {isPending ? (
                    <HashLoader size={24} color='#ffffff' />
                  ) : (
                    'Signup'
                  )}
                </button>
              </div>

              <p className='mt-5 text-textColor text-center text-[15px] font-bold'>
                Already have an account?
                <Link to='/login' className='text-primaryColor ml-1'>
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupComp;
