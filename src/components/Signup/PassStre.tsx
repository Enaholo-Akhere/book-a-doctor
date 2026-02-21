import { usePasswordStrength } from '@/Hook/passwordStrength';
import CheckStrength from './CheckStrength';

const PassStrength = ({ password }: { password: string }) => {
  const { passwordValidation, passwordStrength } =
    usePasswordStrength(password);

  const PStrength = () => {
    if (passwordStrength.length <= 2) {
      return <p className='text-[12px] text-red-600'>Weak Password</p>;
    }
    if (passwordStrength.length === 3) {
      return <p className='text-[12px] text-yellow-500'>Medium Password</p>;
    }
    if (passwordStrength.length === 4) {
      return <p className='text-[12px] text-green-500'>Strong Password</p>;
    }
  };

  return (
    <div className=' flex justify-between gap-x-10 flex-wrap'>
      <div
        className={`flex  ease-in-out duration-200 lg:justify-start lg:flex-row gap-2 `}
      >
        <CheckStrength
          heading='Uppercase'
          checker={passwordValidation.isUpperCase}
        />
        <CheckStrength heading='Length' checker={passwordValidation.isLength} />
        <CheckStrength
          heading='Character'
          checker={passwordValidation.isCharacter}
        />
        <CheckStrength heading='Number' checker={passwordValidation.isNumber} />
      </div>
      <div className={`ease-in-out duration-200 `}>{<PStrength />}</div>
    </div>
  );
};

export default PassStrength;
