/**
 * Client-side utilities for resume upload and processing
 */

/**
 * Upload and parse a resume file
 */
export async function uploadAndParseResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/resume/parse", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to parse resume");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error("Failed to parse resume");
  }

  return result.data;
}

/**
 * Calculate ATS score for a resume
 */
export async function calculateResumeScore(
  resume: any,
  jobDescription?: string,
) {
  const response = await fetch("/api/resume/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jobDescription }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to calculate score");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error("Failed to calculate score");
  }

  return result.data;
}

/**
 * Validate file before upload
 */
export function validateResumeFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only PDF and DOCX files are supported.",
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File too large. Maximum size is 5MB.",
    };
  }

  return { valid: true };
}
