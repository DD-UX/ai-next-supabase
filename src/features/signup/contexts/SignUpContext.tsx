'use client';

import { createContext, useState, type PropsWithChildren } from 'react';
import { useFormik, type FormikValues, type FormikHelpers } from 'formik';
import { signUpSchema } from '../helpers/validation';
import { supabase } from '@/lib/supabase/client';
import { type AuthError } from '@supabase/supabase-js';

type SignUpFormType = FormikValues;

type SignUpContextProps = {
  formikInstance: ReturnType<typeof useFormik<SignUpFormType>>;
  isLoading: boolean;
  error: AuthError | null;
};

export const SignUpContext = createContext<SignUpContextProps>({} as SignUpContextProps);

export const SignUpProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const handleSubmit = async (values: SignUpFormType, { setSubmitting }: FormikHelpers<SignUpFormType>) => {
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
    onSubmit: handleSubmit,
  });

  const contextValue = {
    formikInstance,
    isLoading,
    error,
  };

  return (
    <SignUpContext.Provider value={contextValue}>
      {children}
    </SignUpContext.Provider>
  );
};
