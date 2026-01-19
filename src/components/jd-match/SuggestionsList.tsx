import { Card } from "@/components/ui";

interface SuggestionsListProps {
  suggestions: string[];
}

export default function SuggestionsList({ suggestions }: SuggestionsListProps) {
  return (
    <Card variant="default" padding="lg" className="bg-blue-50 border-blue-200">
      <h2 className="text-lg font-bold text-blue-900 mb-4">
        Optimization Suggestions
      </h2>
      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <div key={idx} className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-3 text-blue-900">{suggestion}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
