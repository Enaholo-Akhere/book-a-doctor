'use client';
import { AxiosError } from 'axios';
import DoctorsHome from '@/components/Doctors';
import { useGetAllDoctors } from '@/Hook/useDoctors';
import type { DoctorsResponse } from '@/library/api/server';

/** The home page's doctors section. Client-side because it keeps the server-fetched list fresh with React Query. */
const HomeDoctors = ({ initialDoctors }: { initialDoctors?: DoctorsResponse }) => {
  const { isLoading, isError, data, error } = useGetAllDoctors('', initialDoctors);
  return (
    <DoctorsHome
      subtitle=' Our team of compassionate, skilled doctors is here to provide
            personalized, top-quality care every step of the way.'
      title='Our great doctors'
      isLoading={isLoading}
      isError={isError}
      data={data}
      error={error as AxiosError}
    />
  );
};

export default HomeDoctors;
