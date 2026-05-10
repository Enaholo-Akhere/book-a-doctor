import { doctorsInterface } from '@/types/doctors.ds';
import { formatDate } from '@/utils/formatDate';

const DoctorAbout = ({ data }: { data: Partial<doctorsInterface> }) => {
  return (
    <div>
      <div>
        <h3 className='text-[20px ] leading-[30px] text-headingColor font-semibold flex items-center gap-2 '>
          About of
          <span className='text-irisBlueColor font-bold text-[22 px] leading-9 '>
            {data.name}
          </span>
        </h3>
        <p className='text__para'>{data.about}</p>
      </div>
      <div className='mt-12'>
        <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold '>
          Education
        </h3>
        <ul className='pt-4 md:p-5'>
          {data.qualifications?.map((qualification) => (
            <li
              key={qualification._id}
              className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px] '
            >
              <div>
                <span className='text-irisBlueColor text-[15px] leading-6 font-semibold '>
                  {formatDate({ date: qualification.startDate.toString() })} -{' '}
                  {formatDate({ date: qualification.endDate.toString() })}
                </span>
                <p className='text-[15px] leading-6 font-medium text-textColor '>
                  {qualification.degree}
                </p>
              </div>
              <p className='text-[16px] leading-5 font-medium text-textColor '>
                {qualification.university}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className='mt-12'>
        <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold '>
          Experience
        </h3>
        <ul className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5 '>
          {data.experiences?.map((experience) => (
            <li
              key={experience._id}
              className='p-4 rounded bg-[#FFF9EA]  flex flex-col gap-2 justify-between'
            >
              <span className='text-yellowColor text-[15px] leading-6 font-semibold '>
                {formatDate({ date: experience.startDate.toString() })}
              </span>
              <p className='text-[16px] leading-6 font-medium text-textColor '>
                {experience.position}
              </p>
              <p className='text-[14px] leading-5 font-medium text-textColor '>
                {experience.hospital}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorAbout;
