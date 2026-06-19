import { doctorsInterface } from '@/types/doctors.ds';
import Button from '../Button';
import { formatTime } from '@/utils/formatDate';
import { useBookingsFlutterwave, useBookingsStripe } from '@/Hook/useBooking';
import { toast } from 'react-hot-toast';
import { handleAxiosError } from '@/utils/axiosError';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../Loader';
import { formatCurrency } from '@/utils/formartCurrency';

const SidePanel = ({ data }: { data: doctorsInterface }) => {
  const { mutate, isPending: sIsPending } = useBookingsStripe();
  const { mutate: fMutate, isPending: fIsPending } = useBookingsFlutterwave();
  const geolocation = useAuthStore((state) => state.geolocation);
  console.log('geolocation data from useAuth sTATE', geolocation);
  const [price, setPrice] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isPending = sIsPending || fIsPending;

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    if (geolocation) {
      const tPrice = data.ticketPrice * geolocation.exchangeRate;
      setPrice(tPrice);
      console.log(
        'exch rate:',
        geolocation.exchangeRate,
        'code:',
        geolocation.countryCode,
        'currency:',
        geolocation.currency,
        'price:',
        tPrice
      );
    }

    setIsLoading(false);
  }, [data.ticketPrice, geolocation]);

  const userSet = new Set(user?.appointments);

  const disabledButton = data?.appointments?.some((app) => userSet.has(app));

  const handleBookingStripe = () => {
    mutate(
      { doctorId: data?._id ? data._id : '' },
      {
        onSuccess: (data) => {
          if (data?.url) {
            window.location.href = data.url;
          } else {
            toast.error('Failed to create booking session.');
          }
        },
        onError: (error) => {
          toast.error(handleAxiosError(error));
        },
      }
    );
  };

  const handleBookingFlutterwave = () => {
    if (data) {
      console.log('doctor id', data._id);
      fMutate(
        {
          email: data.email,
          amount: price,
          name: data.name,
          doctorId: data._id,
        },
        {
          onSuccess: (resp) => {
            console.log('data from flutterwave', resp.data);
            if (resp.data.link) {
              window.location.href = resp.data.link;
            } else {
              toast.error('Failed to create booking session.');
            }
          },
          onError: (error) => {
            toast.error(handleAxiosError(error));
          },
        }
      );
    } else {
      toast.error('Doctor info not found');
    }
  };

  // const handleBookingFN = () => (user ? handleBookingStripe() : navigate('/login'));

  const handleBookingFNFlutterwave = () =>
    user ? handleBookingFlutterwave() : navigate('/login');
  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && geolocation && (
        <div className='shadow-xl p-3 lg:p-5 rounded-md '>
          <div className='flex items-center justify-between'>
            <p className='text__para mt-0 font-semibold'>Ticket Price</p>
            <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold '>
              {formatCurrency(price, geolocation.currency)}
            </span>
          </div>
          <div className='mt-[30px] '>
            <p className='text__para mt-0 font-semibold text-headingColor '>
              Available time slots:
            </p>
            <ul className='mt-3'>
              {data?.timeSlots?.map((slot) => (
                <li
                  key={slot._id}
                  className='flex items-center justify-between mb-2'
                >
                  <p className='text-[15px] leading-6 text-textColor font-semibold'>
                    {slot.day}
                  </p>
                  <p className='text-[15px] leading-6 text-textColor font-semibold'>
                    {formatTime({ time: slot.startingTime.toString() })} -{' '}
                    {formatTime({ time: slot.endingTime.toString() })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <Button
            title={
              isPending
                ? 'Processing...'
                : disabledButton
                  ? 'Already Booked!'
                  : 'Book Appointment'
            }
            classNameProps='btn px-2 w-full rounded-md py-4 '
            onClick={handleBookingFNFlutterwave}
            bgColor={`${isPending || disabledButton ? 'bg-gray-500 ' : 'bg-primaryColor'}`}
            disabled={isPending || disabledButton}
          />
        </div>
      )}
    </>
  );
};
export default SidePanel;
