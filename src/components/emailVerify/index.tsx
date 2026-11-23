import HashLoader from 'react-spinners/HashLoader';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyEmail } from '@/Hook/auth/userAuth';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { handleAxiosError } from '@/utils/axiosError';

const EmailVerify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
            router.push('/login');
          }, 2000);
        },
        onError: (err) => {
          setErrorMessage(handleAxiosError(err) || 'Email verification failed');
        },
      }
    );
  }, [router, mutate, token, userId]);

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
