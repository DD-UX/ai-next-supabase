import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import Button from './Button';

// This is a comprehensive, type-safe mock for the 'motion/react' library.
// It is designed to pass a strict ESLint configuration.
jest.mock('motion/react', () => {
  // We must use require here as jest.mock is hoisted above imports.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');

  // Define a type for the motion-specific props we want to filter out.
  interface MockMotionProps {
    children?: React.ReactNode;
    layout?: unknown;
    animate?: unknown;
    initial?: unknown;
    transition?: unknown;
  }

  // A generic factory for creating mocked motion components (e.g., motion.div).
  const createMock = (Tag: keyof JSX.IntrinsicElements) => {
    const Mock = React.forwardRef<HTMLElement, MockMotionProps>((props, ref) => {
      // Rename the motion props with a leading underscore to satisfy the 'no-unused-vars' rule.
      const {
        children,
        layout: _layout,
        animate: _animate,
        initial: _initial,
        transition: _transition,
        ...rest
      } = props;
      return React.createElement(Tag, { ...rest, ref }, children);
    });

    Mock.displayName = `MockMotion(${Tag})`;
    return Mock;
  };

  return {
    // We don't use requireActual to avoid pulling in 'any' types.
    // We explicitly mock everything we need.
    motion: {
      button: createMock('button'),
      div: createMock('div'),
      span: createMock('span'),
      svg: createMock('svg'),
    },
    useAnimate: () => [
      React.createRef<HTMLButtonElement>(),
      jest.fn().mockResolvedValue(undefined),
    ],
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies the correct classes for each variant via snapshots', () => {
    const { rerender, asFragment } = render(
      <Button variant="primary">Primary</Button>,
    );
    expect(asFragment()).toMatchSnapshot('primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(asFragment()).toMatchSnapshot('secondary');

    rerender(<Button variant="link">Link</Button>);
    expect(asFragment()).toMatchSnapshot('link');

    rerender(<Button variant="success">Success</Button>);
    expect(asFragment()).toMatchSnapshot('success');

    rerender(<Button variant="warning">Warning</Button>);
    expect(asFragment()).toMatchSnapshot('warning');

    rerender(<Button variant="error">Error</Button>);
    expect(asFragment()).toMatchSnapshot('error');
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick}>Click Me</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    const mockOnClick = jest.fn();
    render(
      <Button onClick={mockOnClick} disabled>
        Disabled
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('shows loading and success states on async click and re-enables', async () => {
    jest.useFakeTimers();
    const mockOnClick = jest.fn().mockResolvedValue(undefined);
    render(<Button onClick={mockOnClick}>Submit</Button>);
    const button = screen.getByRole('button');

    expect(button).not.toBeDisabled();
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await waitFor(() => {
      expect(screen.getByText('Loading, please wait.')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText('Action completed successfully.'),
      ).toBeInTheDocument();
    });

    expect(button).toBeDisabled();

    await act(async () => {
      jest.advanceTimersByTime(2200);
    });

    expect(button).not.toBeDisabled();

    jest.useRealTimers();
  });

  it('does not show loading/success states if onClick is not provided', () => {
    render(<Button>No Action</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).not.toBeDisabled();

    expect(
      screen.queryByText('Loading, please wait.'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Action completed successfully.'),
    ).not.toBeInTheDocument();
  });
});
