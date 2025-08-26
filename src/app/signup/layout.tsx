import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
};

type SignUpLayoutProps = PropsWithChildren;

const SignUpLayout = ({ children }: SignUpLayoutProps) => {
  return <section>{children}</section>;
};

export default SignUpLayout;
