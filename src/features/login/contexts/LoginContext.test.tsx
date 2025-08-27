import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { LoginProvider, LoginContext } from './LoginContext';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { type PropsWithChildren } from 'react';
import * as yup from 'yup';

// Mock the dependencies
jest.mock('@/features/login/helpers/login-validation-helpers', () => ({
  getValidationSchema: () => yup.object().shape({}),
}));
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockSupabaseSignIn = supabase.auth.signInWithPassword as jest.Mock;

describe('LoginProvider', () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockSupabaseSignIn.mockClear();
  });

  const wrapper = ({ children }: PropsWithChildren) => <LoginProvider>{children}</LoginProvider>;

  it('should handle successful sign-in and redirect', async () => {
    mockSupabaseSignIn.mockResolvedValueOnce({ error: null });

    const { result } = renderHook(() => React.useContext(LoginContext), { wrapper });

    await act(async () => {
      await result.current.formikInstance.setFieldValue('email', 'test@test.com');
      await result.current.formikInstance.setFieldValue('password', 'password123');
      await result.current.formikInstance.submitForm();
    });

    expect(mockSupabaseSignIn).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/app');
    expect(result.current.error).toBeNull();
  });

  it('should handle sign-in failure and set error state', async () => {
    const signInError = new Error('Sign-in failed');
    mockSupabaseSignIn.mockResolvedValueOnce({ error: signInError });

    const { result } = renderHook(() => React.useContext(LoginContext), { wrapper });

    await act(async () => {
      await result.current.formikInstance.setFieldValue('email', 'test@test.com');
      await result.current.formikInstance.setFieldValue('password', 'password123');
      await result.current.formikInstance.submitForm();
    });

    expect(mockSupabaseSignIn).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.error).toBe(signInError);
  });
});
