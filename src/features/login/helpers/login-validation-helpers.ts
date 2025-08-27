import * as yup from 'yup';

export const getValidationSchema = () =>
  yup.object().shape({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().required('Required'),
  });
