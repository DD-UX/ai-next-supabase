'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        disabled={isLoading || props.disabled}
        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
