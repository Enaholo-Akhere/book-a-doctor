import EmailVerify from '@/components/emailVerify';
import { usePageTitle } from '@/Hook/title';

const EmailVerification = () => {
  usePageTitle('Email Verification - CareConnect');

  return (
    <section>
      <EmailVerify />
    </section>
  );
};

export default EmailVerification;
