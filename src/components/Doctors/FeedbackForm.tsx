import { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import Button from '../Button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReviews } from '@/Hook/reviews';
import toast from 'react-hot-toast';
import { feedbackSchema, feedbackType } from '@/utils/authSchema';
import { handleAxiosError } from '@/utils/axiosError';
import { queryClient } from '@/library/provider/reactQuery';
import { QUERY_KEYS } from '@/constants/queryKeys';

const FeedbackForm = ({ doctorId }: { doctorId: string }) => {
  const [hover, setHover] = useState<number>(0);
  const { mutate, isPending, error } = useReviews();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<feedbackType>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      reviewText: '',
    },
  });

  const submitHandler = (data: feedbackType) => {
    const formData = new FormData();
    formData.append('rating', data.rating.toString());
    formData.append('reviewText', data.reviewText);

    mutate(
      { id: doctorId, payload: data },
      {
        onSuccess: () => {
          toast.success('Review submitted successfully');
          reset();
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.DOCTOR_BY_ID, doctorId],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.ALL_DOCTORS],
          });
        },
        onError: () => {
          toast.error(handleAxiosError(error));
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div>
        <h3 className='text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0'>
          How would you rate the overall experience?*
        </h3>
        <Controller
          name='rating'
          control={control}
          render={({ field }) => (
            <div className='flex'>
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => field.onChange(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(field.value)}
                  onDoubleClick={() => {
                    setHover(0);
                    field.onChange(0);
                  }}
                  className={`${
                    index <= ((field.value && hover) || hover)
                      ? 'text-yellowColor'
                      : 'text-gray-400'
                  } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                >
                  <AiFillStar />
                </button>
              ))}
            </div>
          )}
        />
        {errors.rating && (
          <p className='text-red-500 text-sm mt-1'>{errors.rating.message}</p>
        )}
      </div>

      {/* Review Text */}
      <div className='mt-[30px]'>
        <h3 className='text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0'>
          Share your feedback or suggestion*
        </h3>
        <textarea
          {...register('reviewText')}
          className='border border-solid border-[#0066FF34] focus:outline outline-primaryColor w-full px-4 py-3 rounded-md'
          rows={5}
          placeholder='Write your review here'
        />
        {errors.reviewText && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.reviewText.message}
          </p>
        )}
      </div>

      <Button
        title={isPending ? 'Submitting...' : 'Submit Feedback'}
        bgColor='bg-primaryColor'
        txtColor='text-white'
        btnWidth='w-fit'
        px='md:px-[30px] px-[20px]'
        py='md:py-4 py-3'
        classNameProps='mt-5'
        disabled={isPending}
      />
    </form>
  );
};

export default FeedbackForm;
