import LoginForm from '@/features/login/components/LoginForm';
import { LoginProvider } from '@/features/login/contexts/LoginContext';

const LoginPage = () => {
  return (
    <LoginProvider>
      <LoginForm />
    </LoginProvider>
  );
};

export default LoginPage;
