import EmailVerify from '@/components/emailVerify';
import { usePageTitle } from '@/Hook/useTitle';

const EmailVerification = () => {
  usePageTitle('Email Verification - CareConnect');

  return (
    <section>
      <EmailVerify />
    </section>
  );
};

export default EmailVerification;
