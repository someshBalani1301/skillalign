import { Alert, Button } from "@/components/ui";

interface SuggestionsListProps {
  suggestions: Array<{ category: string; examples: string[] }> | string[];
  onViewAll: () => void;
}

export default function BulletSuggestions({
  suggestions,
  onViewAll,
}: SuggestionsListProps) {
  const flatSuggestions = Array.isArray(suggestions)
    ? typeof suggestions[0] === "string"
      ? (suggestions as string[])
      : (
          suggestions as Array<{ category: string; examples: string[] }>
        ).flatMap((s) => s.examples)
    : [];

  return (
    <Alert variant="info" title="💡 Improvement Tips">
      <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
        {flatSuggestions.slice(0, 4).map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
      {flatSuggestions.length > 4 && (
        <Button onClick={onViewAll} variant="ghost" size="sm" className="mt-3">
          View All Tips
        </Button>
      )}
    </Alert>
  );
}
