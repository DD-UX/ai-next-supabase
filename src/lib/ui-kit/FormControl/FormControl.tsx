'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

type FormControlProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: ReactNode;
};

const FormControl = forwardRef<HTMLInputElement, FormControlProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          ref={ref}
          {...props}
          className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    );
  },
);

FormControl.displayName = 'FormControl';

export default FormControl;
