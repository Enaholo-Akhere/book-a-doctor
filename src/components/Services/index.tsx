import ServiceList from './ServiceList';

const ServicesComp = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <section>
      <div className='container'>
        <div className='lg:w-[470px] mx-auto mb-[50px]'>
          <h2 className='heading text-center'>{title}</h2>
          <p className='text__para text-center'>{subtitle}</p>
        </div>
        <ServiceList />
      </div>
    </section>
  );
};

export default ServicesComp;
