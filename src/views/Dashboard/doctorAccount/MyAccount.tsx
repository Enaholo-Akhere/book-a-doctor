'use client';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import { usePageTitle } from '@/Hook/useTitle';

const MyAccountDoctor = () => {
  usePageTitle('My Account - CareConnect');

  return (
    <div>
      <DoctorDashboard />
    </div>
  );
};

export default MyAccountDoctor;
