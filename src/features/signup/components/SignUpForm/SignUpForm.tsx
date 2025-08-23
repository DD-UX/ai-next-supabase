'use client';

import { useContext } from 'react';
import { SignUpContext } from '../../contexts/SignUpContext';

export const SignUpForm = () => {
  const { formikInstance, isLoading, error } = useContext(SignUpContext);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formikInstance;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Create your account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              disabled={isLoading}
            />
            {touched.email && errors.email && <div className="text-sm text-red-600">{String(errors.email)}</div>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              disabled={isLoading}
            />
            {touched.password && errors.password && <div className="text-sm text-red-600">{String(errors.password)}</div>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmPassword}
              disabled={isLoading}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="text-sm text-red-600">{String(errors.confirmPassword)}</div>
            )}
          </div>

          {error && <div className="text-sm font-medium text-red-600">{error.message}</div>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
