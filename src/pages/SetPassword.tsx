import SetNewPasswordComp from '@/components/ForgotPassword/SetNewPassword';
import { usePageTitle } from '@/Hook/useTitle';

const SetPassword = () => {
  usePageTitle('Set Password - CareConnect');

  return (
    <section>
      <SetNewPasswordComp />
    </section>
  );
};

export default SetPassword;
