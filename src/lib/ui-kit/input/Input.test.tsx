import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import Input, { InputVariants } from './Input';

describe('Input Component', () => {
  it('renders with default variant', () => {
    render(<Input data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('border-gray-300', 'focus:ring-indigo-500');
  });

  it('renders with success variant', () => {
    render(<Input variant={InputVariants.SUCCESS} data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass('border-green-300', 'focus:ring-green-700');
  });

  it('renders with warning variant', () => {
    render(<Input variant={InputVariants.WARNING} data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass('border-amber-300', 'focus:ring-amber-500');
  });

  it('renders with error variant', () => {
    render(<Input variant={InputVariants.ERROR} data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass('border-red-300', 'focus:ring-red-600');
  });

  it('handles disabled state', () => {
    render(<Input disabled data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:bg-gray-100');
  });

  it('accepts custom className', () => {
    render(<Input className="custom-class" data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Input ref={ref} data-testid="test-input" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('passes through input props', () => {
    render(<Input placeholder="Test placeholder" value="test value" data-testid="test-input" readOnly />);
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('placeholder', 'Test placeholder');
    expect(input).toHaveValue('test value');
    expect(input).toHaveAttribute('readonly');
  });

  describe('Password type functionality', () => {
    it('renders password input with eye icon', () => {
      render(<Input type="password" data-testid="test-input" />);
      const input = screen.getByTestId('test-input');
      const toggleButton = screen.getByRole('button', { name: /show password/i });
      
      expect(input).toHaveAttribute('type', 'password');
      expect(toggleButton).toBeInTheDocument();
      expect(input).toHaveClass('pr-10'); // padding for eye icon
    });

    it('toggles password visibility when eye icon is clicked', () => {
      render(<Input type="password" data-testid="test-input" />);
      const input = screen.getByTestId('test-input');
      const toggleButton = screen.getByRole('button', { name: /show password/i });

      // Initially password type
      expect(input).toHaveAttribute('type', 'password');
      
      // Click to show password
      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
      
      // Click to hide password again
      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');
      expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
    });

    it('disables password toggle button when input is disabled', () => {
      render(<Input type="password" disabled data-testid="test-input" />);
      const toggleButton = screen.getByRole('button', { name: /show password/i });
      
      expect(toggleButton).toBeDisabled();
      expect(toggleButton).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('does not show toggle button for non-password inputs', () => {
      render(<Input type="text" data-testid="test-input" />);
      const toggleButton = screen.queryByRole('button', { name: /show password/i });
      
      expect(toggleButton).not.toBeInTheDocument();
    });
  });

  describe('Variants with password type', () => {
    it('applies variant classes correctly with password type', () => {
      render(<Input type="password" variant={InputVariants.ERROR} data-testid="test-input" />);
      const input = screen.getByTestId('test-input');
      
      expect(input).toHaveClass('border-red-300', 'focus:ring-red-600', 'pr-10');
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes', () => {
      const onChange = jest.fn();
      render(<Input onChange={onChange} data-testid="test-input" />);
      const input = screen.getByTestId('test-input');
      
      fireEvent.change(input, { target: { value: 'new value' } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus when input receives focus', () => {
      const onFocus = jest.fn();
      render(<Input onFocus={onFocus} data-testid="test-input" />);
      const input = screen.getByTestId('test-input');
      
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when input loses focus', () => {
      const onBlur = jest.fn();
      render(<Input onBlur={onBlur} data-testid="test-input" />);
      const input = screen.getByTestId('test-input');
      
      fireEvent.focus(input);
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });
});