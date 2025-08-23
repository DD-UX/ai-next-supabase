"use client";

import React from 'react';

type ButtonProps = {
    label: string;
    onClick: () => void;
    disabled?: boolean;
};

const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
    return (
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                onClick={onClick}
                disabled={disabled}>
            {label}
        </button>
    );
};

export default Button;
