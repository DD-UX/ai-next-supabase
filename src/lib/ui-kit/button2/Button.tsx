"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { forwardRef, useLayoutEffect, useState } from "react";
import { motion, useAnimate } from "motion/react";

import { cn } from "@/lib/utils";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "link" | "success" | "warning" | "error";
  }
>;

// Style configuration for button variants
const baseClasses =
  "flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium ring-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed";

const variantClasses = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
  secondary:
    "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400",
  link: "text-indigo-600 underline-offset-4 hover:underline focus-visible:ring-indigo-500",
  success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
  warning: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500",
  error: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

// Disabled state styles - consistent across all variants
const disabledClasses = "disabled:bg-slate-500 disabled:text-white/80";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", className, disabled, ...props }, ref) => {
    const [scope, animate] = useAnimate<HTMLButtonElement>();
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    useLayoutEffect(() => {
      if (typeof ref === "function") {
        ref(scope.current);
      } else if (ref && "current" in ref) {
        ref.current = scope.current;
      }
    }, [ref, scope]);

    const animateLoading = async () => {
      await animate(
        ".loader",
        { width: "20px", scale: 1, display: "block" },
        { duration: 0.2 },
      );
    };

    const animateSuccess = async (): Promise<void> => {
      await animate(".loader", { width: "0px", scale: 0, display: "none" }, { duration: 0.2 });
      await animate(
        ".check",
        { width: "20px", scale: 1, display: "block" },
        { duration: 0.2 },
      );
      await animate(
        ".check",
        { width: "0px", scale: 0, display: "none" },
        { delay: 2, duration: 0.2 },
      );
    };

    const { onClick, ...restProps } = props;

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      if (status !== "idle") return;

      const onClickPromise = onClick?.(event);

      if (onClick) {
        setStatus("loading");
        await animateLoading();

        if (onClickPromise && typeof onClickPromise.then === "function") {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await onClickPromise;
        }

        setStatus("success");
        await animateSuccess();

        setTimeout(() => setStatus("idle"), 2200); // Reset after animation
      }
    };

    const isButtonDisabled = disabled || status !== "idle";

    return (
      <motion.button
        ref={scope}
        disabled={isButtonDisabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          isButtonDisabled && disabledClasses,
          className,
        )}
        {...restProps}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleClick}
      >
        <motion.div layout className="flex items-center gap-2">
          <Loader />
          <CheckIcon />
          <motion.span layout>{children}</motion.span>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {status === "loading" && "Loading, please wait."}
            {status === "success" && "Action completed successfully."}
          </span>
        </motion.div>
      </motion.button>
    );
  },
);

Button.displayName = "Button";

const Loader = (): JSX.Element => (
  <motion.svg
    animate={{ rotate: [0, 360] }}
    initial={{ scale: 0, width: 0, display: "none" }}
    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
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
    initial={{ scale: 0, width: 0, display: "none" }}
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
