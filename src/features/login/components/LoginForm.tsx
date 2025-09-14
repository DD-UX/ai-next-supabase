'use client';

import { useContext } from 'react';

import { LoginContext } from '@/features/login/contexts/LoginContext';

import Button, { ButtonVariants } from '@/lib/ui-kit/button/Button';
import FormControl from '@/lib/ui-kit/FormControl/FormControl';
import Input from '@/lib/ui-kit/input/Input';

const LoginForm = () => {
  const { formikInstance, error } = useContext(LoginContext);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formikInstance;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 m-0">Sign in to your account</h2>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <FormControl htmlFor="email" label="Email address" error={touched.email && errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              disabled={isSubmitting}
            />
          </FormControl>
          <FormControl htmlFor="password" label="Password" error={touched.password && errors.password}>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              disabled={isSubmitting}
            />
          </FormControl>
          {error && <div className="text-sm font-medium text-red-600 m-0">{error.message}</div>}
          <div>
            <Button variant={ButtonVariants.PRIMARY} full loading={isSubmitting}>
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
