import { Service } from '@/assets/data/services';
import { BsArrowRight } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';

const ServiceCard = ({ item }: { item: Service }) => {
  const { name, desc, bgColor, textColor, id } = item;
  const { pathname } = useLocation();
  const pn = pathname === '/services';
  return (
    <div
      className={`${
        pn ? 'py-[0px]' : 'py-[30px]'
      } px-3 lg:px-5 flex flex-col justify-between gap-2`}
      data-aos='fade-up'
      data-aos-delay='200'
    >
      <h2 className='text-[26px] leading-9 text-headingColor font-[700] '>
        {name}
      </h2>
      <p className='text-[16px] leading-7 font-[400] text-textColor mt-4 '>
        {desc}
      </p>
      <div className='flex items-center justify-between mt-[30px] '>
        <Link
          to='/doctors'
          className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none'
        >
          <BsArrowRight className='group-hover:text-white w-6 h-5' />
        </Link>
        <span
          className='w-[44px] h-[44px] flex items-center justify-center text-[18px] leading-[30px] font-[600]'
          style={{
            background: `${bgColor}`,
            color: `${textColor}`,
            borderRadius: '6px 0 0 6px',
          }}
        >
          {id}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;
