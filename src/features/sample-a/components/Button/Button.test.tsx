import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import Button from '@/features/sample-a/components/Button/Button';

describe('Button Component', () => {
    it('renders with correct text', () => {
        render(<Button label="Click me" onClick={jest.fn()} />);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const mockClick = jest.fn();
        render(<Button label="Click me" onClick={mockClick} />);

        fireEvent.click(screen.getByText('Click me'));
        expect(mockClick).toHaveBeenCalledTimes(1);
    });
});
