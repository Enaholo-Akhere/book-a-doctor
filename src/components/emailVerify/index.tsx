import Link from 'next/link';
import HashLoader from 'react-spinners/HashLoader';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResendVerification } from '@/Hook/auth/userAuth';
import { verifyUser } from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { handleAxiosError } from '@/utils/axiosError';

/**
 * One page for every step of email verification:
 * - `?userId=…&token=…` (the link in the email): verifies the account.
 * - `?email=…` (after signing up or a blocked login): "check your inbox" with a resend button.
 * - otherwise, or if the link failed: a form to request a new link.
 */
const EmailVerify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const token = searchParams.get('token') || '';
  const isLink = Boolean(userId && token);

  const resend = useResendVerification();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  // In development React mounts effects twice. The ref makes sure the link is submitted only
  // once. The result goes into this component's own state rather than useMutation's, which
  // stops reporting back after that first simulated unmount, leaving the spinner up forever.
  const submitted = useRef(false);

  useEffect(() => {
    if (!isLink || submitted.current) return;
    submitted.current = true;

    verifyUser({ token, id: userId })
      .then((res) => {
        setStatus('success');
        // The Toaster lives in the app shell, so this stays on screen after the redirect.
        toast.success(res?.message || 'Email verified successfully. You can now log in.', { duration: 5000 });
        router.replace('/login');
      })
      .catch((err) => {
        setErrorMessage(handleAxiosError(err) || 'Email verification failed');
        setStatus('error');
      });
  }, [isLink, token, userId, router]);

  const requestNewLink = (e?: FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) {
      toast.error('Enter the email you signed up with');
      return;
    }
    resend.mutate(
      { email: email.trim() },
      {
        onSuccess: (res) => toast.success(res?.message || 'Verification email sent'),
        onError: (err) => toast.error(handleAxiosError(err)),
      }
    );
  };

  const card = 'w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 p-5 text-center';
  const button =
    'w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80';

  const resendForm = (
    <form className='mt-6 text-left' onSubmit={requestNewLink}>
      <input
        type='email'
        autoComplete='email'
        placeholder='Enter your email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full py-3 border-b border-solid border-primary-200 focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor'
      />
      <button type='submit' disabled={resend.isPending} className={`${button} mt-6`}>
        {resend.isPending ? (
          <div className='flex justify-center'>
            <HashLoader size={20} color='#fff' />
          </div>
        ) : (
          'Send a new verification link'
        )}
      </button>
    </form>
  );

  if (isLink && status === 'verifying') {
    return (
      <div className='flex justify-center items-center flex-col gap-5 py-10'>
        <HashLoader size={50} color={'#0073e6'} loading={true} />
        <h2 className='text-2xl font-bold'>Verifying your email…</h2>
      </div>
    );
  }

  if (isLink && status === 'success') {
    return (
      <div className='px-5'>
        <div className={card}>
          <h2 className='text-2xl font-bold text-headingColor'>Email verified ✅</h2>
          <p className='mt-3 text-textColor'>Taking you to login…</p>
          <Link href='/login' className={`${button} inline-block mt-6`}>
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (isLink && status === 'error') {
    return (
      <div className='px-5'>
        <div className={card}>
          <h2 className='text-2xl font-bold text-headingColor'>We couldn&apos;t verify your email</h2>
          <p className='mt-3 text-textColor'>{errorMessage}</p>
          {resendForm}
        </div>
      </div>
    );
  }

  // No link: arrived here after signing up, after a blocked login, or directly.
  const initialEmail = searchParams.get('email');
  return (
    <div className='px-5'>
      <div className={card}>
        <h2 className='text-2xl font-bold text-headingColor'>
          {initialEmail ? 'Check your inbox 📬' : 'Verify your email'}
        </h2>
        <p className='mt-3 text-textColor'>
          {initialEmail ? (
            <>
              We sent a verification link to <strong>{initialEmail}</strong>. Click it to activate your account. It can
              take a minute to arrive, so check your spam folder too.
            </>
          ) : (
            'Enter the email you signed up with and we’ll send you a new verification link.'
          )}
        </p>
        {resendForm}
        <p className='mt-5 text-textColor'>
          Already verified?{' '}
          <Link href='/login' className='text-primaryColor font-medium'>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;
