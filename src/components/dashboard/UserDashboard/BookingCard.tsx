import { Calendar, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { appointments } from '@/types/doctors.ds';
import { formatDate } from '@/utils/formatDate';

interface BookingCardProps {
  appointment: appointments;
  onViewDetails: (str: string) => void;
  setBookingDetails: (appointment: appointments) => void;
}

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

function AvatarImage({
  src,
  alt,
  size = 44,
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

export default function BookingCard({
  appointment,
  onViewDetails,
  setBookingDetails,
}: BookingCardProps) {
  const { doctor, isPaid, ticketPrice, createdAt, status } = appointment;

  const handleBookingDetails = () => {
    onViewDetails('details');
    setBookingDetails(appointment);
  };

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 p-5'>
      {/* Doctor row */}
      <div className='flex items-center gap-3 mb-4'>
        <AvatarImage
          src={doctor.photo.imageUrl}
          alt={doctor.name}
          size={48}
          initials={getInitials(doctor.name)}
        />
        <div className='flex-1 min-w-0'>
          <p className='font-semibold text-gray-900 text-[15px] truncate'>
            {doctor.name}
          </p>
          <p className='text-xs text-gray-500 capitalize mt-0.5'>
            {doctor.specialization}
          </p>
        </div>
        <div className='flex flex-col items-end gap-1.5'>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}
          >
            <CheckCircle size={11} />
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

      <div className='h-px bg-gray-100 mb-4' />

      {/* Price + date */}
      <div className='flex items-center justify-between mb-4'>
        <div>
          <p className='text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-0.5'>
            Ticket price
          </p>
          <p className='text-2xl font-semibold text-gray-900'>${ticketPrice}</p>
        </div>
        <div className='text-right'>
          <p className='text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-0.5'>
            Booked on
          </p>
          <div className='flex items-center gap-1.5 text-gray-500 text-sm justify-end'>
            <Calendar size={13} />
            <span>{formatDate({ date: createdAt })}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleBookingDetails}
        className='w-full cursor-pointer flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-150'
      >
        View booking details
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
