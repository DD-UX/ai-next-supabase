import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { SignUpProvider, SignUpContext } from './SignUpContext';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import * as yup from 'yup';

// Mock the dependencies
jest.mock('@/features/signup/helpers/signup-validation-helpers', () => ({
  getValidationSchema: () => yup.object().shape({}),
}));
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockSupabaseSignUp = supabase.auth.signUp as jest.Mock;

describe('SignUpProvider', () => {
  let mockPush: jest.Mock;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockSupabaseSignUp.mockClear();
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  const wrapper = ({ children }: PropsWithChildren) => <SignUpProvider>{children}</SignUpProvider>;

  it('should handle successful sign-up and call alert', async () => {
    mockSupabaseSignUp.mockResolvedValueOnce({ error: null });

    const { result } = renderHook(() => React.useContext(SignUpContext), { wrapper });

    await act(async () => {
      await result.current.formikInstance.setFieldValue('email', 'test@test.com');
      await result.current.formikInstance.setFieldValue('password', 'password123');
      await result.current.formikInstance.setFieldValue('confirmPassword', 'password123');
      await result.current.formikInstance.submitForm();
    });

    expect(mockSupabaseSignUp).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(
      'Sign up successful! Please check your email to confirm your registration.',
    );
    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should handle sign-up failure and set error state', async () => {
    const signUpError = new Error('Sign-up failed');
    mockSupabaseSignUp.mockResolvedValueOnce({ error: signUpError });

    const { result } = renderHook(() => React.useContext(SignUpContext), { wrapper });

    await act(async () => {
      await result.current.formikInstance.setFieldValue('email', 'test@test.com');
      await result.current.formikInstance.setFieldValue('password', 'password123');
      await result.current.formikInstance.setFieldValue('confirmPassword', 'password123');
      await result.current.formikInstance.submitForm();
    });

    expect(mockSupabaseSignUp).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.error).toBe(signUpError);
  });
});
