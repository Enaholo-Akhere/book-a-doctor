import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import { usePageTitle } from '@/Hook/title';

const MyAccountDoctor = () => {
  usePageTitle('My Account - CareConnect');

  return (
    <section>
      <DoctorDashboard />
    </section>
  );
};

export default MyAccountDoctor;
