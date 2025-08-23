import { SignUpForm } from '@/features/signup/components/SignUpForm/SignUpForm';
import { SignUpProvider } from '@/features/signup/contexts/SignUpContext';

const SignUpPage = () => {
  return (
    <SignUpProvider>
      <SignUpForm />
    </SignUpProvider>
  );
};

export default SignUpPage;
