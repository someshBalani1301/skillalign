/**
 * Score Breakdown Component - Shows detailed category scores
 */

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { capitalize } from "@/utils/formatUtils";
import { getScoreColor } from "@/utils/scoreUtils";

export interface ScoreBreakdownProps {
  breakdown: Record<string, number>;
  className?: string;
}

export default function ScoreBreakdown({
  breakdown,
  className,
}: ScoreBreakdownProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Score Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(breakdown).map(([category, score]) => (
          <Card key={category} variant="bordered" padding="md">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-medium text-gray-600">
                {capitalize(category)}
              </h3>
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
            <ProgressBar value={score} height="md" />
          </Card>
        ))}
      </div>
    </div>
  );
}
