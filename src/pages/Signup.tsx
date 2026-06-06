import SignupComp from '@/components/Signup';
import { usePageTitle } from '@/Hook/title';

const Signup = () => {
  usePageTitle('Signup - CareConnect');

  return (
    <section>
      <SignupComp />
    </section>
  );
};

export default Signup;
