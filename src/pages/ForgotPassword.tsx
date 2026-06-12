import ForgotPasswordComp from '@/components/ForgotPassword';
import { usePageTitle } from '@/Hook/useTitle';

const ForgotPassword = () => {
  usePageTitle('Forgot Password - CareConnect');

  return (
    <section>
      <ForgotPasswordComp />
    </section>
  );
};

export default ForgotPassword;
