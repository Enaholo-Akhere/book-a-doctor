import { user } from '@/types/users';
import BookingCard from './BookingCard';
import { appointments } from '@/types/doctors.ds';
import BookingDetails from '../BookingDetails';
import { useState } from 'react';

const MyBookings = ({ user }: { user: user }) => {
  const [viewingAppointment, setViewingAppointment] =
    useState<string>('bookings');

  const [bookingDetails, setBookingDetails] = useState({} as appointments);

  return (
    <div>
      {!user?.appointments.length && (
        <h2 className='mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor'>
          You have no bookings yet
        </h2>
      )}
      {user?.appointments.length > 0 && (
        <div className='flex flex-col gap-5 '>
          <h6 className='mt-5 text-center leading-7 font-semibold text-gray-600 italic font-[Cormorant_Infant]'>
            CareConnect · Booking Card Mockup
          </h6>
          <div className='flex flex-row justify-between'>
            <h6 className='mt-5 text-center leading-7 text-xl md:text-4xl font-extrabold font-[Cormorant_Infant]   '>
              Your Booking{user?.appointments.length > 1 ? 's' : ''}
            </h6>
            <h6 className='mt-5 text-center leading-7 font-extrabold text-primaryColor  py-1 px-2 rounded'>
              {user.appointments.length} appointments
            </h6>
          </div>

          {viewingAppointment === 'details' && (
            <BookingDetails
              appointment={bookingDetails}
              onBack={setViewingAppointment}
              tabState='bookings'
            />
          )}
          {viewingAppointment === 'bookings' && (
            <div className='grid lg:grid-cols-2 gap-5 mt-5 rounded-lg p-5'>
              {user.appointments.map((appointment) => (
                <div key={appointment._id}>
                  <BookingCard
                    appointment={appointment}
                    onViewDetails={setViewingAppointment}
                    setBookingDetails={setBookingDetails}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
