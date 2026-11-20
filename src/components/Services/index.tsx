import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { services } from '@/assets/data/services';
import ServiceList from './ServiceList';

/** Home page section: featured services with a link to the full list. */
const ServicesComp = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section>
    <div className='container'>
      <div className='mx-auto mb-[50px] lg:w-[520px]'>
        <h2 className='heading text-center'>{title}</h2>
        <p className='text__para text-center'>{subtitle}</p>
      </div>
      <ServiceList items={services.filter((s) => s.featured)} />
      <div className='mt-10 flex justify-center'>
        <Link
          to='/services'
          className='inline-flex items-center gap-2 rounded-full border border-primaryColor px-6 py-3 text-sm font-semibold text-primaryColor transition hover:bg-primaryColor hover:text-white'
        >
          View all {services.length} services <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </section>
);

export default ServicesComp;
