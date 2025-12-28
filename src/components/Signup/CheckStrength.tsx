import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const CheckStrength = ({
  heading,
  checker,
}: {
  heading: string;
  checker: boolean;
}) => {
  return (
    <div className='flex justify-between items-center gap-2 text-[11px] font-extralight'>
      <p>{heading}</p>
      <p className='text-green-500'>
        {checker ? (
          <FaCheckCircle className='text-green-500 text-md' />
        ) : (
          <FaTimesCircle className='text-red-500 text-md' />
        )}
      </p>
    </div>
  );
};

export default CheckStrength;
