import UserDashboard from '@/components/dashboard/UserDashboard';
import { usePageTitle } from '@/Hook/title';

const MyAccountUser = () => {
  usePageTitle('My Account - CareConnect');

  return (
    <section>
      <UserDashboard />
    </section>
  );
};

export default MyAccountUser;
