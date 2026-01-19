/**
 * Utility functions for score calculations and formatting
 */

import { SCORE_THRESHOLDS, COLORS } from "@/lib/constants";

/**
 * Get color class based on score value
 */
export function getScoreColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return COLORS.SCORE.EXCELLENT;
  if (score >= SCORE_THRESHOLDS.GOOD) return COLORS.SCORE.GOOD;
  return COLORS.SCORE.NEEDS_IMPROVEMENT;
}

/**
 * Get background color class based on score value
 */
export function getScoreBgColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return COLORS.BG.EXCELLENT;
  if (score >= SCORE_THRESHOLDS.GOOD) return COLORS.BG.GOOD;
  return COLORS.BG.NEEDS_IMPROVEMENT;
}

/**
 * Get score label based on score value
 */
export function getScoreLabel(score: number): string {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return "Excellent";
  if (score >= SCORE_THRESHOLDS.GOOD) return "Good";
  return "Needs Improvement";
}

/**
 * Get progress bar color based on score
 */
export function getProgressColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return "bg-green-500";
  if (score >= SCORE_THRESHOLDS.GOOD) return "bg-yellow-500";
  return "bg-red-500";
}

/**
 * Get impact color classes
 */
export function getImpactColor(impact: "high" | "medium" | "low"): string {
  switch (impact) {
    case "high":
      return COLORS.BADGE.SUCCESS;
    case "medium":
      return COLORS.BADGE.WARNING;
    case "low":
      return COLORS.BADGE.NEUTRAL;
    default:
      return COLORS.BADGE.NEUTRAL;
  }
}
