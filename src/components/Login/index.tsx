import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginComp = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: '',
      password: '',
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='px-5 lg:px-0'>
      <div className='w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 '>
        <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10 '>
          Hello <span className='text-primaryColor '>Welcome </span>Back 🎉
        </h3>
        <form className='py-4 md:py-0'>
          <div className='mb-5'>
            <input
              type='email'
              placeholder='Enter your email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className='w-full py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer '
            />
          </div>
          <div className='mb-5'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              className='w-full py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer '
            />
          </div>
          <div className='mt-7'>
            <button
              className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 '
              type='submit'
            >
              Login
            </button>
          </div>
          <p className='mt-5 text-textColor text-center '>
            Don&apos;t have an account?{' '}
            <Link to='/signup' className='text-primaryColor font-medium ml-1 '>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginComp;
