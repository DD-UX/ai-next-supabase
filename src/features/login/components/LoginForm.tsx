'use client';

import { useContext } from 'react';

import { LoginContext } from '@/features/login/contexts/LoginContext';

import Button from '@/lib/ui-kit/Button/Button';
import FormControl from '@/lib/ui-kit/FormControl/FormControl';

const LoginForm = () => {
  const { formikInstance, isLoading, error } = useContext(LoginContext);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formikInstance;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 m-0">Sign in to your account</h2>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <FormControl htmlFor="email" label="Email address" error={touched.email && errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              disabled={isLoading}
            />
          </FormControl>
          <FormControl htmlFor="password" label="Password" error={touched.password && errors.password}>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              disabled={isLoading}
            />
          </FormControl>
          {error && <div className="text-sm font-medium text-red-600 m-0">{error.message}</div>}
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

export default LoginForm;
