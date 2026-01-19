import { Card, Badge, Button } from "@/components/ui";
import { getImpactColor } from "@/utils/scoreUtils";

interface BulletImprovement {
  original: string;
  improved: string;
  changes: string[];
  impact: "high" | "medium" | "low";
}

interface ImprovementCardProps {
  improvement: BulletImprovement;
  index: number;
  onApply: (index: number) => void;
  canApply: boolean;
}

export default function ImprovementCard({
  improvement,
  index,
  onApply,
  canApply,
}: ImprovementCardProps) {
  return (
    <Card variant="bordered" padding="lg">
      <div className="flex items-start justify-between mb-3">
        <Badge
          variant={
            improvement.impact === "high"
              ? "success"
              : improvement.impact === "medium"
                ? "warning"
                : "neutral"
          }
        >
          {improvement.impact.toUpperCase()} IMPACT
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
            Original
          </h4>
          <p className="text-gray-700">{improvement.original}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
            Improved
          </h4>
          <p className="text-gray-900 font-medium">{improvement.improved}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
            Changes
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {improvement.changes.map((change, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                {change}
              </li>
            ))}
          </ul>
        </div>

        {canApply && (
          <Button
            onClick={() => onApply(index)}
            variant="secondary"
            fullWidth
            className="mt-4 bg-green-600 hover:bg-green-700 focus:ring-green-500"
          >
            Apply to Resume
          </Button>
        )}
      </div>
    </Card>
  );
}
