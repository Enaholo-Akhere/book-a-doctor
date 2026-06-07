import {
  ArrowLeft,
  Calendar,
  CreditCard,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { appointments } from '@/types/doctors.ds';
import { formatTime } from '@/utils/formatDate';

interface BookingDetailsProps {
  appointment: appointments;
  onBack: (str: string) => void;
  tabState: string;
}

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

function AvatarImage({
  src,
  alt,
  size = 52,
  initials,
}: {
  src: string;
  alt: string;
  size?: number;
  initials: string;
}) {
  return (
    <div
      className='relative flex-shrink-0 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center'
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        className='w-full h-full object-cover'
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (
            (e.target as HTMLImageElement).nextElementSibling as HTMLElement
          ).style.display = 'flex';
        }}
      />
      <span className='absolute inset-0 hidden items-center justify-center text-blue-600 font-medium text-sm'>
        {initials}
      </span>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={
            i <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i === Math.ceil(rating) && rating % 1 >= 0.5
                ? 'fill-amber-200 text-amber-400'
                : 'fill-transparent text-gray-300'
          }
        />
      ))}
      <span className='text-xs text-gray-500 ml-1'>{rating.toFixed(1)}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3'>
      {children}
    </p>
  );
}

function InfoRow({
  icon,
  day,
  value,
  value2,
}: {
  icon: React.ReactNode;
  day: string;
  value: string;
  value2: string;
}) {
  return (
    <div className='flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 '>
      <span className='flex items-center gap-2 text-sm text-gray-500'>
        {icon}
        {/* {label} */}
      </span>
      <span className='text-sm text-gray-800 font-[Cormorant_Infant] font-semibold'>
        <span className='uppercase font-semibold text-[18px] font-[Cormorant_Infant] text-primaryColor'>
          {day}{' '}
        </span>{' '}
        {value} - {value2}
      </span>
    </div>
  );
}

const BookingDetails = ({
  appointment,
  onBack,
  tabState,
}: BookingDetailsProps) => {
  console.log('Rendering BookingDetails with appointment:', appointment);
  const { _id, doctor, user, isPaid, ticketPrice, status } = appointment;

  return (
    <div className='w-full mx-auto px-5'>
      {/* Back button */}
      <button
        onClick={() => onBack(tabState)}
        className='flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors'
      >
        <ArrowLeft size={16} />
        Back to bookings
      </button>

      <SectionLabel>Booking details</SectionLabel>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5'>
        {/* Header: ID + badges */}
        <div>
          <div className='flex items-start justify-between gap-3 mb-1'>
            <p className='text-[11px] text-gray-400 font-medium'>Booking ID</p>
            <div className='flex gap-2 flex-wrap justify-end'>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {isPaid && (
                <span className='inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200'>
                  <ShieldCheck size={11} />
                  Paid
                </span>
              )}
            </div>
          </div>
          <p className='font-mono text-xs text-gray-500 break-all'>{_id}</p>
        </div>

        <div className='h-px bg-gray-100' />

        {/* Doctor */}
        <div>
          <SectionLabel>Doctor</SectionLabel>
          <div className='flex items-center gap-3'>
            <AvatarImage
              src={doctor.photo.imageUrl}
              alt={doctor.name}
              size={56}
              initials={getInitials(doctor.name)}
            />
            <div>
              <p className='font-semibold text-gray-900 text-[15px]'>
                {doctor.name}
              </p>
              <p className='text-xs text-gray-500 capitalize mb-1.5'>
                {doctor.specialization}
              </p>
              <StarRating rating={doctor.averageRating} />
            </div>
          </div>
        </div>

        <div className='h-px bg-gray-100' />

        {/* Patient */}
        <div>
          <SectionLabel>Patient</SectionLabel>
          <div className='flex items-center gap-3'>
            <AvatarImage
              src={user.photo.imageUrl}
              alt={user.name}
              size={44}
              initials={getInitials(user.name)}
            />
            <div>
              <p className='font-semibold text-gray-900 text-[14px]'>
                {user.name}
              </p>
              <p className='text-xs text-gray-500'>{user.email}</p>
            </div>
          </div>
        </div>

        <div className='h-px bg-gray-100' />

        {/* Timestamps */}
        <div>
          <p className='text-sm text-gray-500  '>Weekly availability</p>
          {doctor.timeSlots &&
            doctor.timeSlots.map((timeSlot) => (
              <InfoRow
                icon={<Calendar size={14} />}
                value={formatTime({
                  time: timeSlot.startingTime.toString(),
                })}
                value2={formatTime({ time: timeSlot.endingTime.toString() })}
                day={timeSlot.day}
              />
            ))}
        </div>

        <div className='h-px bg-gray-100' />

        {/* Price block */}
        <div className='bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between'>
          <div>
            <p className='text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-0.5'>
              Ticket price
            </p>
            <p className='text-2xl font-semibold text-gray-900'>
              ${ticketPrice}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-1'>
              Payment
            </p>
            <span className='inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200'>
              <CreditCard size={11} />
              Stripe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
