import { doctorsInterface } from '@/types/doctors.ds';
import starIconAsset from '@/assets/images/Star.png';
import Link from 'next/link';
import { BsArrowRight } from 'react-icons/bs';
import CardMotion from '../Motions/cardMotion';

const starIcon: string = starIconAsset.src;

const DoctorCard = ({
  doctor,
  url,
}: {
  doctor: doctorsInterface;
  url: string;
}) => {
  const {
    name,
    averageRating,
    totalRating,
    photo,
    specialization,
    totalPatients,
    experiences,
  } = doctor;

  return (
    <CardMotion styling=''>
      <div className='p-3 lg:p-5 w-full'>
        <div>
          <img
            src={photo.imageUrl}
            alt={`${name}, ${specialization}`}
            className='w-full rounded'
          />
        </div>
        <h2 className='text-[16px] leading-[30px] h-[30px] lg:text-[20px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5 '>
          {name}
        </h2>
        <div className='mt-2 lg:mt-4 flex items-center justify-between '>
          <span className='bg-primary-50 text-primary-700 py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] rounded lg:leading-7 font-semibold '>
            {specialization}
          </span>
          <div className='flex items-center gap-[6px]'>
            <span className='flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor '>
              <img src={starIcon} alt='doctors app' /> {averageRating}
            </span>
            <span className='text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor '>
              ({totalRating})
            </span>
          </div>
        </div>
        <div className='mt-[18px] lg:mt-5 flex items-center justify-between flex-nowrap gap-2 '>
          <div>
            <h3 className='text-[16px] leading-7 lg:text-[18px]  '>
              +{totalPatients} patients
            </h3>
            <p
              className={`truncate ${url.includes('/doctor/') ? 'md:w-[100px] lg:w-[100px] xl:w-[100px]' : 'md:w-[100px] lg:w-[150px] xl:w-full'} w-full  text-[13px] lg:text-[15] leading-6 font-[400] text-textColor flex-wrap`}
            >
              At {experiences[experiences.length - 1].hospital}
            </p>
          </div>
          <Link
            href={url}
            className='flex-nowrap w-[44px] h-[44px] md:w-[30px] md:h-[30px] xl:w-[44px] xl:h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none'
          >
            <BsArrowRight className='group-hover:text-white w-6 h-6' />
          </Link>
        </div>
      </div>
    </CardMotion>
  );
};

export default DoctorCard;
