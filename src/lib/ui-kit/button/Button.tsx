'use client';

import { ButtonHTMLAttributes, JSX, MouseEvent, MouseEventHandler, PropsWithChildren } from 'react';
import { forwardRef, startTransition, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, MotionProps, useAnimate } from 'motion/react';

import { cn } from '@/lib/utils';

export enum ButtonVariants {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  LINK = 'link',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum ButtonStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
}

type ButtonProps = PropsWithChildren<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> &
    Omit<MotionProps, 'whileTap'> & {
      variant?: ButtonVariants;
      onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
      full?: boolean;
      whileTap?: MotionProps['whileTap'];
    }
>;

// Style configuration for button variants
const baseClasses =
  'flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 font-medium ring-offset-2 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed';

const variantClasses = {
  [ButtonVariants.PRIMARY]: 'bg-indigo-600 text-white hover:ring-2 hover:ring-indigo-600 focus-visible:ring-indigo-600',
  [ButtonVariants.SECONDARY]:
    'border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 hover:ring-2 hover:ring-slate-100 focus-visible:ring-slate-400',
  [ButtonVariants.LINK]: 'text-indigo-600 underline-offset-4 hover:underline focus-visible:ring-indigo-500',
  [ButtonVariants.SUCCESS]:
    'bg-green-700 text-white hover:bg-green-800 hover:ring-2 hover:ring-green-800 focus-visible:ring-green-700',
  [ButtonVariants.WARNING]:
    'bg-amber-500 text-white hover:bg-amber-600 hover:ring-2 hover:ring-amber-600 focus-visible:ring-amber-500',
  [ButtonVariants.ERROR]:
    'bg-red-600 text-white hover:bg-red-700 hover:ring-2 hover:ring-red-700 focus-visible:ring-red-500',
};

// Disabled state styles - consistent across all variants
const disabledClasses = 'disabled:bg-slate-500 disabled:text-white/80';

const fullClasses = 'w-full';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = ButtonVariants.PRIMARY, className, disabled, onClick, full, whileTap, ...props }, ref) => {
    const [scope, animate] = useAnimate<HTMLButtonElement>();
    const [status, setStatus] = useState<ButtonStatus>(ButtonStatus.IDLE);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const animateLoading = useCallback(async () => {
      await animate('.loader', { width: '20px', scale: 1, display: 'block' }, { duration: 0.2 });
    }, [animate]);

    const animateSuccess = useCallback(async (): Promise<void> => {
      await animate('.loader', { width: '0', scale: 0, display: 'none' }, { duration: 0.2 });
      await animate('.check', { width: '20px', scale: 1, display: 'block' }, { duration: 0.2 });
      await animate('.check', { width: '0', scale: 0, display: 'none' }, { delay: 2, duration: 0.2 });
    }, [animate]);

    const isButtonDisabled = disabled || status !== ButtonStatus.IDLE;

    // Define whileTap animation based on disabled state
    const whileTapAnimation = isButtonDisabled
      ? { x: [-2, 2, -2, 2, 0], transition: { duration: 0.3 } } // Shake effect for disabled
      : whileTap || { scale: 0.95, transition: { duration: 0.1 } }; // Press effect or custom override

    const handleClick = useCallback(
      async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
        if (status !== ButtonStatus.IDLE) {
          return;
        }

        startTransition(() => {
          setStatus(ButtonStatus.LOADING);
        });
        await animateLoading();

        if (typeof onClick === 'function') {
          // This will execute the onClick function
          const onClickPromise = onClick(event);
          if (onClickPromise?.then) {
            // If the onClick function returns a promise, wait for it to resolve
            await onClickPromise;
          }
        }

        startTransition(() => {
          setStatus(ButtonStatus.SUCCESS);
        });
        await animateSuccess();

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Use ref to track timeout and ensure cleanup
        timeoutRef.current = setTimeout(() => {
          startTransition(() => {
            setStatus(ButtonStatus.IDLE);
          });
          timeoutRef.current = null;
        }, 2200);
      },
      [status, animateLoading, animateSuccess, onClick],
    );

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }, []);

    useLayoutEffect(() => {
      if (typeof ref === 'function') {
        ref(scope.current);
      } else if (ref && 'current' in ref) {
        ref.current = scope.current;
      }
    }, [ref, scope]);

    return (
      <motion.button
        ref={scope}
        disabled={isButtonDisabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          isButtonDisabled && disabledClasses,
          full && fullClasses,
          className,
        )}
        onClick={handleClick as MouseEventHandler<HTMLButtonElement>}
        whileTap={whileTapAnimation}
        {...props}
      >
        <motion.div layout className="flex items-center gap-2">
          <Loader />
          <CheckIcon />
          <motion.span layout>{children}</motion.span>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {status === ButtonStatus.LOADING && 'Loading, please wait.'}
            {status === ButtonStatus.SUCCESS && 'Action completed successfully.'}
          </span>
        </motion.div>
      </motion.button>
    );
  },
);

Button.displayName = 'Button';

const Loader = (): JSX.Element => (
  <motion.svg
    animate={{ rotate: [0, 360] }}
    initial={{ scale: 0, width: 0, display: 'none' }}
    transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
    className="loader"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a9 9 0 1 0 9 9" />
  </motion.svg>
);

const CheckIcon = (): JSX.Element => (
  <motion.svg
    initial={{ scale: 0, width: 0, display: 'none' }}
    className="check"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
  </motion.svg>
);

export default Button;
