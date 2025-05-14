import avatarIcon from '@/assets/images/avatar-icon.png';
import { formatDate } from '@/utils/formatDate';
import { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import FeedbackForm from './FeedbackForm';

const Feedback = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);
  return (
    <div>
      <div className='mb-[50px]'>
        <h4 className='text-[20px] leading-[30px] font-bold text-headingColor mb-[30px] '>
          All reviews (326)
        </h4>
        <div className='flex justify-between gap-10 mb-[30px] '>
          <div className='flex gap-3'>
            <figure className='w-10 h-10 rounded-full'>
              <img
                src={avatarIcon}
                alt='client feedback | book a doctor'
                className='w-full'
              />
            </figure>
            <div>
              <h5 className='text-[16px] leading-6 text-primaryColor font-bold '>
                Tom Benjamin
              </h5>
              <p className='text-[14px] leading-6 text-textColor '>
                {formatDate({ date: '05-14-2025' })}
              </p>
              <p className='text__para mt-3 font-medium text-[15px] '>
                Good services, highly recommend 👍
              </p>
            </div>
          </div>
          <div className='flex gap-1'>
            {[...Array(5).keys()].map((_, index) => (
              <AiFillStar key={index + 1} color='#0067FF' />
            ))}
          </div>
        </div>
      </div>
      {!showFeedbackForm && (
        <div className='text-center'>
          <button
            onClick={() => setShowFeedbackForm(true)}
            className='btn cursor-pointer py-4'
          >
            Give Feedback
          </button>
        </div>
      )}
      {showFeedbackForm && <FeedbackForm />}
    </div>
  );
};

export default Feedback;
