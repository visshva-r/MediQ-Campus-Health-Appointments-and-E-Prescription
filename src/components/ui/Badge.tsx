import cn from "@/lib/cn";

export default function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs border", className)} {...props} />;
}
