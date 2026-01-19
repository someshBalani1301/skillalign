"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { improveBullet, bulletSuggestions } from "@/lib/mockData";
import { useResume } from "@/hooks/useResume";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, Alert } from "@/components/ui";
import { ImpactMeter } from "@/components/ui/ImpactMeter";
import ImprovementCard from "@/components/bullet/ImprovementCard";
import BulletSuggestions from "@/components/bullet/BulletSuggestions";
import { DiffViewer } from "@/components/bullet/DiffViewer";
import { ROUTES } from "@/lib/constants";

export default function BulletImproverPage() {
  const { setResume } = useApp();
  const { resume, hasResume } = useResume();
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [customBullet, setCustomBullet] = useState("");
  const [improvements, setImprovements] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (!hasResume) {
    return (
      <div className="max-w-4xl">
        <PageHeader title="Bullet Point Improver" />
        <Alert variant="warning">
          No resume uploaded yet. Please upload your resume first.
          <div className="mt-4">
            <Button href={ROUTES.DASHBOARD.UPLOAD}>Upload Resume</Button>
          </div>
        </Alert>
      </div>
    );
  }

  const handleImproveFromResume = () => {
    if (!selectedExperience) {
      alert("Please select an experience to improve");
      return;
    }

    const experience = resume!.content.experience.find(
      (exp) => exp.id === selectedExperience,
    );

    if (experience) {
      const newImprovements = experience.bullets.map((bullet) =>
        improveBullet(bullet),
      );
      setImprovements(newImprovements);
    }
  };

  const handleImproveCustom = () => {
    if (!customBullet.trim()) {
      alert("Please enter a bullet point to improve");
      return;
    }

    const improvement = improveBullet(customBullet);
    setImprovements([improvement]);
  };

  const handleApplyImprovement = (index: number) => {
    if (!selectedExperience || !resume) return;

    const updatedResume = {
      ...resume,
      content: {
        ...resume.content,
        experience: resume.content.experience.map((exp) => {
          if (exp.id === selectedExperience) {
            const newBullets = [...exp.bullets];
            newBullets[index] = improvements[index].improved;
            return { ...exp, bullets: newBullets, isImproved: true };
          }
          return exp;
        }),
      },
    };

    setResume(updatedResume);
    alert("Improvement applied to your resume!");
  };

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Bullet Point Improver"
        subtitle="Transform your experience bullets into powerful, ATS-friendly statements"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Improve from Resume */}
          <Card padding="lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Improve from Your Resume
            </h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Experience
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select an experience --</option>
              {resume!.content.experience.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.position} at {exp.company}
                </option>
              ))}
            </select>

            {selectedExperience && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Current Bullets:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {resume!.content.experience
                    .find((exp) => exp.id === selectedExperience)
                    ?.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        {bullet}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <Button
              onClick={handleImproveFromResume}
              fullWidth
              className="mt-4"
            >
              Improve These Bullets
            </Button>
          </Card>

          {/* Custom Bullet Input */}
          <Card padding="lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Improve Custom Bullet
            </h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Bullet Point
            </label>
            <textarea
              value={customBullet}
              onChange={(e) => setCustomBullet(e.target.value)}
              className="w-full h-24 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Worked on building features for the application"
            />
            <Button
              onClick={handleImproveCustom}
              variant="secondary"
              fullWidth
              className="mt-4"
            >
              Improve This Bullet
            </Button>
          </Card>

          {/* Improvements Results */}
          {improvements.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Improved Versions
              </h2>
              {improvements.map((improvement, idx) => (
                <div key={idx} className="space-y-3">
                  <DiffViewer
                    original={improvement.original}
                    improved={improvement.improved}
                    title={`Bullet ${idx + 1}`}
                  />
                  <Card variant="bordered" padding="md" className="bg-blue-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          💡 {improvement.reason}
                        </p>
                        <ImpactMeter impact={improvement.impact} size="md" />
                      </div>
                      {selectedExperience && (
                        <Button
                          onClick={() => handleApplyImprovement(idx)}
                          size="sm"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <BulletSuggestions
            suggestions={bulletSuggestions}
            onViewAll={() => setShowSuggestions(!showSuggestions)}
          />

          <Card variant="bordered" padding="lg">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                href={ROUTES.DASHBOARD.SCORE}
                variant="outline"
                size="sm"
                fullWidth
              >
                View ATS Score
              </Button>
              <Button
                href={ROUTES.DASHBOARD.JD_MATCH}
                variant="outline"
                size="sm"
                fullWidth
              >
                Match with JD
              </Button>
              <Button
                href={ROUTES.DASHBOARD.EXPORT}
                variant="outline"
                size="sm"
                fullWidth
              >
                Export Resume
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
