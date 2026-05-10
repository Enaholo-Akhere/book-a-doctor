import { doctorsInterface } from '@/types/doctors.ds';
import Button from '../Button';
import { formatTime } from '@/utils/formatDate';

const SidePanel = ({ data }: { data: doctorsInterface | undefined }) => {
  return (
    <div className='shadow-xl p-3 lg:p-5 rounded-md '>
      <div className='flex items-center justify-between'>
        <p className='text__para mt-0 font-semibold'>Ticket Price</p>
        <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold '>
          {data?.ticketPrice} USD
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
        title='Book Appointment'
        classNameProps='btn px-2 w-full rounded-md py-4'
      />
    </div>
  );
};

export default SidePanel;
