import React from 'react';
import { render, screen } from '@testing-library/react';

import LoginForm from '@/features/login/components/LoginForm';
import { LoginContext, LoginContextProps } from '@/features/login/contexts/LoginContext';

const getMockFormik = (isLoading = false, error: Error | null = null) =>
  ({
    formikInstance: {
      values: { email: '', password: '' },
      errors: {},
      touched: {},
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      handleSubmit: jest.fn(),
    },
    isLoading,
    error,
  }) as unknown as LoginContextProps;

const renderLoginForm = (mockContext: LoginContextProps) => {
  return render(
    <LoginContext.Provider value={mockContext}>
      <LoginForm />
    </LoginContext.Provider>,
  );
};

describe('LoginForm', () => {
  it('should render the form with all fields', () => {
    renderLoginForm(getMockFormik());
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should display an error message if there is an error', () => {
    const error = new Error('This is a test error');
    renderLoginForm(getMockFormik(false, error));
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('should disable inputs and button when loading', () => {
    renderLoginForm(getMockFormik(true));
    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /loading.../i })).toBeDisabled();
  });
});
