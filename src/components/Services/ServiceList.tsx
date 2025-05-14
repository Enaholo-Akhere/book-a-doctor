import { services } from '@/assets/data/services';
import ServiceCard from '@/components/Services/ServiceCard';
import { useLocation } from 'react-router-dom';

const ServiceList = () => {
  const { pathname } = useLocation();
  const pn = pathname === '/services';

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] ${
        pn ? 'mt-[0px] lg:mt-[0px]' : 'mt-[30px] lg:mt-[55px]'
      } `}
    >
      {services.map((item, index) => (
        <ServiceCard item={item} index={index} key={index} />
      ))}
    </div>
  );
};

export default ServiceList;
