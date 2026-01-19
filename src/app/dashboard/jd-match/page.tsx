"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useResume } from "@/hooks/useResume";
import { useJobDescription } from "@/hooks/useJobDescription";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, Alert } from "@/components/ui";
import { BlurredContent } from "@/components/ui/BlurredContent";
import { PricingModal } from "@/components/ui/PricingModal";
import MatchScoreDisplay from "@/components/jd-match/MatchScoreDisplay";
import SkillsComparison from "@/components/jd-match/SkillsComparison";
import { SkillHeatmap } from "@/components/jd-match/SkillHeatmap";
import RequirementsAnalysis from "@/components/jd-match/RequirementsAnalysis";
import SuggestionsList from "@/components/jd-match/SuggestionsList";
import { ROUTES } from "@/lib/constants";

export default function JDMatchPage() {
  const { setJobDescription } = useApp();
  const { hasPremiumAccess, incrementJDCount } = useAuth();
  const { hasResume } = useResume();
  const { jobDescription, matchAnalysis, hasMatchAnalysis } =
    useJobDescription();
  const [jdText, setJdText] = useState(jobDescription?.description || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(hasMatchAnalysis);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const isPremium = hasPremiumAccess();

  if (!hasResume) {
    return (
      <div className="max-w-4xl">
        <PageHeader title="Job Description Match" />
        <Alert variant="warning">
          No resume uploaded yet. Please upload your resume first.
          <div className="mt-4">
            <Button href={ROUTES.DASHBOARD.UPLOAD}>Upload Resume</Button>
          </div>
        </Alert>
      </div>
    );
  }

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      alert("Please paste a job description first");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const newJD = {
        id: Math.random().toString(36).substr(2, 9),
        title: "Job Position",
        company: "Company Name",
        description: jdText,
        requirements: [
          "5+ years of experience",
          "Strong technical skills",
          "Team collaboration",
          "Problem solving",
        ],
        preferredSkills: ["Leadership", "Communication", "Project Management"],
      };
      setJobDescription(newJD);
      setIsAnalyzing(false);
      setShowResults(true);

      // Increment JD analysis count for usage tracking
      incrementJDCount();
    }, 1500);
  };

  const handleUseSample = () => {
    if (jobDescription) {
      setJdText(jobDescription.description);
      setShowResults(true);
    }
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
    setJdText("");
  };

  const handleUnlock = () => {
    setShowPricingModal(true);
  };

  return (
    <div className="max-w-6xl space-y-8">
      <PageHeader
        title="Job Description Match"
        subtitle="Compare your resume against a specific job description"
      />

      <Card padding="lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste Job Description
        </label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          className="w-full h-48 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Paste the complete job description here, including requirements, qualifications, and responsibilities..."
          disabled={showResults}
        />
        <div className="mt-4 flex gap-3">
          <Button
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            disabled={showResults}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Match"}
          </Button>
          <Button
            onClick={handleUseSample}
            variant="outline"
            disabled={showResults}
          >
            Use Sample JD
          </Button>
          {showResults && (
            <Button onClick={handleNewAnalysis} variant="outline">
              New Analysis
            </Button>
          )}
        </div>
      </Card>

      {showResults && matchAnalysis && (
        <div className="space-y-6">
          {/* Free: Show Match Score */}
          <Card variant="elevated" padding="lg">
            <MatchScoreDisplay score={matchAnalysis.matchScore} />
          </Card>

          {/* Premium: Locked detailed analysis */}
          <BlurredContent
            isLocked={!isPremium}
            onUnlock={handleUnlock}
            title="Unlock Detailed Analysis"
            description="Get skill gaps, missing keywords, and actionable suggestions"
          >
            <div className="space-y-6">
              <SkillHeatmap
                matchedSkills={matchAnalysis.matchedSkills}
                missingSkills={matchAnalysis.missingSkills}
              />

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Skills Comparison
                </h2>
                <SkillsComparison
                  matchedSkills={matchAnalysis.matchedSkills}
                  missingSkills={matchAnalysis.missingSkills}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Requirements Analysis
                </h2>
                <RequirementsAnalysis
                  matchedRequirements={matchAnalysis.matchedRequirements}
                  missingRequirements={matchAnalysis.missingRequirements}
                />
              </div>

              <SuggestionsList suggestions={matchAnalysis.suggestions} />

              <Card variant="bordered" padding="lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    href={ROUTES.DASHBOARD.BULLET_IMPROVER}
                    variant="secondary"
                    fullWidth
                  >
                    Improve Bullets
                  </Button>
                  <Button href={ROUTES.DASHBOARD.EXPORT} fullWidth>
                    Export Optimized Resume
                  </Button>
                </div>
              </Card>
            </div>
          </BlurredContent>
        </div>
      )}

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  );
}
