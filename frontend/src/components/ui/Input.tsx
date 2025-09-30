import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import clsx from "classnames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => (
    <label className="flex w-full flex-col gap-1 text-sm text-slate-700">
      {label ? <span className="font-medium text-slate-900">{label}</span> : null}
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200",
          error && "border-danger focus:ring-danger/20",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
      {helperText && !error ? <span className="text-xs text-slate-500">{helperText}</span> : null}
    </label>
  )
);

Input.displayName = "Input";
