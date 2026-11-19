import UserDashboard from '@/components/dashboard/UserDashboard';
import { usePageTitle } from '@/Hook/useTitle';

const MyAccountUser = () => {
  usePageTitle('My Account - CareConnect');

  return (
    <div>
      <UserDashboard />
    </div>
  );
};

export default MyAccountUser;
