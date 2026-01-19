import { Card, Badge } from "@/components/ui";

interface SkillsComparisonProps {
  matchedSkills: string[];
  missingSkills: string[];
}

export default function SkillsComparison({
  matchedSkills,
  missingSkills,
}: SkillsComparisonProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card padding="lg">
        <div className="flex items-center mb-4">
          <svg
            className="h-6 w-6 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="ml-2 text-lg font-bold text-gray-900">
            Matched Skills ({matchedSkills.length})
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {matchedSkills.map((skill, idx) => (
            <Badge key={idx} variant="success">
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex items-center mb-4">
          <svg
            className="h-6 w-6 text-orange-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="ml-2 text-lg font-bold text-gray-900">
            Missing Skills ({missingSkills.length})
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill, idx) => (
            <Badge key={idx} variant="warning">
              {skill}
            </Badge>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Consider adding these skills if you have relevant experience
        </p>
      </Card>
    </div>
  );
}
