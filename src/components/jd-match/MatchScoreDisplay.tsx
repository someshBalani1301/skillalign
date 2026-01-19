import {
  getScoreColor,
  getScoreBgColor,
  getScoreLabel,
} from "@/utils/scoreUtils";

interface MatchScoreDisplayProps {
  score: number;
  maxScore?: number;
}

export default function MatchScoreDisplay({
  score,
  maxScore = 100,
}: MatchScoreDisplayProps) {
  const colorClass = getScoreColor(score);
  const bgClass = getScoreBgColor(score);
  const label = getScoreLabel(score);

  return (
    <div className="text-center">
      <p className="text-gray-600 text-lg mb-4">Match Score</p>
      <div className="mt-4 relative inline-block">
        <div className="text-6xl font-bold">
          <span className={colorClass}>{score}%</span>
        </div>
        <div className={`mt-2 px-4 py-1 rounded-full ${bgClass}`}>
          <span className={`font-semibold ${colorClass}`}>{label} Match</span>
        </div>
      </div>
      <p className="mt-4 text-gray-600">
        Your resume matches {score}% of the job requirements
      </p>
    </div>
  );
}
