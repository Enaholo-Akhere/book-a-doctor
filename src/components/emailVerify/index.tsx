import HashLoader from 'react-spinners/HashLoader';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVerifyEmail } from '@/Hook/auth/userAuth';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

const EmailVerify = () => {
  const Navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const token = searchParams.get('token') || '';
  const { isPending, mutate, isSuccess, isError } = useVerifyEmail();

  const [errorMessage, setErrorMessage] = useState<string>('');
  useEffect(() => {
    mutate(
      { token, id: userId },
      {
        onSuccess: (res) => {
          toast.success(res?.message || 'Email verified successfully');
          setTimeout(() => {
            Navigate('/login');
          }, 2000);
        },
        onError: (err) => {
          const error = err as AxiosError;
          const errorData = error?.response?.data as { message?: string };
          setErrorMessage(errorData?.message || 'Email verification failed');
        },
      }
    );
  }, [Navigate, mutate, token, userId]);

  return (
    <div className='flex justify-center items-center flex-col gap-5'>
      {isPending && (
        <>
          <HashLoader size={50} color={'#0073e6'} loading={true} />
          <h2 className='text-2xl font-bold'>Verifying Email...</h2>
        </>
      )}
      {isSuccess && (
        <>
          <h2 className='text-2xl font-bold'>Email Verified Successfully!</h2>
        </>
      )}
      {isError && (
        <>
          <h2 className='text-2xl font-bold'>{errorMessage}!</h2>
        </>
      )}
    </div>
  );
};

export default EmailVerify;
