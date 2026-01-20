/**
 * Client-side PDF and DOCX parsing
 * Runs in browser to avoid Node.js dependencies
 */

import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Set worker source to use public folder
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

/**
 * Extract text from PDF or DOCX file (client-side)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === "application/pdf") {
    return extractTextFromPDF(file);
  } else if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword"
  ) {
    return extractTextFromDOCX(file);
  }
  throw new Error("Unsupported file type");
}

/**
 * Extract text from PDF file (client-side)
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log("Starting PDF extraction with pdfjs-dist");
    const arrayBuffer = await file.arrayBuffer();
    console.log("ArrayBuffer created, size:", arrayBuffer.byteLength);

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log("PDF loaded, pages:", pdf.numPages);

    let fullText = "";

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Extracting page ${i}/${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Smarter text extraction using position information
      const items = textContent.items as any[];
      let pageText = "";
      let lastX = 0;
      let lastY = 0;

      items.forEach((item, index) => {
        const str = item.str;
        const x = item.transform[4];
        const y = item.transform[5];
        const width = item.width;

        // Add newline if Y position changed significantly (new line)
        if (index > 0 && Math.abs(y - lastY) > 5) {
          pageText += "\n";
          lastX = 0; // Reset X for new line
        }
        // Add space only if there's a significant gap in X position
        else if (index > 0 && x - lastX > 1) {
          pageText += " ";
        }

        pageText += str;
        lastX = x + width;
        lastY = y;
      });

      fullText += pageText + "\n\n";
      console.log(`Page ${i} text length:`, pageText.length);
    }

    console.log("Total extracted text length:", fullText.length);
    console.log("First 200 chars:", fullText.substring(0, 200));
    return fullText;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

/**
 * Extract text from DOCX file (client-side)
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    console.log("Starting DOCX extraction with mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    console.log("DOCX text extracted, length:", result.value.length);
    return result.value.trim();
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error("Failed to extract text from DOCX");
  }
}
