'use client';

import { type ReactNode, type PropsWithChildren } from 'react';

type FormControlProps = PropsWithChildren<{
  label: string;
  htmlFor?: string;
  error?: ReactNode;
}>;

const FormControl = ({ label, htmlFor, error, children }: FormControlProps) => {
  return (
    <div className="grid gap-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 m-0">
        {label}
      </label>
      {children}
      {error && <div className="text-sm text-red-600 m-0">{error}</div>}
    </div>
  );
};

export default FormControl;
