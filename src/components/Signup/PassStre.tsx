import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { usePasswordStrength } from '@/Hook/passwordStrength';
import { SignupInterface } from '@/types/doctors.ds';

const PassStrength = ({ formData }: { formData: SignupInterface }) => {
  const { passwordValidation, passwordStrength } = usePasswordStrength(
    formData.password
  );

  const pStrength = (() => {
    if (passwordStrength.length <= 2) {
      return <p className='text-[12px] text-red-600'>Weak Password</p>;
    }
    if (passwordStrength.length === 3) {
      return <p className='text-[12px] text-yellow-500'>Medium Password</p>;
    }
    if (passwordStrength.length === 4) {
      return <p className='text-[12px] text-green-500'>Strong Password</p>;
    }
  })();

  console.log('passwordStrength:', passwordStrength.length);
  return (
    <div className='relative overflow-hidden flex justify-between'>
      <div
        className={`flex  ease-in-out duration-200 lg:justify-start lg:flex-row gap-2 relative ${
          formData.password.length ? 'top-[0px]' : 'top-[-25px]'
        }`}
      >
        <div className='flex justify-between items-center gap-2 text-[11px] font-extralight'>
          <p>Uppercase</p>
          <p className='text-green-500'>
            {passwordValidation.isUpperCase ? (
              <FaCheckCircle className='text-green-500 text-md' />
            ) : (
              <FaTimesCircle className='text-red-500 text-md' />
            )}
          </p>
        </div>
        <div className='flex justify-between items-center gap-2 text-[11px] font-extralight'>
          <p>Length</p>
          <p className='text-green-500'>
            {passwordValidation.isLength ? (
              <FaCheckCircle className='text-green-500 text-md' />
            ) : (
              <FaTimesCircle className='text-red-500 text-md' />
            )}
          </p>
        </div>
        <div className='flex justify-between items-center gap-2 text-[11px] font-extralight'>
          <p>Character</p>
          <p className='text-green-500'>
            {passwordValidation.isCharacter ? (
              <FaCheckCircle className='text-green-500 text-md' />
            ) : (
              <FaTimesCircle className='text-red-500 text-md' />
            )}
          </p>
        </div>
        <div className='flex justify-between items-center gap-2 text-[11px] font-extralight'>
          <p>Number</p>
          <p className='text-green-500'>
            {passwordValidation.isNumber ? (
              <FaCheckCircle className='text-green-500 text-md' />
            ) : (
              <FaTimesCircle className='text-red-500 text-md' />
            )}
          </p>
        </div>
      </div>
      <div
        className={`ease-in-out duration-200 relative ${
          formData.password.length ? 'top-[0px]' : 'top-[-25px]'
        }`}
      >
        {pStrength}
        {/* <p className='text-[12px]'>Weak Password</p> */}
      </div>
    </div>
  );
};

export default PassStrength;
