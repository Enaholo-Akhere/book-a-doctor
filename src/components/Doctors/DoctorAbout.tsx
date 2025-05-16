import { formatDate } from '@/utils/formatDate';

const DoctorAbout = () => {
  return (
    <div>
      <div>
        <h3 className='text-[20px ] leading-[30px] text-headingColor font-semibold flex items-center gap-2 '>
          About of
          <span className='text-irisBlueColor font-bold text-[22 px] leading-9 '>
            Richard Hughes
          </span>
        </h3>
        <p className='text__para'>
          Dr. Richard Hughes is a highly respected surgeon known for his
          expertise in minimally invasive procedures and patient-centered care.
          With years of experience in the medical field, he is dedicated to
          advancing surgical techniques and improving outcomes. His
          professionalism and compassion have earned him recognition among peers
          and patients alike
        </p>
      </div>
      <div className='mt-12'>
        <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold '>
          Education
        </h3>
        <ul className='pt-4 md:p-5'>
          <li className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px] '>
            <div>
              <span className='text-irisBlueColor text-[15px] leading-6 font-semibold '>
                {formatDate({ date: '06-23-2011' })} -{' '}
                {formatDate({ date: '09-16-2016' })}
              </span>
              <p className='text-[15px] leading-6 font-medium text-textColor '>
                PhD in Surgery{' '}
              </p>
            </div>
            <p className='text-[16px] leading-5 font-medium text-textColor '>
              Johns Hopkins University, Baltimore.{' '}
            </p>
          </li>
          <li className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px] '>
            <div>
              <span className='text-irisBlueColor text-[15px] leading-6 font-semibold '>
                {formatDate({ date: '03-05-2006' })} -{' '}
                {formatDate({ date: '06-23-2010' })}
              </span>
              <p className='text-[15px] leading-6 font-medium text-textColor '>
                Doctor of Medicine (MD)
              </p>
            </div>
            <p className='text-[16px] leading-5 font-medium text-textColor '>
              Harvard Medical School, Boston.
            </p>
          </li>
        </ul>
      </div>
      <div className='mt-12'>
        <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold '>
          Experience
        </h3>
        <ul className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5 '>
          <li className='p-4 rounded bg-[#FFF9EA] '>
            <span className='text-yellowColor text-[15px] leading-6 font-semibold '>
              {formatDate({ date: '11-16-2017' })}
            </span>
            <p className='text-[16px] leading-6 font-medium text-textColor '>
              Sr. Surgeon
            </p>
            <p className='text-[14px] leading-5 font-medium text-textColor '>
              New Olives Hospital, New York.
            </p>
          </li>
          <li className='p-4 rounded bg-[#FFF9EA] '>
            <span className='text-yellowColor text-[15px] leading-6 font-semibold '>
              {formatDate({ date: '05-26-2024' })}
            </span>
            <p className='text-[16px] leading-6 font-medium text-textColor '>
              Consultant
            </p>
            <p className='text-[14px] leading-5 font-medium text-textColor '>
              St Thomas Hospital, Massachusetts.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DoctorAbout;
