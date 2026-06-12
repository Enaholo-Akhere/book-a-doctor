import SignupComp from '@/components/Signup';
import { usePageTitle } from '@/Hook/useTitle';

const Signup = () => {
  usePageTitle('Signup - CareConnect');

  return (
    <section>
      <SignupComp />
    </section>
  );
};

export default Signup;
