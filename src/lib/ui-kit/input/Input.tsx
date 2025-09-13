'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, MotionProps } from 'motion/react';

import { cn } from '@/lib/utils';

export enum InputVariants {
  DEFAULT = 'default',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> &
  Omit<MotionProps, 'children'> & {
    variant?: InputVariants;
    className?: string;
  };

// Base styles for all inputs
const baseClasses =
  'block w-full px-3 py-2 placeholder-gray-400 border rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm transition duration-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500';

// Variant-specific styles with ring configurations
const variantClasses = {
  [InputVariants.DEFAULT]: 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
  [InputVariants.SUCCESS]: 'border-green-300 focus:ring-2 focus:ring-green-700 focus:border-green-700',
  [InputVariants.WARNING]: 'border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500',
  [InputVariants.ERROR]: 'border-red-300 focus:ring-2 focus:ring-red-600 focus:border-red-600',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = InputVariants.DEFAULT, type = 'text', className, disabled, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (isPasswordVisible ? 'text' : 'password') : type;

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const inputClassName = cn(
      baseClasses,
      variantClasses[variant],
      isPassword && 'pr-10', // Add padding for eye icon
      className
    );

    const containerClassName = cn('relative', isPassword && 'flex items-center');

    if (isPassword) {
      return (
        <div className={containerClassName}>
          <motion.input
            ref={ref}
            type={inputType}
            className={inputClassName}
            disabled={disabled}
            {...props}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      );
    }

    return (
      <motion.input
        ref={ref}
        type={inputType}
        className={inputClassName}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;