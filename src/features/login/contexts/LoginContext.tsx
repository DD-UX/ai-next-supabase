'use client';

import { createContext, type PropsWithChildren, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { FormikConfig } from 'formik/dist/types';

import { getValidationSchema } from '@/features/login/helpers/login-validation-helpers';

import { supabase } from '@/lib/supabase/client';

import { PATHS } from '@/app/paths';

type LoginFormType = {
  email: string;
  password: string;
};

type LoginContextProps = {
  formikInstance: ReturnType<typeof useFormik<LoginFormType>>;
  isLoading: boolean;
  error: Error | null;
};

type LoginProviderProps = PropsWithChildren;

export const LoginContext = createContext<LoginContextProps>({} as LoginContextProps);

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const onSubmit: FormikConfig<LoginFormType>['onSubmit'] = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(error);
    } else {
      router.push(PATHS.app);
    }

    setSubmitting(false);
  };

  const formikInstance = useFormik<LoginFormType>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: getValidationSchema(),
    onSubmit,
  });

  const { isSubmitting } = formikInstance;

  const contextValue = {
    formikInstance,
    isLoading: isSubmitting,
    error,
  };

  return <LoginContext.Provider value={contextValue}>{children}</LoginContext.Provider>;
};
