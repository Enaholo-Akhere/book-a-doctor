import { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';

const FeedbackForm = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <form action='' onSubmit={handleSubmitReview}>
      <div>
        <h3 className='text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0 '>
          How would you rate the overall experience?*
        </h3>
        <div>
          {[...Array(5).keys()].map((_, index) => {
            index += 1;

            return (
              <button
                key={index}
                type='button'
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
                onDoubleClick={() => {
                  setHover(0);
                  setRating(0);
                }}
                className={`${
                  index <= ((rating && hover) || hover)
                    ? 'text-yellowColor'
                    : 'text-gray-400'
                } bg-transparent border-none outline-none text-[22px] cursor-pointer `}
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className='mt-[30px]'>
        <h3 className='text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0 '>
          Share your feedback or suggestion*
        </h3>
        <textarea
          className='border border-solid border-[#0066FF34] focus:outline outline-primaryColor w-full px-4 py-3 rounded-md'
          rows={5}
          placeholder='Write your here'
          onChange={(e) => setReviewText(e.target.value)}
          value={reviewText}
        ></textarea>
      </div>
      <button type='submit' className='btn mt-5 py-4'>
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
