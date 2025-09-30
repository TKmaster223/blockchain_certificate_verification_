import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "classnames";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline-primary-600",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-400",
  outline:
    "border border-slate-300 text-slate-900 hover:bg-slate-100 focus-visible:outline-primary-600",
  danger: "bg-danger text-white hover:bg-red-700 focus-visible:outline-red-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={clsx(baseStyles, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled ?? loading}
      {...props}
    >
      {leftIcon ? <span className="mr-2 flex items-center">{leftIcon}</span> : null}
      {loading ? "Please wait..." : children}
      {rightIcon ? <span className="ml-2 flex items-center">{rightIcon}</span> : null}
    </button>
  )
);

Button.displayName = "Button";
