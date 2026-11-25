'use client';
import { Suspense } from 'react';
import EmailVerify from '@/components/emailVerify';

const EmailVerification = () => {
  return (
    <section>
      {/* EmailVerify reads the URL's search params, which Next requires to sit inside Suspense. */}
      <Suspense fallback={null}>
        <EmailVerify />
      </Suspense>
    </section>
  );
};

export default EmailVerification;
