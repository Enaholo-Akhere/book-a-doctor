import { useSearchParams } from 'react-router-dom';
import { useBookingTransactionFlutterwave } from '@/Hook/useBooking';
import Loading from '../Loader';
import Button from '../Button';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction_id') || '';
  const doctorId = searchParams.get('doctorId') || '';
  const { isLoading, data, isError } = useBookingTransactionFlutterwave(
    transactionId,
    doctorId
  );

  if (isLoading) {
    return (
      <div className='flex justify-center py-20 text-gray-500'>
        <Loading />
      </div>
    );
  }

  if (isError || !data || data.status !== 'successful') {
    return (
      <div className='max-w-md mx-auto mt-10 bg-white rounded-xl border border-gray-200 p-8 text-center'>
        <div className='w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4'>
          <i className='ti ti-x text-2xl text-red-600' />
        </div>
        <h1 className='text-lg font-medium mb-1'>Payment failed</h1>
        <p className='text-sm text-gray-500'>
          We couldn't verify your payment. Please try again.
        </p>
      </div>
    );
  }
  if (data && !isError) {
    return (
      <div className='max-w-md mx-auto mt-10 bg-white rounded-xl border border-gray-200 p-8 text-center'>
        <div className='w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4'>
          <i className='ti ti-check text-2xl text-green-600' />
        </div>
        <h1 className='text-lg font-medium mb-1'>Payment successful</h1>
        <p className='text-sm text-gray-500 mb-6'>
          Your booking has been confirmed
        </p>

        <div className='bg-gray-50 rounded-lg p-4 text-left text-sm space-y-3'>
          <Row
            label='Amount paid'
            value={`${data.currency} ${data.amount.toLocaleString()}`}
          />
          <Row label='Transaction ID' value={data.transaction_id} />
          <Row label='Reference' value={data.tx_ref} />
          <Row
            label='Date'
            value={new Date(data.created_at).toLocaleDateString()}
          />
          <Row
            label='Status'
            value={
              <span className='bg-green-50 text-green-700 text-xs px-2.5 py-0.5 rounded-md'>
                Completed
              </span>
            }
          />
        </div>
        <Button
          title='Go to my bookings'
          onClick={() => (window.location.href = '/users/profile/me')}
          bgColor='bg-gray-900'
          txtColor='text-white'
          bgHover='hover:bg-gray-600'
          classNameProps='w-full mt-6 font-medium py-2.5 rounded-lg  '
        />
      </div>
    );
  }
};

export default PaymentSuccessPage;

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className='flex justify-between items-center'>
    <span className='text-gray-500'>{label}</span>
    <span className='font-medium'>{value}</span>
  </div>
);
