import React from 'react';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { SignUpContext } from '@/features/signup/contexts/SignUpContext';
import SignUpForm from '@/features/signup/components/SignUpForm';
import { useFormik } from 'formik';

const MockSignUpProvider = ({ children, mockContextValue }) => (
  <SignUpContext.Provider value={mockContextValue}>{children}</SignUpContext.Provider>
);

describe('SignUpForm', () => {
  const mockHandleSubmit = jest.fn();

  const getMockContextValue = (isLoading = false, error: Error | null = null) => {
    const { result } = renderHook(() =>
      useFormik({
        initialValues: { email: '', password: '', confirmPassword: '' },
        onSubmit: mockHandleSubmit,
      }),
    );

    return {
      formikInstance: result.current,
      isLoading,
      error,
    };
  };

  beforeEach(() => {
    mockHandleSubmit.mockClear();
  });

  it('should render the form with all fields', () => {
    const mockContext = getMockContextValue();
    render(
      <MockSignUpProvider mockContextValue={mockContext}>
        <SignUpForm />
      </MockSignUpProvider>,
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should call handleSubmit on form submission', async () => {
    const mockContext = getMockContextValue();
    render(
      <MockSignUpProvider mockContextValue={mockContext}>
        <SignUpForm />
      </MockSignUpProvider>,
    );

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));
    });
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display an error message if there is an error', () => {
    const error = new Error('This is a test error');
    const mockContext = getMockContextValue(false, error);
    render(
      <MockSignUpProvider mockContextValue={mockContext}>
        <SignUpForm />
      </MockSignUpProvider>,
    );

    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('should disable inputs and button when loading', () => {
    const mockContext = getMockContextValue(true);
    render(
      <MockSignUpProvider mockContextValue={mockContext}>
        <SignUpForm />
      </MockSignUpProvider>,
    );

    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
    expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /signing up.../i })).toBeDisabled();
  });
});
