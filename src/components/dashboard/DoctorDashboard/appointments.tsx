import { formatDate } from '@/utils/formatDate';
import React from 'react';
import { appointments } from '@/types/doctors.ds';

const Appointments = ({ appointments }: { appointments: appointments[] }) => {
  return (
    <table className='w-full text-left text-sm text-gray-500'>
      <thead>
        <tr>
          <th scope='col' className='py-3 px-6'>
            Name
          </th>
          <th scope='col' className='py-3 px-6'>
            Gender
          </th>
          <th scope='col' className='py-3 px-6'>
            Payment
          </th>
          <th scope='col' className='py-3 px-6'>
            Price
          </th>
          <th scope='col' className='py-3 px-6'>
            Booked on
          </th>
        </tr>
      </thead>
      <tbody>
        {appointments?.map((appointment) => (
          <tr key={appointment._id}>
            <th
              scope='row'
              className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap '
            >
              <img
                src={appointment.photo.imageUrl}
                alt='appointment-image-url'
                className='w-10 h-10 rounded-full'
              />
              <div className='pl-3'>
                <div className='text-base font-semibold'>
                  {appointment.user.name}
                </div>
                <div className='text-normal text-gray-500'>
                  {appointment.user.email}
                </div>
              </div>
            </th>
            <td className='px-6 py-4'>{appointment.user.gender}</td>
            <td className='px-6 py-4'>
              {appointment.isPaid && (
                <span className='flex items-center'>
                  <span className='h-2.5 w-2.5  rounded-full bg-green-500 mr-2'>
                    Paid
                  </span>
                </span>
              )}
              {!appointment.isPaid && (
                <span className='flex items-center'>
                  <span className='h-2.5 w-2.5  rounded-full bg-green-500 mr-2'>
                    Unpaid
                  </span>
                </span>
              )}
            </td>
            <td className='px-6 py-4'> ${appointment.ticketPrice} </td>
            <td className='px-6 py-4'>
              {' '}
              {formatDate({ date: appointment.createdAt })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Appointments;
