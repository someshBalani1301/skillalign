/**
 * Keywords Display Component - Shows found and missing keywords
 */

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface KeywordsDisplayProps {
  foundKeywords: string[];
  missingKeywords: string[];
  className?: string;
}

export default function KeywordsDisplay({
  foundKeywords,
  missingKeywords,
  className,
}: KeywordsDisplayProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <Card variant="bordered" padding="md">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Found Keywords ({foundKeywords.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {foundKeywords.map((keyword, idx) => (
            <Badge key={idx} variant="success">
              {keyword}
            </Badge>
          ))}
        </div>
      </Card>

      <Card variant="bordered" padding="md">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Missing Keywords ({missingKeywords.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((keyword, idx) => (
            <Badge key={idx} variant="danger">
              {keyword}
            </Badge>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Consider adding these keywords naturally in your experience section
        </p>
      </Card>
    </div>
  );
}
