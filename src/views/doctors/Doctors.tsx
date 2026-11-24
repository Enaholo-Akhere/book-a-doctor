'use client';
import { useGetAllDoctors } from '@/Hook/useDoctors';
import DoctorsComp from '../../components/Doctors';
import Testimonial from '@/components/Testimonial';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import type { DoctorsResponse } from '@/library/api/server';

const Doctors = ({ initialDoctors }: { initialDoctors?: DoctorsResponse }) => {
  const { register, watch } = useForm({
    defaultValues: {
      search: '',
    },
  });

  const searchQuery = watch('search');

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { isLoading, isError, data, error } = useGetAllDoctors(
    debouncedSearch,
    // The server only fetched the unfiltered list.
    debouncedSearch === '' ? initialDoctors : undefined,
  );

  return (
    <>
      <section className='bg-[#fff9ea]'>
        <div className='container text-center'>
          <h1 className='heading'>Find a Doctor</h1>
          <div className='max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between '>
            <input
              type='search'
              className='py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor placeholder:font-medium placeholder:text-[12px] md:placeholder:text-[15px] leading-6 text-textColor '
              placeholder='Search Doctor by name or specialty...'
              {...register('search')}
            />
            <button className='btn mt-0 rounded-[0px] rounded-r-md '>
              Search
            </button>
          </div>
        </div>
      </section>
      <div>
        <DoctorsComp
          title=''
          subtitle=''
          isLoading={isLoading}
          isError={isError}
          data={data}
          error={error as AxiosError<unknown, undefined>}
        />
      </div>
      <section>
        <Testimonial />
      </section>
    </>
  );
};

export default Doctors;
