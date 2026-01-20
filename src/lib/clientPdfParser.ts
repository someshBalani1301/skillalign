/**
 * Client-side PDF parsing using PDF.js
 * Runs in browser to avoid Node.js canvas issues
 */

import * as pdfjsLib from "pdfjs-dist";

// Set worker source to use public folder
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
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
export async function extractTextFromDOCX(file: File): Promise<string> {
  // For DOCX, we still need server-side processing
  // Return empty string and let server handle it
  return "";
}
