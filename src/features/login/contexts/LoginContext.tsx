'use client';

import { createContext, type PropsWithChildren, useState } from 'react';
import { useFormik, type FormikInstance } from 'formik';
import { useRouter } from 'next/navigation';

import { getValidationSchema } from '@/features/login/helpers/login-validation-helpers';
import { supabase } from '@/lib/supabase/client';
import { paths } from '@/app/paths';

type LoginContextProps = {
  formikInstance: FormikInstance<any>;
  isLoading: boolean;
  error: Error | null;
};

type LoginProviderProps = PropsWithChildren;

export const LoginContext = createContext<LoginContextProps>({} as LoginContextProps);

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const formikInstance = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error);
      } else {
        router.push(paths.app);
      }

      setSubmitting(false);
    },
  });

  const { isSubmitting } = formikInstance;

  const contextValue = {
    formikInstance,
    isLoading: isSubmitting,
    error,
  };

  return <LoginContext.Provider value={contextValue}>{children}</LoginContext.Provider>;
};
