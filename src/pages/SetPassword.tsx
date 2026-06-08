import SetNewPasswordComp from '@/components/ForgotPassword/SetNewPassword';
import { usePageTitle } from '@/Hook/title';

const SetPassword = () => {
  usePageTitle('Set Password - CareConnect');

  return (
    <section>
      <SetNewPasswordComp />
    </section>
  );
};

export default SetPassword;
