import DoctorsComp from '../../components/Doctors';
import Testimonial from '@/components/Testimonial';

const Doctors = () => {
  return (
    <>
      <section className='bg-[#fff9ea]'>
        <div className='container text-center'>
          <h2 className='heading'>Find a Doctor</h2>
          <div className='max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between '>
            <input
              type='search'
              className='py-4 pl-4 pr-2 bg-transparent w-[50%] focus:outline-none cursor-pointer placeholder:text-textColor'
              placeholder='Search Doctor'
            />
            <button className='btn mt-0 rounded-[0px] rounded-r-md '>
              Search
            </button>
          </div>
        </div>
      </section>
      <section>
        <DoctorsComp title='' subtitle='' />
      </section>
      <section>
        <Testimonial />
      </section>
    </>
  );
};

export default Doctors;
