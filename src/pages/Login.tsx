import LoginComp from '@/components/Login';
import { usePageTitle } from '@/Hook/title';

const Login = () => {
  usePageTitle('Login - CareConnect');

  return (
    <section>
      <LoginComp />
    </section>
  );
};

export default Login;
