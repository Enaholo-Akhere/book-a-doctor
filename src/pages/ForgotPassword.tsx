import ForgotPasswordComp from '@/components/ForgotPassword';
import { usePageTitle } from '@/Hook/title';

const ForgotPassword = () => {
  usePageTitle('Forgot Password - CareConnect');

  return (
    <section>
      <ForgotPasswordComp />
    </section>
  );
};

export default ForgotPassword;
