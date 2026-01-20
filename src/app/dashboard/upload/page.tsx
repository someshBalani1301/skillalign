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
import { extractTextFromPDF } from "@/lib/clientPdfParser";

export default function UploadPage() {
  const router = useRouter();
  const { setResume } = useApp();
  const { resume } = useResume();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);

    try {
      console.log(
        "Uploading file:",
        file.name,
        "Type:",
        file.type,
        "Size:",
        file.size,
      );

      let extractedText = "";

      // Parse PDF client-side to avoid Node.js canvas issues
      if (file.type === "application/pdf") {
        console.log("Parsing PDF client-side...");
        extractedText = await extractTextFromPDF(file);
        console.log("PDF text extracted, length:", extractedText.length);
      } else {
        // For DOCX, still use server-side parsing
        console.log("Parsing DOCX server-side...");
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/resume/parse", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to parse resume");
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to parse resume");
        }

        extractedText = result.data.rawText;
      }

      // Send extracted text to server for structured parsing
      console.log("Sending text for structured parsing...");
      const parseResponse = await fetch("/api/resume/parse-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractedText,
          fileName: file.name,
        }),
      });

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        console.error("Parse text API error:", errorData);
        throw new Error(errorData.error || "Failed to parse resume");
      }

      const parseResult = await parseResponse.json();
      console.log("Parse result:", parseResult);

      if (!parseResult.success) {
        console.error("Parse unsuccessful:", parseResult);
        throw new Error(parseResult.error || "Failed to parse resume");
      }

      // Create resume object from parsed data
      const newResume: Resume = {
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        uploadDate: new Date(),
        rawText: extractedText,
        content: parseResult.data.content,
      };

      console.log("Resume created successfully");
      console.log("Resume created:", newResume);

      // Store resume in context
      setResume(newResume);

      // Navigate to score page
      router.push(ROUTES.DASHBOARD.SCORE);
    } catch (error) {
      console.error("Error parsing resume:", error);
      alert(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Failed to parse resume. Please try again with a different file.",
      );
    } finally {
      setIsProcessing(false);
    }
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
