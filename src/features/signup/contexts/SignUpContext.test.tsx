import { type PropsWithChildren, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { type AuthError } from '@supabase/supabase-js';
import { act, renderHook } from '@testing-library/react';
import * as yup from 'yup';

import { supabase } from '@/lib/supabase/client';

import { SignUpContext, SignUpProvider } from './SignUpContext';

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

const mockUseRouter = jest.mocked(useRouter);

type MockSignUpResponse = {
  data: { user: null; session: null };
  error: AuthError | null;
};

describe('SignUpProvider', () => {
  let mockPush: jest.Mock;
  let mockSignUp: jest.SpyInstance;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ 
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    });
    mockSignUp = jest.spyOn(supabase.auth, 'signUp').mockImplementation((): Promise<MockSignUpResponse> =>
      Promise.resolve({
        data: { user: null, session: null },
        error: null,
      })
    );
  });

  afterEach(() => {
    alertSpy.mockRestore();
    mockSignUp.mockRestore();
  });

  const wrapper = ({ children }: PropsWithChildren) => <SignUpProvider>{children}</SignUpProvider>;

  it('should handle successful sign-up and call alert', async () => {
    mockSignUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: null,
    });

    const { result } = renderHook(() => useContext(SignUpContext), { wrapper });

    await act(async () => {
      await result.current.formikInstance.setFieldValue('email', 'test@test.com');
      await result.current.formikInstance.setFieldValue('password', 'password123');
      await result.current.formikInstance.setFieldValue('confirmPassword', 'password123');
      await result.current.formikInstance.submitForm();
    });

    expect(mockSignUp).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('Sign up successful! Please check your email to confirm your registration.');
    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should handle sign-up failure and set error state', async () => {
    const signUpError = new Error('Sign-up failed') as AuthError;
    mockSignUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: signUpError,
    });

    const { result } = renderHook(() => useContext(SignUpContext), { wrapper });

    await act(async () => {
      await result.current.formikInstance.setFieldValue('email', 'test@test.com');
      await result.current.formikInstance.setFieldValue('password', 'password123');
      await result.current.formikInstance.setFieldValue('confirmPassword', 'password123');
      await result.current.formikInstance.submitForm();
    });

    expect(mockSignUp).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.error).toBe(signUpError);
  });
});
