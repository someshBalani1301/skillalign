/**
 * Score Display Component - Shows ATS score with visual elements
 */

import {
  getScoreColor,
  getScoreBgColor,
  getScoreLabel,
} from "@/utils/scoreUtils";
import { cn } from "@/utils/formatUtils";

export interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function ScoreDisplay({
  score,
  maxScore = 100,
  size = "md",
  showLabel = true,
  className,
}: ScoreDisplayProps) {
  const sizes = {
    sm: {
      score: "text-4xl",
      max: "text-2xl",
      badge: "text-xs px-3 py-1",
    },
    md: {
      score: "text-6xl",
      max: "text-4xl",
      badge: "text-sm px-4 py-1",
    },
    lg: {
      score: "text-7xl",
      max: "text-5xl",
      badge: "text-base px-4 py-1",
    },
  };

  return (
    <div className={cn("text-center", className)}>
      <div className="relative inline-block">
        <div className="font-bold">
          <span className={cn(sizes[size].score, getScoreColor(score))}>
            {score}
          </span>
          <span className={cn(sizes[size].max, "text-gray-400")}>
            /{maxScore}
          </span>
        </div>
        {showLabel && (
          <div
            className={cn(
              "mt-2 rounded-full font-semibold",
              sizes[size].badge,
              getScoreBgColor(score),
              getScoreColor(score),
            )}
          >
            {getScoreLabel(score)}
          </div>
        )}
      </div>
    </div>
  );
}
