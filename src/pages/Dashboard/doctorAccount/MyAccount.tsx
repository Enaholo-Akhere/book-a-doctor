import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import { usePageTitle } from '@/Hook/useTitle';

const MyAccountDoctor = () => {
  usePageTitle('My Account - CareConnect');

  return (
    <section>
      <DoctorDashboard />
    </section>
  );
};

export default MyAccountDoctor;
