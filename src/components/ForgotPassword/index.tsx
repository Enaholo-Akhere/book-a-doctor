import { forgotPasswordSchema, forgotPasswordType } from '@/utils/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useForgotPassword } from '@/Hook/auth/userAuth';
import toast from 'react-hot-toast';
import HashLoader from 'react-spinners/HashLoader';
import { handleAxiosError } from '@/utils/axiosError';

const ForgotPasswordComp = () => {
  const { mutate, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const submitHandler = (data: forgotPasswordType) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (error) => {
        toast.error(handleAxiosError(error));
      },
    });
  };

  return (
    <div className='px-5'>
      <div className='w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 p-5 '>
        <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10 '>
          Forgot Password? 🤔
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
                'Send Reset Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordComp;
