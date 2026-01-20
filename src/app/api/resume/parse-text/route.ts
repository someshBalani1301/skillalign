/**
 * API Route: Parse Resume Text
 * POST /api/resume/parse-text
 * Parses already extracted text into structured resume data
 */

import { NextRequest, NextResponse } from "next/server";
import { parseResumeText, detectFormattingIssues } from "@/lib/resumeParser";

export async function POST(request: NextRequest) {
  try {
    console.log("Parse-text API called");
    const body = await request.json();
    console.log("Body received:", {
      hasText: !!body.text,
      fileName: body.fileName,
    });
    const { text, fileName } = body;

    if (!text) {
      console.log("No text provided");
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    console.log("Parsing text, length:", text.length);
    console.log("First 200 chars:", text.substring(0, 200));

    // Parse the text into structured data
    const resumeContent = parseResumeText(text);
    console.log("Resume parsed successfully");
    console.log("Parsed content:", {
      hasPersonalInfo: !!resumeContent.personalInfo,
      experienceCount: resumeContent.experience.length,
      educationCount: resumeContent.education.length,
      skillsCount: resumeContent.skills.length,
    });

    // Detect formatting issues
    const formattingIssues = detectFormattingIssues(text);
    console.log("Formatting issues:", formattingIssues);

    // Return parsed resume data
    return NextResponse.json({
      success: true,
      data: {
        content: resumeContent,
        formattingIssues,
        fileName: fileName || "resume.pdf",
      },
    });
  } catch (error) {
    console.error("Text parsing error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    return NextResponse.json(
      {
        error: "Failed to parse resume text",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
