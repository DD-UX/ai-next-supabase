import { signUpSchema } from './signup-validation-helpers';

describe('signUpSchema', () => {
  const validData = {
    email: 'test@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  it('should validate a correct form submission', async () => {
    await expect(signUpSchema.validate(validData)).resolves.toEqual(validData);
  });

  describe('email validation', () => {
    it('should fail for an invalid email format', async () => {
      const invalidData = { ...validData, email: 'not-an-email' };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('Invalid email address');
    });

    it('should fail if email is missing', async () => {
      const invalidData = { ...validData, email: '' };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('Email is required');
    });
  });

  describe('password validation', () => {
    it('should fail if password is too short', async () => {
      const invalidData = { ...validData, password: 'Short1!', confirmPassword: 'Short1!' };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('Password must be at least 8 characters');
    });

    it('should fail if password has no letter', async () => {
      const invalidData = { ...validData, password: '12345678!', confirmPassword: '12345678!' };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('Password must be alphanumeric and contain at least one special character.');
    });

    it('should fail if password has no number', async () => {
      const invalidData = { ...validData, password: 'Password!', confirmPassword: 'Password!' };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('Password must be alphanumeric and contain at least one special character.');
    });

    it('should fail if password has no special character', async () => {
      const invalidData = { ...validData, password: 'Password123', confirmPassword: 'Password123' };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('Password must be alphanumeric and contain at least one special character.');
    });
  });

  describe('confirmPassword validation', () => {
    it('should fail if passwords do not match', async () => {
      const invalidData = { ...validData, confirmPassword: 'differentPassword1!' };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('Passwords must match');
    });

    it('should fail if confirm password is missing', async () => {
      const invalidData = { ...validData, confirmPassword: '' };
      await expect(signUpSchema.validate(invalidData)).rejects.toThrow('Confirm password is required');
    });
  });
});
