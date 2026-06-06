import ServicesComp from '../components/Services';
import { usePageTitle } from '@/Hook/title';

const Services = () => {
  usePageTitle('Services - CareConnect');

  return (
    <div>
      <ServicesComp title='' subtitle='' />
    </div>
  );
};

export default Services;
