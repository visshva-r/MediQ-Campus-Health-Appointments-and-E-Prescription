"use client";
import cn from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export default function Button({ variant="primary", loading, className, children, ...props }: Props) {
  const base = "px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition";
  const theme = {
    primary:  "bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-400",
    secondary:"bg-neutral-800 hover:bg-neutral-700 text-white focus:ring-neutral-500",
    danger:   "bg-red-600 hover:bg-red-500 text-white focus:ring-red-400",
  }[variant];

  return (
    <button className={cn(base, theme, className)} disabled={loading || props.disabled} {...props}>
      {loading ? "Please wait..." : children}
    </button>
  );
}
