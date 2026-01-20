/**
 * API Route: Parse Resume
 * POST /api/resume/parse
 * Extracts text and structured data from PDF/DOCX files
 */

import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { parseResumeText, detectFormattingIssues } from "@/lib/resumeParser";

// Use require for pdf-parse due to CommonJS compatibility
const getPdfParser = () => {
  return require("pdf-parse");
};

export async function POST(request: NextRequest) {
  try {
    console.log("Resume parse API called");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("File received:", file ? file.name : "No file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("File type:", file.type, "Size:", file.size);

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX files are supported." },
        { status: 400 },
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 },
      );
    }

    // Extract text based on file type
    let extractedText = "";

    console.log("Starting text extraction...");

    if (file.type === "application/pdf") {
      extractedText = await extractTextFromPDF(file);
    } else {
      extractedText = await extractTextFromDocx(file);
    }

    console.log("Text extracted, length:", extractedText.length);

    // Parse the extracted text into structured data
    const resumeContent = parseResumeText(extractedText);
    console.log("Resume parsed successfully");

    // Detect formatting issues
    const formattingIssues = detectFormattingIssues(extractedText);

    // Return parsed resume data
    return NextResponse.json({
      success: true,
      data: {
        rawText: extractedText,
        content: resumeContent,
        formattingIssues,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
    });
  } catch (error) {
    console.error("Resume parsing error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    return NextResponse.json(
      {
        error: "Failed to parse resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * Extract text from PDF file
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfParse = getPdfParser();
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(
      "Failed to extract text from PDF. The file may be corrupted or password-protected.",
    );
  }
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("DOCX parsing error:", error);
    throw new Error(
      "Failed to extract text from DOCX. The file may be corrupted.",
    );
  }
}
