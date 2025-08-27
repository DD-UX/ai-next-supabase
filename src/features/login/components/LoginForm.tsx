'use client';

import { useContext } from 'react';

import { LoginContext } from '@/features/login/contexts/LoginContext';
import { FormControl } from '@/lib/ui-kit/FormControl/FormControl';
import { Button } from '@/lib/ui-kit/Button/Button';

export const LoginForm = () => {
  const { formikInstance, isLoading, error } = useContext(LoginContext);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formikInstance;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormControl
            id="email"
            name="email"
            type="email"
            label="Email address"
            autoComplete="email"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            disabled={isLoading}
            error={touched.email && errors.email}
          />

          <FormControl
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            disabled={isLoading}
            error={touched.password && errors.password}
          />

          {error && <div className="text-sm font-medium text-red-600">{error.message}</div>}

          <div>
            <Button type="submit" isLoading={isLoading}>
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
