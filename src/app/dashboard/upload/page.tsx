"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Resume } from "@/types";
import { useResume } from "@/hooks/useResume";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, Alert } from "@/components/ui";
import FileUploadZone from "@/components/upload/FileUploadZone";
import { ROUTES, MESSAGES } from "@/lib/constants";
import { formatDate } from "@/utils";

export default function UploadPage() {
  const router = useRouter();
  const { setResume } = useApp();
  const { resume } = useResume();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);

    // Simulate file processing
    setTimeout(() => {
      const newResume: Resume = {
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        uploadDate: new Date(),
        rawText: "Extracted text from uploaded file...",
        content: {
          personalInfo: {
            name: "Your Name",
            email: "your.email@example.com",
            phone: "+1 (555) 000-0000",
            location: "Your City, State",
          },
          summary: "Professional summary extracted from your resume...",
          experience: [
            {
              id: "exp1",
              company: "Your Company",
              position: "Your Position",
              startDate: "2020-01",
              endDate: "Present",
              bullets: [
                "Achievement or responsibility from your resume",
                "Another achievement with quantifiable results",
                "Key project or initiative you led",
              ],
            },
          ],
          education: [
            {
              id: "edu1",
              institution: "Your University",
              degree: "Your Degree",
              field: "Your Field",
              startDate: "2015-09",
              endDate: "2019-05",
            },
          ],
          skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
        },
      };

      setResume(newResume);
      setIsProcessing(false);
      router.push(ROUTES.DASHBOARD.SCORE);
    }, 2000);
  };

  const handleUseSample = () => {
    router.push(ROUTES.DASHBOARD.SCORE);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Upload Your Resume"
        subtitle="Upload your resume to get started with ATS analysis and optimization"
      />

      <FileUploadZone
        onFileSelect={handleFileSelect}
        isProcessing={isProcessing}
      />

      {resume && (
        <Alert variant="success" title={`Current Resume: ${resume.fileName}`}>
          Uploaded on {formatDate(resume.uploadDate)}
        </Alert>
      )}

      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-gray-900">
          Try with Sample Resume
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Want to see how it works first? Use our sample resume to explore all
          features.
        </p>
        <Button onClick={handleUseSample} variant="outline" className="mt-4">
          Use Sample Resume
        </Button>
      </Card>
    </div>
  );
}
