import { doctorsInterface } from '@/types/doctors.ds';
import starIcon from '@/assets/images/Star.png';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';

const DoctorCard = ({ doctor }: { doctor: doctorsInterface }) => {
  const {
    name,
    avgRating,
    totalRating,
    photo,
    specialization,
    totalPatients,
    hospital,
  } = doctor;
  return (
    <div className='p-3 lg:p-5'>
      <div>
        <img
          src={photo}
          alt='doctor specialization'
          className='w-full rounded'
        />
      </div>
      <h2 className='text-[18px] leading-[30px] lg:text-[22px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5 '>
        {name}
      </h2>
      <div className='mt-2 lg:mt-4 flex items-center justify-between '>
        <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] rounded lg:leading-7 font-semibold '>
          {specialization}
        </span>
        <div className='flex items-center gap-[6px]'>
          <span className='flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor '>
            <img src={starIcon} alt='doctors app' /> {avgRating}
          </span>
          <span className='text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor '>
            {totalRating}{' '}
          </span>
        </div>
      </div>
      <div className='mt-[18px] lg:mt-5 flex items-center justify-between '>
        <div>
          <h3 className='text-[16px] leading-7 lg:text-[18px]  '>
            +{totalPatients} patients
          </h3>
          <p className='text-[13px] lg:text-[15] leading-6 font-[400] text-textColor '>
            At {hospital}
          </p>
        </div>
        <Link
          to='/doctors'
          className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none'
        >
          <BsArrowRight className='group-hover:text-white w-6 h-5' />
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
