"use client";

import { useApp } from "@/context/AppContext";
import { useResume } from "@/hooks/useResume";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, Alert } from "@/components/ui";
import StatsCard from "@/components/export/StatsCard";
import ExportOption from "@/components/export/ExportOption";
import { ROUTES } from "@/lib/constants";

export default function ExportPage() {
  const { atsScore, matchAnalysis } = useApp();
  const { resume, hasResume } = useResume();

  if (!hasResume) {
    return (
      <div className="max-w-4xl">
        <PageHeader title="Export Resume" />
        <Alert variant="warning">
          No resume uploaded yet. Please upload your resume first.
          <div className="mt-4">
            <Button href={ROUTES.DASHBOARD.UPLOAD}>Upload Resume</Button>
          </div>
        </Alert>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    alert(
      "PDF generation will be implemented with a backend API. For now, this shows your optimized resume data in the preview.",
    );
  };

  const handleDownloadDOCX = () => {
    alert("DOCX generation will be implemented with a backend API.");
  };

  const handleDownloadTXT = () => {
    if (!resume) return;
    const resumeText = generatePlainText();
    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.content.personalInfo.name.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePlainText = () => {
    if (!resume) return "";
    const {
      personalInfo,
      summary,
      experience,
      education,
      skills,
      certifications,
    } = resume.content;

    let text = `${personalInfo.name.toUpperCase()}\n`;
    text += `${personalInfo.email} | ${personalInfo.phone || ""} | ${personalInfo.location || ""}\n`;
    if (personalInfo.linkedIn) text += `LinkedIn: ${personalInfo.linkedIn}\n`;
    if (personalInfo.github) text += `GitHub: ${personalInfo.github}\n`;
    text += `\n${"=".repeat(80)}\n\n`;

    if (summary) {
      text += `PROFESSIONAL SUMMARY\n${"-".repeat(80)}\n${summary}\n\n`;
    }

    text += `PROFESSIONAL EXPERIENCE\n${"-".repeat(80)}\n`;
    experience.forEach((exp) => {
      text += `\n${exp.position} | ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.endDate}${exp.location ? " | " + exp.location : ""}\n`;
      exp.bullets.forEach((bullet) => {
        text += `• ${bullet}\n`;
      });
      text += "\n";
    });

    text += `\nEDUCATION\n${"-".repeat(80)}\n`;
    education.forEach((edu) => {
      text += `${edu.degree} in ${edu.field}\n`;
      text += `${edu.institution} | ${edu.startDate} - ${edu.endDate}\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
      text += "\n";
    });

    text += `TECHNICAL SKILLS\n${"-".repeat(80)}\n`;
    text += skills.join(" • ") + "\n\n";

    if (certifications && certifications.length > 0) {
      text += `CERTIFICATIONS\n${"-".repeat(80)}\n`;
      certifications.forEach((cert) => {
        text += `• ${cert}\n`;
      });
    }

    return text;
  };

  const handleCopyToClipboard = () => {
    const text = generatePlainText();
    navigator.clipboard.writeText(text);
    alert("Resume copied to clipboard!");
  };

  const downloadIcon = (
    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
        clipRule="evenodd"
      />
    </svg>
  );

  const copyIcon = (
    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
  );

  return (
    <div className="max-w-6xl space-y-8">
      <PageHeader
        title="Export Your Resume"
        subtitle="Download your optimized resume in various formats"
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="ATS Score"
          value={`${atsScore?.overallScore || 0}/100`}
          subtitle="Ready to apply"
          color="blue"
        />

        {matchAnalysis && (
          <StatsCard
            title="Job Match"
            value={`${matchAnalysis.matchScore}%`}
            subtitle="Compatibility"
            color="green"
          />
        )}

        <StatsCard
          title="Skills Listed"
          value={resume!.content.skills.length}
          subtitle="Technical skills"
          color="purple"
        />
      </div>

      {/* Export Options */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Download Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExportOption
            title="PDF Format"
            description="Best for online applications"
            icon={downloadIcon}
            onClick={handleDownloadPDF}
            color="red"
          />

          <ExportOption
            title="Word Document"
            description="Easy to edit further"
            icon={downloadIcon}
            onClick={handleDownloadDOCX}
            color="blue"
          />

          <ExportOption
            title="Plain Text"
            description="Universal compatibility"
            icon={downloadIcon}
            onClick={handleDownloadTXT}
            color="green"
          />

          <ExportOption
            title="Copy to Clipboard"
            description="Quick paste anywhere"
            icon={copyIcon}
            onClick={handleCopyToClipboard}
            color="gray"
          />
        </div>
      </Card>

      {/* Quick Actions */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Need More Improvements?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button href={ROUTES.DASHBOARD.SCORE} variant="outline">
            Check ATS Score
          </Button>
          <Button href={ROUTES.DASHBOARD.JD_MATCH} variant="outline">
            Match with Job
          </Button>
          <Button href={ROUTES.DASHBOARD.BULLET_IMPROVER} variant="outline">
            Improve Bullets
          </Button>
        </div>
      </Card>
    </div>
  );
}
