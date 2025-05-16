import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import signupImg from '@/assets/images/signup.gif';
import { SignupInterface } from '@/types/doctors.ds';
import avatar from '@/assets/images/doctor-img01.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PassStrength from './PassStre';

const SignupComp = () => {
  const [selectedFile, setSelectedFile] = useState<File>(new File([], ''));
  //   const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupInterface>({
    email: '',
    password: '',
    name: '',
    photo: selectedFile,
    gender: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {}, []);

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const File = e.target.files[0];
      setSelectedFile(File);
    }
  };
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  const classStylings =
    'w-full pr-4 py-3 border-b border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer';

  return (
    <div className='px-5 lg:px-0'>
      <div className='w-full max-w-[1170px] mx-auto rounded-lg shadow-md md:p-10 '>
        <div className='grid grid-cols-1 lg:grid-cols-2 px-3'>
          <div className='hidden lg:block bg-primaryColor rounded-l-lg w-[500px] h-[400px]'>
            <figure className='rounded-l-lg '>
              <img
                src={signupImg}
                alt='register | book a doctor'
                className='w-full h-full rounded-l-lg'
              />
            </figure>
          </div>
          <div className='rounded-l-lg lg:pl-16 py-10'>
            <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10  '>
              Create an <span className='text-primaryColor'>account</span>
              <form className='py-4 md:py-0' onSubmit={submitHandler}>
                <div className='mb-3'>
                  <input
                    type='text'
                    placeholder='Full Name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className={classStylings}
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='email'
                    placeholder='Enter your email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className={classStylings}
                  />
                </div>
                <div>
                  <div className='mb-3 flex border-b-1'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      className='w-full pr-4 py-3  border-solid border-[#0066FF61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((prev) => !prev)}
                      className=' text-gray-600 hover:text-gray-800 focus:outline-none'
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                  {<PassStrength formData={formData} />}
                </div>
                <div className='mb-3 flex items-center justify-between '>
                  <label className='text-headingColor font-bold text-[15px] leading-7 '>
                    Are you a:
                    <select
                      name='role'
                      onChange={handleInputChange}
                      className='text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none '
                    >
                      <option value='patient'>Patient</option>
                      <option value='doctor'>Doctor</option>
                    </select>
                  </label>
                  <label className='text-headingColor font-bold text-[15px] leading-7 '>
                    Gender
                    <select
                      name='gender'
                      value={formData.gender}
                      onChange={handleInputChange}
                      className='text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none '
                    >
                      <option value=''>Select Gender</option>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                    </select>
                  </label>
                </div>
                <div className='mb-3 flex items-center gap-3 '>
                  <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center '>
                    <img
                      src={avatar}
                      alt='signup | book a doctor'
                      className='w-full rounded-full'
                    />
                  </figure>
                  <div className='relative w-[130px] h-[50px] '>
                    <input
                      type='file'
                      name='photo'
                      id='customFile'
                      onChange={handleFileInputChange}
                      accept='.jpg, .png, .jpeg'
                      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer  '
                    />
                    <label
                      htmlFor='customFile'
                      className='absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer '
                    >
                      Upload Photo
                    </label>
                  </div>
                </div>
                <div className='mt-7'>
                  <button
                    className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 '
                    type='submit'
                  >
                    Signup
                  </button>
                </div>
                <p className='mt-5 text-textColor text-center text-[15px] font-bold '>
                  Already have an account?{' '}
                  <Link
                    to='/login'
                    className='text-primaryColor font-medium ml-1 '
                  >
                    Login
                  </Link>
                </p>
              </form>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupComp;
