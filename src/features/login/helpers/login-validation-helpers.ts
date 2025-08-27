import * as Yup from 'yup';

export const getValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });
