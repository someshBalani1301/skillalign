/**
 * API Route: Calculate ATS Score
 * POST /api/resume/score
 * Calculates ATS compatibility score for a resume
 */

import { NextRequest, NextResponse } from "next/server";
import { calculateATSScore, compareWithJobDescription } from "@/lib/atsScoring";
import { Resume } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume, jobDescription } = body;

    if (!resume) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 },
      );
    }

    // Validate resume structure
    if (!resume.content || !resume.rawText) {
      return NextResponse.json(
        { error: "Invalid resume data structure" },
        { status: 400 },
      );
    }

    // Calculate ATS score
    const atsScore = calculateATSScore(resume as Resume, jobDescription);

    // If job description provided, calculate match
    let matchAnalysis = null;
    if (jobDescription) {
      matchAnalysis = compareWithJobDescription(
        resume as Resume,
        jobDescription,
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        atsScore,
        matchAnalysis,
      },
    });
  } catch (error) {
    console.error("ATS scoring error:", error);
    return NextResponse.json(
      {
        error: "Failed to calculate ATS score",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
