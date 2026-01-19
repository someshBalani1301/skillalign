/**
 * Reusable Progress Bar Component
 */

import { cn } from "@/utils/formatUtils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color,
  height = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const defaultColor =
    percentage >= 80
      ? "bg-green-500"
      : percentage >= 60
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="font-medium">{value}</span>
          <span className="text-gray-500">/ {max}</span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          heights[height],
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-300",
            color || defaultColor,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
