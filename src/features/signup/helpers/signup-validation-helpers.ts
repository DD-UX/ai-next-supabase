import * as yup from 'yup';

export const signUpSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).*$/,
      'Password must be alphanumeric and contain at least one special character.'
    ),
  confirmPassword: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});
