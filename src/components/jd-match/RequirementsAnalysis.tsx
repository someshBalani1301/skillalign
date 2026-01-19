import { Card } from "@/components/ui";

interface RequirementsAnalysisProps {
  matchedRequirements: string[];
  missingRequirements: string[];
}

export default function RequirementsAnalysis({
  matchedRequirements,
  missingRequirements,
}: RequirementsAnalysisProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card padding="lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          ✓ Matched Requirements
        </h2>
        <ul className="space-y-2">
          {matchedRequirements.map((req, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-green-500 mr-2 mt-0.5">✓</span>
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card padding="lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          ⚠ Missing Requirements
        </h2>
        <ul className="space-y-2">
          {missingRequirements.map((req, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-orange-500 mr-2 mt-0.5">⚠</span>
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
