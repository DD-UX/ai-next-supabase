import { LoginProvider } from '@/features/login/contexts/LoginContext';
import { LoginForm } from '@/features/login/components/LoginForm';

const LoginPage = () => {
  return (
    <LoginProvider>
      <LoginForm />
    </LoginProvider>
  );
};

export default LoginPage;
