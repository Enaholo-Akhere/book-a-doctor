import { useBookingSession } from '@/Hook/booking';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// ── Icons (keep all your existing icon components) ──────────────────────────
const CheckIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    className='w-8 h-8 text-white'
    stroke='currentColor'
    strokeWidth={2.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M4.5 12.75l6 6 9-13.5'
    />
  </svg>
);
const CalendarIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    className='w-5 h-5'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <rect x='3' y='4' width='18' height='18' rx='2' />
    <path strokeLinecap='round' d='M16 2v4M8 2v4M3 10h18' />
  </svg>
);
const UserIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    className='w-5 h-5'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <circle cx='12' cy='7' r='4' />
    <path strokeLinecap='round' d='M4 21c0-4 3.582-7 8-7s8 3 8 7' />
  </svg>
);
const ShieldIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    className='w-4 h-4'
    stroke='currentColor'
    strokeWidth={1.8}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 2l7 3.5V11c0 4.5-3.5 8-7 9-3.5-1-7-4.5-7-9V5.5L12 2z'
    />
    <path strokeLinecap='round' strokeLinejoin='round' d='M9 12l2 2 4-4' />
  </svg>
);

// ── Detail Row ───────────────────────────────────────────────────────────────
const Detail = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className='flex items-start gap-3'>
    <span className='text-teal-600 mt-0.5 flex-shrink-0'>{icon}</span>
    <div>
      <p className='text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5'>
        {label}
      </p>
      <p className='text-slate-800 font-medium text-sm'>{value}</p>
    </div>
  </div>
);

// ── Skeleton Loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

// ── Main Component ───────────────────────────────────────────────────────────
const CheckoutSuccess = () => {
  const [visible, setVisible] = useState(false);
  const [ringExpand, setRingExpand] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get('session_id');

  const { data: booking, isLoading, isError } = useBookingSession(sessionId);

  useEffect(() => {
    const t1 = setTimeout(() => setRingExpand(true), 100);
    const t2 = setTimeout(() => setVisible(true), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const doctorName = booking?.doctor?.name ?? '—';
  const specialization = booking?.doctor?.specialization ?? '';
  const patientName = booking?.user?.name ?? '—';
  const amount = booking?.ticketPrice ?? '—';
  const bookingRef = booking?._id?.toString().slice(-8).toUpperCase() ?? '—';
  const bookedOn = booking?.createdAt
    ? new Date(booking.createdAt).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <div
      className='min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden'
      style={{
        background:
          'linear-gradient(145deg, #f0fdf9 0%, #f8fafc 50%, #eff6ff 100%)',
        fontFamily: "'Georgia', 'Palatino', serif",
      }}
    >
      {/* Background rings */}
      <div
        className='absolute rounded-full border border-teal-100 pointer-events-none transition-all duration-[1400ms] ease-out'
        style={{
          width: ringExpand ? 700 : 0,
          height: ringExpand ? 700 : 0,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.6,
        }}
      />
      <div
        className='absolute rounded-full border border-teal-50 pointer-events-none transition-all duration-[1800ms] ease-out'
        style={{
          width: ringExpand ? 1000 : 0,
          height: ringExpand ? 1000 : 0,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.4,
        }}
      />

      {/* Card */}
      <div
        className='relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden'
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        {/* Teal header */}
        <div
          className='flex flex-col items-center pt-10 pb-8 px-6'
          style={{
            background: 'linear-gradient(160deg, #0d9488 0%, #0f766e 100%)',
          }}
        >
          <div className='mb-6 flex items-center gap-2'>
            <div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center'>
              <div className='w-3 h-3 rounded-full bg-white' />
            </div>
            <span
              className='text-white text-lg tracking-wide'
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.04em' }}
            >
              CareConnect
            </span>
          </div>
          <div className='relative mb-4'>
            <div className='w-20 h-20 rounded-full bg-white/15 flex items-center justify-center border-4 border-white/30'>
              <div className='w-14 h-14 rounded-full bg-white/20 flex items-center justify-center'>
                <CheckIcon />
              </div>
            </div>
          </div>
          <h1
            className='text-white text-2xl font-semibold mb-1 text-center'
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Booking Confirmed
          </h1>
          <p className='text-teal-100 text-sm text-center font-light tracking-wide'>
            Your appointment has been successfully scheduled
          </p>
        </div>

        {/* Booking reference pill */}
        <div className='flex justify-center -mt-4 mb-0 px-6 relative z-10'>
          <div className='bg-white border border-slate-200 shadow-md rounded-full px-5 py-2 flex items-center gap-2'>
            <span className='text-xs text-slate-400 uppercase tracking-widest font-semibold'>
              Ref
            </span>
            {isLoading ? (
              <Skeleton className='w-24 h-4' />
            ) : (
              <span className='text-sm font-mono font-bold text-slate-700 tracking-wider'>
                {bookingRef}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className='px-8 pt-7 pb-8'>
          {isError && (
            <div className='mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm text-center'>
              Could not load booking details. Your payment was successful.
            </div>
          )}

          {/* Appointment details */}
          <div className='space-y-5 mb-7'>
            <Detail
              icon={<UserIcon />}
              label='Healthcare Professional'
              value={
                isLoading
                  ? '...'
                  : `${doctorName}${specialization ? ` — ${specialization}` : ''}`
              }
            />
            <div className='h-px bg-slate-100' />
            <Detail
              icon={<UserIcon />}
              label='Patient'
              value={isLoading ? '...' : patientName}
            />
            <div className='h-px bg-slate-100' />
            <Detail
              icon={<CalendarIcon />}
              label='Booked On'
              value={isLoading ? '...' : bookedOn}
            />
          </div>

          {/* Payment summary */}
          <div className='bg-slate-50 rounded-2xl p-5 mb-7 border border-slate-100'>
            <p className='text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4'>
              Payment Summary
            </p>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between text-slate-600'>
                <span>Consultation Fee</span>
                {isLoading ? (
                  <Skeleton className='w-16 h-4' />
                ) : (
                  <span>${amount} USD</span>
                )}
              </div>
              <div className='h-px bg-slate-200 my-2' />
              <div className='flex justify-between font-bold text-slate-800'>
                <span>Total Paid</span>
                {isLoading ? (
                  <Skeleton className='w-16 h-4' />
                ) : (
                  <span className='text-teal-700'>${amount} USD</span>
                )}
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className='flex gap-2 items-start mb-7 text-slate-500 text-xs leading-relaxed'>
            <span className='text-teal-500 mt-0.5 flex-shrink-0'>
              <ShieldIcon />
            </span>
            <p>
              A confirmation has been sent to your registered email. Your data
              is secured and private.
            </p>
          </div>

          {/* Actions */}
          <div className='flex flex-col gap-3'>
            <button
              onClick={() => navigate('/home')}
              className='w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-200 active:scale-[0.98]'
              style={{
                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                boxShadow: '0 4px 14px rgba(13,148,136,0.35)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 6px 20px rgba(13,148,136,0.5)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 4px 14px rgba(13,148,136,0.35)')
              }
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/users/profile/me')}
              className='w-full py-3.5 rounded-xl text-slate-600 font-semibold text-sm tracking-wide border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]'
            >
              View My Appointments
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p
        className='mt-6 text-xs text-slate-400 text-center z-10'
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.4s',
        }}
      >
        Need help?{' '}
        <a
          href='#'
          className='text-teal-600 underline underline-offset-2 hover:text-teal-700'
        >
          Contact CareConnect Support
        </a>
      </p>
    </div>
  );
};

export default CheckoutSuccess;
