import { type PropsWithChildren, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { act, renderHook } from '@testing-library/react';
import * as yup from 'yup';

import { supabase } from '@/lib/supabase/client';

import { LoginContext, LoginProvider } from './LoginContext';

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

const mockUseRouter = jest.mocked(useRouter);

describe('LoginProvider', () => {
  let mockPush: jest.Mock;
  let mockSignInWithPassword: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockSignInWithPassword = jest
      .spyOn(supabase.auth, 'signInWithPassword')
      .mockImplementation(() => Promise.resolve({ error: null }));
  });

  afterEach(() => {
    mockSignInWithPassword.mockRestore();
  });

  const wrapper = ({ children }: PropsWithChildren) => <LoginProvider>{children}</LoginProvider>;

  it('should handle successful sign-in and redirect', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({ error: null });

    const { result } = renderHook(() => useContext(LoginContext), { wrapper });

    await act(async () => {
      await result.current.formikInstance.setFieldValue('email', 'test@test.com');
      await result.current.formikInstance.setFieldValue('password', 'password123');
      await result.current.formikInstance.submitForm();
    });

    expect(mockSignInWithPassword).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/app');
    expect(result.current.error).toBeNull();
  });

  it('should handle sign-in failure and set error state', async () => {
    const signInError = new Error('Sign-in failed');
    mockSignInWithPassword.mockResolvedValueOnce({ error: signInError });

    const { result } = renderHook(() => useContext(LoginContext), { wrapper });

    await act(async () => {
      await result.current.formikInstance.setFieldValue('email', 'test@test.com');
      await result.current.formikInstance.setFieldValue('password', 'password123');
      await result.current.formikInstance.submitForm();
    });

    expect(mockSignInWithPassword).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.error).toBe(signInError);
  });
});
