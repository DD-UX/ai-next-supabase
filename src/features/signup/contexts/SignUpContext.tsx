'use client';

import { createContext, type PropsWithChildren, useState } from 'react';
import { type AuthError } from '@supabase/supabase-js';
import { useFormik } from 'formik';
import { FormikConfig } from 'formik/dist/types';

import { supabase } from '@/lib/supabase/client';

import { signUpSchema } from '../helpers/signup-validation-helpers';

type SignUpFormType = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpContextProps = {
  formikInstance: ReturnType<typeof useFormik<SignUpFormType>>;
  isLoading: boolean;
  error: AuthError | null;
};

export const SignUpContext = createContext<SignUpContextProps>({} as SignUpContextProps);

type SignUpProviderProps = PropsWithChildren;

export const SignUpProvider = ({ children }: SignUpProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const onSubmit: FormikConfig<SignUpFormType>['onSubmit'] = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (signUpError) {
      setError(signUpError);
    } else {
      // User is signed up. If email confirmation is disabled in Supabase,
      // the user is also logged in at this point.
      // A redirect or other action can happen here.
      alert('Sign up successful! Please check your email to confirm your registration.');
    }

    setIsLoading(false);
    setSubmitting(false);
  };

  const formikInstance = useFormik<SignUpFormType>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit,
  });

  const contextValue = {
    formikInstance,
    isLoading,
    error,
  };

  return <SignUpContext.Provider value={contextValue}>{children}</SignUpContext.Provider>;
};
