'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading, loadingText = 'Loading...', ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        disabled={isLoading || props.disabled}
        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? loadingText : children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
