import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointments } from '@/types/doctors.ds';
import { useUpdateBookingStatus } from '@/Hook/useDoctors';
import { queryClient } from '@/library/provider/reactQuery';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { handleAxiosError } from '@/utils/axiosError';

/** Confirm / decline a pending booking in one tap. Renders nothing for other statuses. */
const StatusActions = ({ appointment, compact = false }: { appointment: appointments; compact?: boolean }) => {
  const { mutate, isPending, variables } = useUpdateBookingStatus();

  if (appointment.status !== 'pending') return null;

  const update = (status: 'approved' | 'cancelled') => {
    if (status === 'cancelled' && !window.confirm(`Decline ${appointment.user?.name ?? 'this patient'}'s booking?`)) return;
    mutate(
      { bookingId: appointment._id, status },
      {
        onSuccess: (res) => {
          toast.success(res?.message ?? 'Appointment updated');
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTOR_ME] });
        },
        onError: (err) => toast.error(handleAxiosError(err)),
      }
    );
  };

  const busy = (s: string) => isPending && variables?.status === s;
  const base = `inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
    compact ? 'h-9 px-3' : 'px-3.5 py-2'
  }`;

  return (
    <div className='flex gap-2' onClick={(e) => e.stopPropagation()}>
      <button
        type='button'
        disabled={isPending}
        onClick={() => update('approved')}
        className={`${base} bg-primaryColor text-white hover:bg-primaryColor2`}
      >
        <Check size={15} /> {busy('approved') ? 'Confirming…' : 'Confirm'}
      </button>
      <button
        type='button'
        disabled={isPending}
        onClick={() => update('cancelled')}
        aria-label='Decline booking'
        className={`${base} border border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600`}
      >
        <X size={15} /> {compact ? '' : busy('cancelled') ? 'Declining…' : 'Decline'}
      </button>
    </div>
  );
};

export default StatusActions;
