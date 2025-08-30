import React from 'react';
import { render, screen } from '@testing-library/react';

import SignUpForm from '@/features/signup/components/SignUpForm';
import { SignUpContext, SignUpContextProps } from '@/features/signup/contexts/SignUpContext';

const getMockFormik = (isLoading = false, error: Error | null = null) =>
  ({
    formikInstance: {
      values: { email: '', password: '', confirmPassword: '' },
      errors: {},
      touched: {},
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      handleSubmit: jest.fn(),
    },
    isLoading,
    error,
  }) as unknown as SignUpContextProps;

const renderSignUpForm = (mockContext: SignUpContextProps) => {
  return render(
    <SignUpContext.Provider value={mockContext}>
      <SignUpForm />
    </SignUpContext.Provider>,
  );
};

describe('SignUpForm', () => {
  it('should render the form with all fields', () => {
    renderSignUpForm(getMockFormik());
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should display an error message if there is an error', () => {
    const error = new Error('This is a test error');
    renderSignUpForm(getMockFormik(false, error));
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('should disable inputs and button when loading', () => {
    renderSignUpForm(getMockFormik(true));
    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
    expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /signing up.../i })).toBeDisabled();
  });
});
