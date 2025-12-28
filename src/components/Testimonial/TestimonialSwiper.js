import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// import patientsAvatar from '@/assets/images/patient-avatar.png';
import 'swiper/css';
import 'swiper/css/pagination';
import { HiStar } from 'react-icons/hi';
import { Reviews } from '@/assets/data/reviews';
const TestimonialSwiper = () => {
    return (_jsx("div", { className: 'mt-[30px] lg:mt-[55px]', children: _jsx(Swiper, { modules: [Pagination], spaceBetween: 30, slidesPerView: 1, pagination: { clickable: true }, breakpoints: {
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
            }, children: Reviews.map((review) => {
                const handleRatings = (rating) => {
                    const star = [];
                    for (let i = 0; i < rating; i++) {
                        star.push(_jsx(HiStar, { className: 'text-yellowColor W-[18px] h-5 ' }));
                    }
                    return star;
                };
                return (_jsx(SwiperSlide, { children: _jsxs("div", { className: ' p-2 rounded-3 mb-[20px]', children: [_jsxs("div", { className: 'flex items-center gap-[20px] ', children: [_jsx("div", { className: 'w-[50px] h-[50px]', children: _jsx("img", { src: review.photo, alt: 'patient avatar', className: 'w-full h-full rounded' }) }), _jsxs("div", { children: [_jsx("h4", { className: 'text-[18px] leading-[30px] font-semibold text-headingColor ', children: review.name }), _jsx("div", { className: 'flex items-center gap-[2px]', children: handleRatings(review.ratings) })] })] }), _jsx("p", { className: 'text-[16px] leading-7 mt-4 text-textColor font-[400] ', children: review.comment })] }) }, review.id));
            }) }) }));
};
export default TestimonialSwiper;
