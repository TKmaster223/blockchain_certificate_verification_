import clsx from "classnames";
import type { HTMLAttributes } from "react";

type AlertVariant = "info" | "success" | "warning" | "danger";

const variantClasses: Record<AlertVariant, string> = {
  info: "border-slate-200 bg-slate-50 text-slate-700",
  success: "border-green-200 bg-green-50 text-green-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
};

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1 rounded-xl border px-4 py-3 text-sm",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {title ? <span className="font-semibold">{title}</span> : null}
      {children}
    </div>
  );
}
