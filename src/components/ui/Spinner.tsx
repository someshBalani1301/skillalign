/**
 * Reusable Spinner/Loading Component
 */

import { cn } from "@/utils/formatUtils";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function Spinner({
  size = "md",
  className,
  text,
}: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-gray-900",
          sizes[size],
        )}
      />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}
