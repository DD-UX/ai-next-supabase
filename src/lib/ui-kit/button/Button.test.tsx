import { createElement, createRef, forwardRef, Fragment, JSX, ReactNode } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';

import Button, { ButtonVariants } from './Button';

// This is a comprehensive, type-safe mock for the 'motion/react' library.
// It is designed to pass a strict ESLint configuration.
jest.mock('motion/react', () => {
  // We must use require here as jest.mock is hoisted above imports.

  // const React = require('react') as typeof import('react');

  // Motion-specific props that should be filtered out
  type MotionProps = {
    layout?: unknown;
    animate?: unknown;
    initial?: unknown;
    transition?: unknown;
    whileTap?: unknown;
  };

  // A generic factory for creating mocked motion components (e.g., motion.div).
  const createMock = <T extends keyof JSX.IntrinsicElements>(Tag: T) => {
    const Mock = forwardRef<HTMLElement, JSX.IntrinsicElements[T] & MotionProps>((props, ref) => {
      // these props are omitted from otherProps intentionally
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, layout, animate, initial, transition, whileTap, ...otherProps } = props;
      // Filter out motion props and pass only valid HTML props
      return createElement(Tag as string, { ref, ...otherProps }, children);
    });

    Mock.displayName = `MockMotion(${String(Tag)})`;
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
    useAnimate: () => [createRef<HTMLButtonElement>(), jest.fn().mockResolvedValue(undefined)] as const,
    AnimatePresence: ({ children }: { children: ReactNode }) => createElement(Fragment, null, children),
  };
});

describe('button-legacy Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies the correct classes for each variant via snapshots', () => {
    const { rerender, asFragment } = render(<Button variant={ButtonVariants.PRIMARY}>Primary</Button>);
    expect(asFragment()).toMatchSnapshot('primary');

    rerender(<Button variant={ButtonVariants.SECONDARY}>Secondary</Button>);
    expect(asFragment()).toMatchSnapshot('secondary');

    rerender(<Button variant={ButtonVariants.LINK}>Link</Button>);
    expect(asFragment()).toMatchSnapshot('link');

    rerender(<Button variant={ButtonVariants.SUCCESS}>Success</Button>);
    expect(asFragment()).toMatchSnapshot('success');

    rerender(<Button variant={ButtonVariants.WARNING}>Warning</Button>);
    expect(asFragment()).toMatchSnapshot('warning');

    rerender(<Button variant={ButtonVariants.ERROR}>Error</Button>);
    expect(asFragment()).toMatchSnapshot('error');
  });

  it('calls onClick handler when clicked', async () => {
    const mockOnClick = jest.fn();
    render(<Button onClick={mockOnClick}>Click Me</Button>);
    const button = screen.getByRole('button');

    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
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
    act(() => {
      fireEvent.click(button);
    });
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('shows loading and success states on async click and re-enables', async () => {
    jest.useFakeTimers();
    const mockOnClick = jest.fn().mockResolvedValue(undefined);
    render(<Button onClick={mockOnClick}>Submit</Button>);
    const button = screen.getByRole('button');

    expect(button).not.toBeDisabled();
    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await waitFor(() => {
      expect(screen.getByText('Loading, please wait.')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Action completed successfully.')).toBeInTheDocument();
    });

    expect(button).toBeDisabled();

    act(() => {
      jest.advanceTimersByTime(2200);
    });

    expect(button).not.toBeDisabled();

    jest.useRealTimers();
  });

  it('shows loading and success states even if onClick is not provided', async () => {
    jest.useFakeTimers();
    render(<Button>No Action</Button>);
    const button = screen.getByRole('button');

    expect(button).not.toBeDisabled();
    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await waitFor(() => {
      expect(screen.getByText('Loading, please wait.')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Action completed successfully.')).toBeInTheDocument();
    });

    expect(button).toBeDisabled();

    act(() => {
      jest.advanceTimersByTime(2200);
    });

    expect(button).not.toBeDisabled();

    jest.useRealTimers();
  });

  it('is disabled and shows loading state when loading prop is true', async () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(screen.getByText('Loading, please wait.')).toBeInTheDocument();
    });
  });

  it('is enabled and hides loading state when loading prop is false', () => {
    render(<Button loading={false}>Normal Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).not.toBeDisabled();
    expect(screen.queryByText('Loading, please wait.')).not.toBeInTheDocument();
    expect(screen.getByText('Normal Button')).toBeInTheDocument();
  });

  it('switches from loading to normal state when loading prop changes', async () => {
    const { rerender } = render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(screen.getByText('Loading, please wait.')).toBeInTheDocument();
    });

    rerender(<Button loading={false}>Normal Button</Button>);
    
    expect(button).not.toBeDisabled();
    expect(screen.queryByText('Loading, please wait.')).not.toBeInTheDocument();
    expect(screen.getByText('Normal Button')).toBeInTheDocument();
  });
});
