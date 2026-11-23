import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AlertTriangle, BadgeCheck, KeyRound, LogOut, ShieldCheck, Trash2 } from 'lucide-react';
import { user } from '@/types/users';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { queryClient } from '@/library/provider/reactQuery';
import { handleAxiosError } from '@/utils/axiosError';
import { formatDate } from '@/utils/formatDate';
import { Badge, Card, CardHeader, fieldClass, secondaryBtn } from './ui';

interface AccountSecurityProps {
  user: Pick<user, 'email' | 'verified' | 'createdAt'>;
  onLogout: () => void;
  isLoggingOut: boolean;
  /** Calls the role's "delete my account" endpoint. */
  deleteAccount: () => Promise<unknown>;
  /** Extra sentence for the delete dialog (what else is removed for this role). */
  deleteNote?: string;
}

const AccountSecurity = ({ user, onLogout, isLoggingOut, deleteAccount, deleteNote }: AccountSecurityProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader title='Account & security' description='Sign-in details and session' icon={<ShieldCheck size={18} />} />
        <ul className='divide-y divide-gray-100 border-t border-gray-100'>
          <Row
            title='Email'
            description={user.email}
            action={
              user.verified === false ? (
                <Badge tone='amber'>Unverified</Badge>
              ) : (
                <Badge tone='emerald'>
                  <BadgeCheck size={12} /> Verified
                </Badge>
              )
            }
          />
          <Row
            title='Password'
            description="We'll email you a secure link to set a new password."
            action={
              <Link href='/forgot-password' className={`${secondaryBtn} py-2`}>
                <KeyRound size={15} /> Change
              </Link>
            }
          />
          {user.createdAt && <Row title='Member since' description={formatDate({ date: user.createdAt, config: { month: 'long' } })} />}
          <Row
            title='Sign out'
            description='End your session on this device.'
            action={
              <button type='button' onClick={onLogout} disabled={isLoggingOut} className={`${secondaryBtn} py-2`}>
                <LogOut size={15} /> {isLoggingOut ? 'Signing out…' : 'Sign out'}
              </button>
            }
          />
        </ul>
      </Card>

      <Card className='border-red-100'>
        <CardHeader
          title='Delete account'
          description='Permanently remove your account and personal data. This cannot be undone.'
          icon={<AlertTriangle size={18} className='text-red-600' />}
        />
        <div className='px-5 pb-5 sm:px-6'>
          <button
            type='button'
            onClick={() => setConfirmOpen(true)}
            className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700'
          >
            <Trash2 size={15} /> Delete my account
          </button>
        </div>
      </Card>

      {confirmOpen && (
        <DeleteAccountDialog onClose={() => setConfirmOpen(false)} deleteAccount={deleteAccount} note={deleteNote} />
      )}
    </div>
  );
};

const Row = ({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) => (
  <li className='flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6'>
    <div className='min-w-0'>
      <p className='text-sm font-medium text-headingColor'>{title}</p>
      <p className='break-words text-sm text-gray-500'>{description}</p>
    </div>
    {action}
  </li>
);

const CONFIRM_WORD = 'DELETE';

const DeleteAccountDialog = ({
  onClose,
  deleteAccount,
  note,
}: {
  onClose: () => void;
  deleteAccount: () => Promise<unknown>;
  note?: string;
}) => {
  const [typed, setTyped] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useMutation({ mutationFn: deleteAccount });
  const logoutUser = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !isPending && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, isPending]);

  const confirm = () =>
    mutate(undefined, {
      onSuccess: () => {
        toast.success('Your account has been deleted');
        logoutUser();
        queryClient.clear();
        router.replace('/');
      },
      onError: (err) => toast.error(handleAxiosError(err)),
    });

  return (
    <div className='fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center' onClick={() => !isPending && onClose()}>
      <div
        role='alertdialog'
        aria-modal='true'
        aria-labelledby='delete-title'
        aria-describedby='delete-desc'
        onClick={(e) => e.stopPropagation()}
        className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'
      >
        <span className='flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600'>
          <AlertTriangle size={20} />
        </span>
        <h3 id='delete-title' className='mt-4 text-lg font-semibold text-headingColor'>
          Delete your account?
        </h3>
        <p id='delete-desc' className='mt-2 text-sm text-gray-500'>
          {note ?? 'Your profile and saved settings will be permanently removed and you will be signed out.'}
        </p>
        <label htmlFor='confirm-delete' className='mt-5 block text-[13px] font-medium text-gray-700'>
          Type <span className='font-mono font-semibold text-red-600'>{CONFIRM_WORD}</span> to confirm
        </label>
        <input
          id='confirm-delete'
          ref={inputRef}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete='off'
          className={`${fieldClass} mt-1.5`}
        />
        <div className='mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <button type='button' onClick={onClose} disabled={isPending} className={secondaryBtn}>
            Cancel
          </button>
          <button
            type='button'
            onClick={confirm}
            disabled={typed !== CONFIRM_WORD || isPending}
            className='inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isPending ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;
