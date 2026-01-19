"use client";

import { useResume } from "@/hooks/useResume";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import ScoreDisplay from "@/components/score/ScoreDisplay";
import ScoreBreakdown from "@/components/score/ScoreBreakdown";
import KeywordsDisplay from "@/components/score/KeywordsDisplay";
import RecommendationsList from "@/components/score/RecommendationsList";
import { ROUTES } from "@/lib/constants";

export default function ScorePage() {
  const { resume, hasResume } = useResume();
  const { atsScore, refreshScores } = useApp();

  if (!hasResume || !atsScore) {
    return (
      <div className="max-w-4xl">
        <PageHeader title="ATS Score Analysis" />
        <Alert variant="warning">
          No resume uploaded yet. Please upload your resume first.
          <div className="mt-4">
            <Link href={ROUTES.DASHBOARD.UPLOAD}>
              <Button>Upload Resume</Button>
            </Link>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-8">
      <PageHeader
        title="ATS Score Analysis"
        subtitle={`Resume: ${resume?.fileName || ""}`}
        action={{
          label: "Refresh Analysis",
          onClick: refreshScores,
          variant: "outline",
        }}
      />

      {/* Overall Score Card */}
      <Card variant="elevated" padding="lg">
        <p className="text-center text-gray-600 text-lg mb-4">
          Overall ATS Score
        </p>
        <ScoreDisplay score={atsScore.overallScore} size="lg" />
        <p className="mt-6 text-center text-gray-600 max-w-2xl mx-auto">
          Your resume has been analyzed against ATS (Applicant Tracking System)
          best practices.
          {atsScore.overallScore >= 80
            ? " Your resume is well-optimized!"
            : " Follow the recommendations below to improve your score."}
        </p>
      </Card>

      {/* Score Breakdown */}
      <ScoreBreakdown breakdown={atsScore.breakdown} />

      {/* Keywords Analysis */}
      <KeywordsDisplay
        foundKeywords={atsScore.foundKeywords}
        missingKeywords={atsScore.missingKeywords}
      />

      {/* Recommendations */}
      <RecommendationsList recommendations={atsScore.recommendations} />

      {/* Next Steps */}
      <Card
        variant="bordered"
        padding="md"
        className="bg-blue-50 border-blue-200"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={ROUTES.DASHBOARD.JD_MATCH}
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-gray-900">Match with Job</h4>
            <p className="mt-1 text-sm text-gray-600">
              Compare against job descriptions
            </p>
          </Link>
          <Link
            href={ROUTES.DASHBOARD.BULLET_IMPROVER}
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-gray-900">Improve Bullets</h4>
            <p className="mt-1 text-sm text-gray-600">
              Enhance your experience section
            </p>
          </Link>
          <Link
            href={ROUTES.DASHBOARD.EXPORT}
            className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-gray-900">Export Resume</h4>
            <p className="mt-1 text-sm text-gray-600">
              Download optimized version
            </p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
