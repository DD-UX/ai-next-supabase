import React from 'react';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { LoginContext } from '@/features/login/contexts/LoginContext';
import LoginForm from '@/features/login/components/LoginForm';
import { useFormik } from 'formik';

const MockLoginProvider = ({ children, mockContextValue }) => (
  <LoginContext.Provider value={mockContextValue}>{children}</LoginContext.Provider>
);

describe('LoginForm', () => {
  const mockHandleSubmit = jest.fn();

  const getMockContextValue = (isLoading = false, error: Error | null = null) => {
    const { result } = renderHook(() =>
      useFormik({
        initialValues: { email: '', password: '' },
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
      <MockLoginProvider mockContextValue={mockContext}>
        <LoginForm />
      </MockLoginProvider>,
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should call handleSubmit on form submission', async () => {
    const mockContext = getMockContextValue();
    render(
      <MockLoginProvider mockContextValue={mockContext}>
        <LoginForm />
      </MockLoginProvider>,
    );

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    });
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display an error message if there is an error', () => {
    const error = new Error('This is a test error');
    const mockContext = getMockContextValue(false, error);
    render(
      <MockLoginProvider mockContextValue={mockContext}>
        <LoginForm />
      </MockLoginProvider>,
    );

    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('should disable inputs and button when loading', () => {
    const mockContext = getMockContextValue(true);
    render(
      <MockLoginProvider mockContextValue={mockContext}>
        <LoginForm />
      </MockLoginProvider>,
    );

    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /loading.../i })).toBeDisabled();
  });
});
