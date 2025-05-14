import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// import patientsAvatar from '@/assets/images/patient-avatar.png';
import 'swiper/css';
import 'swiper/css/pagination';
import { HiStar } from 'react-icons/hi';
import { Reviews } from '@/assets/data/reviews';
import { ReviewInterface } from '@/types/doctors.ds';

const TestimonialSwiper = () => {
  return (
    <div className='mt-[30px] lg:mt-[55px]'>
      <Swiper
        modules={[Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {Reviews.map((review: ReviewInterface) => {
          const handleRatings = (rating: number) => {
            const star = [];
            for (let i = 0; i < rating; i++) {
              star.push(<HiStar className='text-yellowColor W-[18px] h-5 ' />);
            }
            return star;
          };

          return (
            <SwiperSlide key={review.id}>
              <div className=' p-2 rounded-3 mb-[20px]'>
                <div className='flex items-center gap-[20px] '>
                  <div className='w-[50px] h-[50px]'>
                    <img
                      src={review.photo}
                      alt='patient avatar'
                      className='w-full h-full rounded'
                    />
                  </div>
                  <div>
                    <h4 className='text-[18px] leading-[30px] font-semibold text-headingColor '>
                      {review.name}
                    </h4>
                    <div className='flex items-center gap-[2px]'>
                      {handleRatings(review.ratings)}
                    </div>
                  </div>
                </div>
                <p className='text-[16px] leading-7 mt-4 text-textColor font-[400] '>
                  {review.comment}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default TestimonialSwiper;
