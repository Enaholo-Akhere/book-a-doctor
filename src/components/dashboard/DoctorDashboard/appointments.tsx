import { formatDate } from '@/utils/formatDate';
import { ShieldCheck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { appointments } from '@/types/doctors.ds';
import { shortId } from '@/utils/helperFunctions';
import { useState } from 'react';
import BookingDetails from '../BookingDetails';

const STATUS_STYLES = {
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

const STATUS_ICONS = {
  approved: <CheckCircle size={11} />,
  pending: <Clock size={11} />,
  cancelled: <XCircle size={11} />,
};

const AppointmentsTable = ({
  appointments,
}: {
  appointments: appointments[];
}) => {
  const [showTable, setShowTable] = useState<string>('table');
  const [selectedAppointment, setSelectedAppointment] = useState(
    {} as appointments
  );

  const handleBookingDetails = (a: appointments) => {
    setShowTable('bookings');
    setSelectedAppointment(a);
  };

  return (
    <div className='w-full overflow-x-auto'>
      {showTable === 'bookings' && (
        <BookingDetails
          appointment={selectedAppointment}
          onBack={setShowTable}
          tabState='table'
        />
      )}
      {showTable === 'table' && (
        <table className='w-full text-sm border-collapse'>
          <thead>
            <tr className='border-b border-gray-200'>
              {[
                '#',
                'Booking ID',
                'Status',
                'Price',
                'Payment',
                'Booked on',
              ].map((h) => (
                <th
                  key={h}
                  className='text-left text-[11px] font-medium uppercase tracking-widest text-gray-400 pb-3 px-3'
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, index) => (
              <tr
                key={a._id}
                className='border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors'
              >
                <td className='px-3 py-3.5 font-mono text-xs text-gray-500'>
                  {index + 1}
                </td>
                <td
                  onClick={() => handleBookingDetails(a)}
                  className='px-3 py-3.5 font-mono text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer'
                  title={a._id}
                >
                  {shortId(a._id)}
                </td>
                <td className='px-3 py-3.5'>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[a.status]}`}
                  >
                    {STATUS_ICONS[a.status]}
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </td>
                <td className='px-3 py-3.5 font-medium text-gray-900'>
                  ${a.ticketPrice}
                </td>
                <td className='px-3 py-3.5'>
                  {a.isPaid ? (
                    <span className='inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200'>
                      <ShieldCheck size={11} /> Paid
                    </span>
                  ) : (
                    <span className='text-gray-300 text-xs'>—</span>
                  )}
                </td>
                <td
                  className='px-3 py-3.5 text-xs text-gray-500'
                  title={a.createdAt}
                >
                  {formatDate({ date: a.createdAt })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentsTable;
