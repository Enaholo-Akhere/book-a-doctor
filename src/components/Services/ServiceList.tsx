import { Service } from '@/assets/data/services';
import ServiceCard from '@/components/Services/ServiceCard';

/**
 * Light variant: plain grid (home page).
 * Dark variant: the middle column sits lower on large screens, echoing the
 * staggered layout of the reference design.
 */
const ServiceList = ({ items, variant = 'light' }: { items: Service[]; variant?: 'light' | 'dark' }) => (
  <div
    className={`grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 ${
      variant === 'dark' ? 'lg:pb-12 lg:[&>*:nth-child(3n+2)]:translate-y-12' : ''
    }`}
  >
    {items.map((item) => (
      <ServiceCard item={item} key={item.id} variant={variant} />
    ))}
  </div>
);

export default ServiceList;
